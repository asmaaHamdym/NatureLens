"use server";

import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from "@google/genai";
import imagePrompt from "../app/assets/prompt";

const apiKey = process.env.AI_GATEWAY_API_KEY;

if (!apiKey) {
  throw new Error("AI_GATEWAY_API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey });

export async function analyzeImage(uploadedFiles: File[] = []) {
  // If files are uploaded, use them; otherwise use the prompt
  let responseText = "";

  if (uploadedFiles && uploadedFiles.length > 0) {
    // Handle uploaded files with Google GenAI
    console.log(`Processing ${uploadedFiles.length} uploaded file(s)}`);

    try {
      const fileUris: Array<{ uri: string; mimeType: string }> = [];

      // Upload each file to Google GenAI
      for (const file of uploadedFiles) {
        console.log(`Uploading file: ${file.name}`);
        const buffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(buffer);

        // Create a blob from the file
        const blob = new Blob([uint8Array], {
          type: file.type || "image/jpeg",
        });

        // Upload file to Google's file service
        const uploadedFile = await ai.files.upload({
          file: blob as unknown as Blob,
        });

        if (uploadedFile.uri && uploadedFile.mimeType) {
          fileUris.push({
            uri: uploadedFile.uri,
            mimeType: uploadedFile.mimeType,
          });
          console.log(`File uploaded successfully: ${uploadedFile.uri}`);
        }
      }

      // Build content with files and prompt
      const contentParts: (string | ReturnType<typeof createPartFromUri>)[] =
        [];

      // Add uploaded files
      for (const fileUri of fileUris) {
        contentParts.push(createPartFromUri(fileUri.uri, fileUri.mimeType));
      }

      contentParts.push(imagePrompt);

      // Generate content from uploaded files
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: createUserContent(contentParts),
      });

      responseText = response.text || "Image analyzed successfully";
    } catch (error) {
      console.error("Error processing uploaded files:", error);
      throw new Error(`Failed to process uploaded files: ${error}`);
    }
  } else {
    throw new Error("Please upload at least one image");
  }

  console.log(responseText);

  // Parse JSON response from the model
  try {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (parseError) {
    console.error("Failed to parse JSON response:", parseError);
  }

  // If parsing fails, return the raw text in a structured format
  return {
    cute_avatar_img_url: "",
    error: "Could not parse response",
    raw_response: responseText,
  };
}
