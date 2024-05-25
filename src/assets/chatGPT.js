import OpenAI from "openai";
import fs from "fs";

// Initialize OpenAI with the API key from environment variables
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Function to encode the image to base64
function encodeImage(imagePath) {
  const imageFile = fs.readFileSync(imagePath);
  return Buffer.from(imageFile).toString('base64');
}

export async function main(PicPath) {
  try {
    // Path to your local image
    const imagePath = PicPath;

    // Getting the base64 string
    const base64Image = encodeImage(imagePath);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Please tell any data about the event that would be usefull for a calander event. PULL OUT Date Time Place then make a discription. Only do these if they are in the image. If there is not a date but a week day then just put the weekday. If there is nothing for that then put null" },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
                detail: "low"
              }
            }
          ]
        }
      ]
    });
    return response.choices[0];
  } catch (error) {
    console.error("Error:", error.message);
  }
}
