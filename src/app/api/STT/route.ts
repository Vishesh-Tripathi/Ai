import { NextRequest } from "next/server";

export async function POST(req:NextRequest){
    const formData = await req.formData(); // geting form data
    const file = formData.get('audio') as File; // extracting audio 
    if(!file) {
        return new Response(JSON.stringify({ error: "No audio file provided" }), { status: 400 });
    }
     const groqFormData = new FormData();
     groqFormData.append('file', file); // appending file to form data
        groqFormData.append('model', 'distil-whisper-large-v3-en'); // specifying the model
}