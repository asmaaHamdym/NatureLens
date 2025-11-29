"use server";
import { generateText } from "ai";
import fs from "node:fs";

export async function generateImage(prompt: string) {
  const result = await generateText({
    model: "gemini-3-pro-preview",
    prompt,
  });

  let fileName;

  // Save generated images
  for (const file of result.files) {
    if (file.mediaType.startsWith("image/")) {
      const timestamp = Date.now();
      fileName = `generated-${timestamp}.png`;

      await fs.promises.writeFile(`public/${fileName}`, file.uint8Array);

      console.log(`Generated and saved image: public/${fileName}`);
    }
  }
  return `/${fileName}`;
}
