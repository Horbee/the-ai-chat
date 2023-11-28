import { getTranslation } from "../deepl/get-translation";
import { Server } from "socket.io";

import type { TranslationResponse } from "../deepl/get-translation";

interface NewMessageArgs {
  user: string;
  message: string;
}

interface IncomingMessageArgs {
  user: string;
  targetLang: string;
  originalText: string;
  translations: TranslationResponse["translations"];
}

export const newMessage =
  (io: Server) =>
  async ({ user, message }: NewMessageArgs) => {
    console.log("new_message", { user, message });

    const rooms = io.of("/").adapter.rooms;
    const langs = [...rooms.keys()];

    console.log({ langs });

    const translations = await Promise.all(
      langs.map((targetLang) => getTranslation(targetLang, message))
    );

    translations.forEach(({ targetLang, originalText, translations }) => {
      io.to(targetLang).emit("incoming_message", {
        user,
        targetLang,
        originalText,
        translations,
      } as IncomingMessageArgs);
    });
  };
