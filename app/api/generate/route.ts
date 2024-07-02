// app/api/generate/route.ts

// Import necessary modules for handling API requests and responses
import { NextRequest, NextResponse } from 'next/server';
// Import the Supabase client
import { createClient } from '../../../utils/supabase/client';
// Import the OpenAI API client
import OpenAI from 'openai';

// Create an instance of the Supabase client
const supabase = createClient();
// Create an instance of the OpenAI client with the API key from environment variables
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
})

// Define an async function to handle POST requests
// need to change to this request so rht the curriculium is stored in the data base and the funciton needs to check that the curriculum is already i the database, if it is return the currirulmun by theme
// user input could make new curriculums
export async function POST(req: NextRequest) {
    console.log('POST request received'); // Log request received

    try {
        const { theme } = await req.json();
        console.log('Received theme:', theme); // Log received theme

        const prompt = `Create a physics curriculum based on the theme: ${theme}`;
        console.log('Sending prompt to OpenAI:', prompt); // Log prompt

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 1000,
        });
        console.log('OpenAI response received:', response); // Log OpenAI response

        const curriculum = response.choices[0].message.content;
        console.log('Generated curriculum:', curriculum); // Log generated curriculum

        const { data, error } = await supabase
            .from('preferences')
            .insert([{ theme }]);
        if (error) {
            console.error('Supabase error:', error); // Log Supabase error
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        console.log('Curriculum stored in Supabase'); // Log success message
        return NextResponse.json({ curriculum });
    } catch (error: any) {
        console.error('Error:', error.message); // Log any other errors
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}













//     // Parse the request body to get the theme
//     const { theme } = await req.json();

//     // Create a prompt for the OpenAI API based on the selected theme
//     const prompt = `Create a physics curriculum based on the theme: ${theme}`;

//     try {
//         // Send the prompt to the OpenAI API and get the response
//         const response = await openai.completions.create({
//         model: 'gpt-3.5-turbo',
//         prompt,
//         max_tokens: 1000,
//         });

//         // Extract the generated curriculum from the response
//         const curriculum = response.choices[0].text;

//         // Insert the selected theme into the Supabase database
//         const { data, error } = await supabase
//         .from('preferences')
//         .insert([{ theme }]);

//         // Handle any errors that occur during the database insertion
//         if (error) {
//         return NextResponse.json({ error: error.message }, { status: 500 });
//         }

//         // Return the generated curriculum in the response
//         return NextResponse.json({ curriculum });
//     } catch (error) {
//         // Return any errors that occur during the OpenAI API request
//         return NextResponse.json({ error: (error as Error).message }, { status: 500 }); // need to learn how to correctly return errors in next.js
//     }
// }
