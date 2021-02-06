import type { VoiceConnection } from "discord.js";
import { getAudioUrl } from "google-tts-api";

export async function speak(text: string, connection: VoiceConnection): Promise<void> {
    await new Promise((resolve, reject) => {
        const url = getAudioUrl(text, {
            lang: "cs-CZ",
            slow: false,
            host: "https://translate.google.com",
        });

        const dispatcher = connection.play(url);

        dispatcher.on("finish", resolve);
        dispatcher.on("error", reject);
    });
}

export async function speakCommand(
    command: string,
    args: Record<string, string>,
    connection: VoiceConnection
): Promise<void> {
    if (!voiceCommands[command]) {
        return;
    }
    const text = voiceCommands[command](args);
    await speak(text, connection);
}

const voiceCommands: Record<string, (args: Record<string, string>) => string> = {
    voiceChanged: () => "Rozjeď to!",
    start: () => "Start",
    15: ({ nextAthlete }) => `${nextAthlete}. Get ready.`,
    10: () => "Změna za 10",
    5: () => "Pět",
    2: () => "Dva",
    1: () => "Jedna",
    0: ({ nextAthlete }) => `Change to ${nextAthlete}`,
};
