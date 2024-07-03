
'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '../../utils/supabase/client';

const supabase = createClient();

const Home: React.FC = () => {
  // state variables
  const [theme, setTheme] = useState<string>('');
  const [newTheme, setNewTheme] = useState<string>('');
  const [isLoading, setisLoading] = useState(false)
  const [curriculum, setCurriculum] = useState<string>('');
  const [themes, setThemes] = useState<string[]>([]);


   //useEffect hook to fetch themes from the database when the component mounts.
   //The empty dependency array `[]` ensures this runs only once.
  useEffect(() => {
    const fetchThemes = async () => {
      const { data, error } = await supabase.from('preferences').select('theme');
      if (error) {
        console.error('error fetching themes:', error);
      } else {
        setThemes(data.map((item: {theme: string }) => item.theme));
      }
    };

    fetchThemes();
  }, []);


  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value); // Update the theme state with the selected value
  };

  const handleNewThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTheme(e.target.value); // Update the new theme state with the input value
  };

  const handleGenerateClick = async () => {
    setisLoading(true)
    const currentTheme = newTheme || theme;

    if (!currentTheme) {
      console.error('no theme selected or inputted');
      setisLoading(false);
      return;
    }


    // Send a POST request to the generate API endpoint
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ theme: currentTheme }), // Send the selected theme in the request body
    });

    const data = await response.json();
    // Check if the response is OK (sttus 200) and update the curriculum state with the generated curriculum
    if (response.ok) {
      setCurriculum(data.curriculum); // Set the curriculum state with the response data
      if (newTheme && !themes.includes(newTheme)) {
        setThemes([...themes, newTheme]); // Add the new theme to the themes list
        setNewTheme(''); // Clear the new theme input
      }
    } else {
      console.error('Error:', data.error); // Log any errors
    }
    setisLoading(false)
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen min-w-full bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-6">Create Custom Curriculum</h1>
      <select
        value={theme}
        onChange={handleThemeChange}
        className="p-3 mb-4 border border-gray-400 rounded bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select Theme</option>
        {themes.map((themeOption) => (
          <option key={themeOption} value={themeOption}>
            {themeOption}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Or enter a new theme"
        value={newTheme}
        onChange={handleNewThemeChange}
        className="p-3 mb-4 border border-gray-400 rounded bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleGenerateClick}
        className={`text-white px-4 hover:scale-[1.05] py-2 rounded ${isLoading || (!theme && !newTheme) ? 'bg-gray-300 border-2 border-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
        disabled={isLoading || (!theme && !newTheme)}
      >
        Generate
      </button>
      {curriculum && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto text-left">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">Generated Curriculum</h2>
          <p className="text-gray-800 whitespace-pre-line leading-relaxed">{curriculum}</p>
        </div>
      )}
    </div>
  );
};

export default Home;