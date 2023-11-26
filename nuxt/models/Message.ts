export interface Message {
  user: string;
  message: {
    translations: Array<{
      text: string;
    }>;
  };
}
