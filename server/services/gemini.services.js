
const Gemini_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";

const extractJsonCandidate = (text) => {
  if (!text) return "";
  const cleaned = String(text).replace(/```json/g, "").replace(/```/g, "").trim();
  if (cleaned.startsWith("{") && cleaned.endsWith("}")) return cleaned;

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return cleaned.slice(firstBrace, lastBrace + 1);
  }
  return cleaned;
};

export const generateGeminiResponse = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const err = new Error("Missing GEMINI_API_KEY");
    err.statusCode = 500;
    throw err;
  }

  try {
    const response = await fetch(`${Gemini_URL}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const bodyText = await response.text();
      const err = new Error(
        `Gemini API error ${response.status}: ${bodyText?.slice(0, 500) || "Unknown error"}`
      );
      err.statusCode = response.status;
      throw err;
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      const err = new Error("No text returned from Gemini");
      err.statusCode = 502;
      throw err;
    }

    const jsonCandidate = extractJsonCandidate(text);
    try {
      return JSON.parse(jsonCandidate);
    } catch {
      const err = new Error("Gemini returned invalid JSON");
      err.statusCode = 502;
      err.details = { snippet: String(jsonCandidate).slice(0, 500) };
      throw err;
    }
  } catch (error) {
    // Keep the original status/message so callers can decide to fallback.
    console.error("Gemini Fetch Error:", error?.message || error);
    throw error;
  }
};
