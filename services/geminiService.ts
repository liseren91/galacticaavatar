import { GoogleGenAI } from "@google/genai";

const getBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const generateCharacterImage = async (
  file: File, 
  role: string
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const base64Data = await getBase64(file);

    // Using gemini-2.5-flash-image (Nano Banana) as requested
    const model = 'gemini-2.5-flash-image';
    
    const prompt = `
      Transform this person into a cinematic, full-body ${role} from the Star Wars universe.
      
      Instructions:
      1. Keep the FACIAL FEATURES and IDENTITY of the person in the input image exactly as they are. This is the most important step.
      2. Change the clothing to high-quality, realistic ${role} armor or robes.
      3. Change the background to a sci-fi Star Wars environment suitable for a ${role}.
      4. Ensure the lighting is dramatic and cinematic.
      5. The output must be a high-resolution image.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: file.type,
              data: base64Data,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    // Extract image from response
    // With Flash Image, the image is usually in the inlineData of the response parts
    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image generated in the response.");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
