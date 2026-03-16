// pages/api/generate.ts 简化版
export default async function handler(req, res) {
  const { imageUrl } = req.body;
  
  // 这就是调用你的 Nano Banana 2
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${process.env.GOOGLE_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: "Render this 3D model screenshot into a photorealistic architectural image." },
            { inline_data: { mime_type: "image/png", data: imageUrl.split(",")[1] } }
          ]
        }],
        generationConfig: { response_modalities: ["IMAGE"] }
      })
    }
  );

  const data = await response.json();
  const base64Image = data.candidates[0].content.parts[0].inline_data.data;

  res.status(200).json({ generated: `data:image/png;base64,${base64Image}` });
}
