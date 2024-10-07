import {z} from "zod";

export const emotionList = [
  'excited',
  'happy',
  'unhappy',
  'bad',
] as const;

export const zEmotion = z.enum(emotionList);

export type Emotion = z.infer<typeof zEmotion>;
export const emotionEmoji: Record<Emotion, string> = {
  'excited': '🤩',
  'happy': '😊',
  'unhappy': '🙁',
  'bad': '😭',
};
