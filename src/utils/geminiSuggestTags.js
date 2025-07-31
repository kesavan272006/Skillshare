export async function suggestTagsWithGemini({ title, description }) {
  const apiKey = "AIzaSyD6m3mj3D7M-6W2G_CkGAaEhXX7E-AXYfw";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const prompt = `Suggest 5 relevant, short, comma-separated tags for a skill-sharing session with the following details:\nTitle: ${title}\nDescription: ${description}\nTags:`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (
      data &&
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts[0] &&
      data.candidates[0].content.parts[0].text
    ) {
      return data.candidates[0].content.parts[0].text
        .replace(/\n/g, '')
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);
    }
    return [];
  } catch (err) {
    console.error("Gemini tag suggestion error:", err);
    return [];
  }
} 