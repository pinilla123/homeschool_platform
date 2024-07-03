
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/client';
import OpenAI from 'openai';

const supabase = createClient();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

// Handler function for POST request
// this function is asynchronous because it involves network requests and database operations
export async function POST(req: NextRequest) {
    console.log('POST request received'); // Log request received

    try {
        const { theme } = await req.json();
        console.log('Received theme:', theme); // Log received theme

        // check if the theme already exists in the database
        const {data: existingThemes, error: fetchError } = await supabase
            .from('preferences')
            .select('*')
            .eq('theme', theme);

        if (fetchError) {
            console.error('Error fetching themes:', fetchError); // Log fetch error
            return NextResponse.json({ error: fetchError.message }, { status: 500 });
        }

        if (existingThemes && existingThemes.length > 0) {
            console.log('Theme already exists. Fetching existing curriculum.'); // log existing theme found
            const existingCurriculum = existingThemes[0].curriculum;
            return NextResponse.json({ curriculum: existingCurriculum });
        }

        // if theme does not exist, generate new curriculum
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
            .insert([{ theme, curriculum }]);

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

