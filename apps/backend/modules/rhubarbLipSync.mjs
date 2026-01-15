import { execCommand } from "../utils/files.mjs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const backendDir = join(__dirname, "..");

const getPhonemes = async ({ message }) => {
  try {
    const time = new Date().getTime();
    console.log(`Starting conversion for message ${message}`);
    await execCommand(
      { 
        command: `ffmpeg -y -i audios/message_${message}.mp3 audios/message_${message}.wav`,
        cwd: backendDir
      }
      // -y to overwrite the file
    );
    console.log(`Conversion done in ${new Date().getTime() - time}ms`);
    const rhubarbPath = join(__dirname, "../bin/Rhubarb-Lip-Sync-1.14.0-Windows/Rhubarb-Lip-Sync-1.14.0-Windows/rhubarb.exe");
    await execCommand({
      command: `"${rhubarbPath}" -f json -o audios/message_${message}.json audios/message_${message}.wav -r phonetic`,
      cwd: backendDir
    });
    // -r phonetic is faster but less accurate
    console.log(`Lip sync done in ${new Date().getTime() - time}ms`);
  } catch (error) {
    console.error(`Error while getting phonemes for message ${message}:`, error);
  }
};

export { getPhonemes };