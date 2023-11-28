import axios from "axios";
import { env } from "../config/env-config";

export interface TranslationResponse {
  translations: Array<{
    detected_source_language: string;
    text: string;
  }>;
}

export const getTranslation = async (target_lang: string, text: string) => {
  const { data } = await axios.post<TranslationResponse>(
    env.DEEPL_API,
    { text: [text], target_lang },
    { headers: { Authorization: `DeepL-Auth-Key ${env.DEEPL_KEY}` } }
  );

  return {
    targetLang: target_lang,
    originalText: text,
    translations: data.translations,
  };
};
