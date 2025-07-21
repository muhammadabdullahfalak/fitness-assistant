// Image assets for the fitness app
import fitnessHero from '@/assets/fitness-hero.jpg';
import fitnessBot from '@/assets/fitness-bot.jpg';

export const images = {
  hero: fitnessHero,
  bot: fitnessBot,
} as const;

export type ImageKey = keyof typeof images;