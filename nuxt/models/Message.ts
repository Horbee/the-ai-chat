// same as IncomingMessageArgs

export interface Message {
  username: string;
  targetLang: string;
  originalText: string;
  translations: Array<{ text: string }>;
}
