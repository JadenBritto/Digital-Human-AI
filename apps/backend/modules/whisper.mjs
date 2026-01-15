import { convertAudioToMp3 } from "../utils/audios.mjs";
import fs from "fs";
import path from "path";
import os from "os";
import dotenv from "dotenv";

dotenv.config();

async function convertAudioToText({ audioData }) {
  try {
    const assemblyaiApiKey = process.env.ASSEMBLYAI_API_KEY;
    
    if (!assemblyaiApiKey) {
      console.warn("[Whisper] No ASSEMBLYAI_API_KEY found in environment variables");
      return "Could not transcribe audio - please set ASSEMBLYAI_API_KEY";
    }

    const mp3AudioData = await convertAudioToMp3({ audioData });
    
    // Use system temp directory
    const tempDir = os.tmpdir();
    const inputPath = path.join(tempDir, `audio_${Date.now()}.mp3`);
    
    fs.writeFileSync(inputPath, mp3AudioData);
    console.log(`[Whisper] Audio file created at: ${inputPath}`);

    // Upload to AssemblyAI
    console.log("[Whisper] Uploading audio to AssemblyAI...");
    const uploadResponse = await fetch("https://api.assemblyai.com/v2/upload", {
      method: "POST",
      headers: {
        "Authorization": assemblyaiApiKey,
      },
      body: mp3AudioData,
    });

    if (!uploadResponse.ok) {
      const error = await uploadResponse.json();
      console.error("[Whisper] Upload error:", error);
      throw new Error(`AssemblyAI upload error: ${error.error}`);
    }

    const { upload_url } = await uploadResponse.json();
    console.log("[Whisper] Audio uploaded, submitting for transcription...");

    // Submit for transcription
    const transcriptResponse = await fetch("https://api.assemblyai.com/v2/transcript", {
      method: "POST",
      headers: {
        "Authorization": assemblyaiApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        audio_url: upload_url,
        language_code: "en",
      }),
    });

    if (!transcriptResponse.ok) {
      const error = await transcriptResponse.json();
      console.error("[Whisper] Transcription error:", error);
      throw new Error(`AssemblyAI transcription error: ${error.error}`);
    }

    const transcript = await transcriptResponse.json();
    const transcriptId = transcript.id;
    console.log(`[Whisper] Transcription submitted with ID: ${transcriptId}`);

    // Poll for completion
    let status = "queued";
    let attempts = 0;
    const maxAttempts = 120; // 2 minutes with 1 second intervals
    let transcribedText = "";

    while (status !== "completed" && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      
      const statusResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
        headers: {
          "Authorization": assemblyaiApiKey,
        },
      });

      if (!statusResponse.ok) {
        throw new Error("Failed to check transcription status");
      }

      const statusData = await statusResponse.json();
      status = statusData.status;
      
      console.log(`[Whisper] Status: ${status} (attempt ${attempts + 1}/${maxAttempts})`);

      if (status === "completed") {
        transcribedText = statusData.text || "";
        console.log(`[Whisper] Transcription complete: ${transcribedText.substring(0, 50)}...`);
      } else if (status === "error") {
        throw new Error(`AssemblyAI transcription failed: ${statusData.error}`);
      }

      attempts++;
    }

    if (status !== "completed") {
      throw new Error("Transcription timeout - exceeded 2 minutes");
    }

    // Clean up temp file
    if (fs.existsSync(inputPath)) {
      fs.unlinkSync(inputPath);
    }

    return transcribedText;
  } catch (error) {
    console.error("[Whisper] Error during transcription:", error.message);
    throw error;
  }
}

export { convertAudioToText };
