import { en } from './en.js';
import { hi } from './hi.js';
import { mr } from './mr.js';
import { Language } from '@digital-suraksha/shared';

export const locales: Record<Language, typeof hi> = {
  hi,
  mr: mr as unknown as typeof hi,
  en: en as unknown as typeof hi,
};

export { en, hi, mr };
