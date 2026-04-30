import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { story, slideCount, bgImage } = await req.json();
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Kamu adalah AI TikTok. Potong cerita ini jadi ${slideCount} bagian untuk slide. 
  Aturan: Slide 1 hook max 15 kata yang bikin penasaran. 
  Slide 2 sampai ${slideCount-1} max 25 kata per slide, potong di kalimat yang pas. 
  Slide ${slideCount} ending gantung + CTA "Komen MAU buat lanjut". 
  Output HANYA JSON array string, contoh: ["teks 1", "teks 2"]. 
  Cerita: ${story}`;

  const result = await model.generateContent(prompt);
  const texts = JSON.parse(result.response.text().replace(/```json|```/g, '').trim());

  return NextResponse.json({ images: texts.map((t:string) => `data:image/svg+xml,${encodeURIComponent(`
    <svg width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
      <image href="${bgImage}" width="1080" height="1920" preserveAspectRatio="xMidYMid slice"/>
      <rect width="1080" height="1920" fill="black" opacity="0.7"/>
      <foreignObject x="80" y="550" width="920" height="900">
        <div xmlns="http://www.w3.org/1999/xhtml" style="color:white;font-size:58px;font-family:sans-serif;font-weight:700;text-align:center;display:flex;align-items:center;justify-content:center;height:100%;line-height:1.3;text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">
          ${t}
        </div>
      </foreignObject>
    </svg>
  `)}`) });
}
