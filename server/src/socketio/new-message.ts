import { getTranslation } from "../deepl/get-translation";
import { Server } from "socket.io";
import Languages from "../langs.json";

import type { TranslationResponse } from "../deepl/get-translation";

interface NewMessageArgs {
  username: string;
  message: string;
}

interface IncomingMessageArgs {
  username: string;
  targetLang: string;
  originalText: string;
  translations: TranslationResponse["translations"];
}

export const newMessage =
  (io: Server) =>
  async ({ username, message }: NewMessageArgs) => {
    console.log("message:send", { username, message });

    const rooms = io.of("/").adapter.rooms;
    const langs = [...rooms.keys()].filter((r) =>
      Languages.some((l) => l.code === r)
    );

    console.log("Langs:", langs);

    const translations = await Promise.all(
      langs.map((targetLang) => getTranslation(targetLang, message))
    );

    translations.forEach(({ targetLang, originalText, translations }) => {
      io.to(targetLang).emit("message:incoming", {
        username,
        targetLang,
        originalText,
        translations,
      } as IncomingMessageArgs);
    });
  };
