// app/home/page.tsx

// 'use client' directive to ensure this component is rendered on the client-side
// This is necessary because Next.js can render components on both the server and client,
// but we want this component to run entirely on the client.
'use client';

// Import necessary libraries and hooks from React for managing state and lifecycle
// also, import the createClient function from the utils directory to initialize supabase
import React, { useState } from 'react';
import { createClient } from '../../utils/supabase/client';

// Create a Supabase client instance
// this will allow us to interact with our supabase database
const supabase = createClient();

// Define the Home component using the React functional component syntax.
const Home: React.FC = () => {
  // State variable to store the selected theme
  // usestate is a react hook that allows us to add state to a functional component
  const [theme, setTheme] = useState<string>('');

  // State variable to store the generated curriculum
  const [curriculum, setCurriculum] = useState<string>('');


  // Handler function for theme change event
  // this function updates the theme state when the user selects a new theme from the dropdown
  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value); // Update the theme state with the selected value
  };


  // Handler function for generating curriculum
  // this function send the selected theme to the severless function and retrieves the generated curriculum
  const handleGenerateClick = async () => {
    // Send a POST request to the generate API endpoint
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ theme }), // Send the selected theme in the request body
    });

    // Parse the response data from the server
    const data = await response.json();
    // Check if the response is OK (sttus 200) and update the curriculum state with the generated curriculum
    if (response.ok) {
      setCurriculum(data.curriculum); // Set the curriculum state with the response data
    } else {
      console.error('Error:', data.error); // Log any errors
    }
  };

  return (
    <div>
      <h1>Create Custom Curriculum</h1>
      {/* Dropdown for selecting a theme. The value is controlled by the theme state. */}
      <select 
        value={theme} 
        onChange={handleThemeChange}
        style={{
            color: '#333333',
            backgroundColor: '#f0f0f0',
            borderColor: '#cccccc',
            padding: '8px',
            borderRadius: '4px'
        }}
        >

        <option value="">Select Theme</option>
        <option value="minecraft">Minecraft</option>
        <option value="superheroes">Superheroes</option>
      </select>
      {/* Button to trigger the generation of curriculum. */}
      <button onClick={handleGenerateClick}>Generate</button>
      {/* Display the generated curriculum if it exists. */}
      {curriculum && <div>{curriculum}</div>}
    </div>
  );
};

// Export the Home component as the default export from this module
export default Home;
