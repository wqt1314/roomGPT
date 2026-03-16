// 专门为 Nano Banana 2 优化的渲染代码
export default async function handler(req, res) {
  const { imageUrl, theme, room } = req.body;

  // 1. 调用 Nano Banana 2 (Gemini 3.1 Flash Image)
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${process.env.GOOGLE_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: `你是一个专业的建筑渲染师。请参考这张模型截图的结构，将其渲染成一个精美的${theme}${room}效果图。要求：极致写实，灯光考究，4K 画质。` },
            { inline_data: { mime_type: "image/png", data: imageUrl.split(",")[1] } }
          ]
        }],
        generationConfig: { response_modalities: ["IMAGE"] }
      }
    )
  );

  const data = await response.json();
  
  // 2. 提取生成的图片 Base64
  const generatedBase64 = data.candidates[0].content.parts[0].inline_data.data;
  
  // 3. 返回给前端展示
  res.status(200).json({
    generated: `data:image/png;base64,${generatedBase64}`
  });
}
