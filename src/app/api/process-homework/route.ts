import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not set' }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Convert File to Buffer then to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString('base64');

    const prompt = `You are a teacher's assistant. Read this homework assignment sheet and extract the tasks. 
    Return ONLY a valid JSON array of objects. Each object should have the following fields:
    - title: A brief description of the task.
    - subject: The academic subject (e.g., Mathematics, Science, English, History).
    - dueDate: The due date if found, otherwise an estimate or 'TBD' (YYYY-MM-DD format if possible).
    
    Do not use markdown code blocks like \`\`\`json. Return only the raw JSON string.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();
    
    // Clean potential markdown blocks if AI ignored instructions
    const jsonString = text.replace(/```json|```/g, '').trim();
    
    try {
      const homeworkItems = JSON.parse(jsonString);
      return NextResponse.json(homeworkItems);
    } catch (parseError) {
      console.error('JSON Parse Error:', text);
      return NextResponse.json({ error: 'Failed to parse AI response', raw: text }, { status: 500 });
    }

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
