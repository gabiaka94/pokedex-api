import axios from 'axios';
import { config } from '../config';
import { logger } from '../utils/logger';

type TranslationApiResponse = {
  contents: {
    translated: string;
  };
};

export type TranslationType = 'shakespeare' | 'yoda';

export async function translate(text: string, type: TranslationType): Promise<string | null> {
  const url = `${config.translationApiBaseUrl}/translate/${type}`;
  const start = Date.now();

  try {
    const { data } = await axios.post<TranslationApiResponse>(url, { text });
    const duration = Date.now() - start;
    logger.info(`Translation API call`, { type, durationMs: duration });

    return data.contents.translated;
  } catch (error) {
    const duration = Date.now() - start;

    const message = (error as Error).message;

    if (axios.isAxiosError(error) && error.response?.status === 429) {
      logger.warn('Translation API rate limit hit, falling back to standard description', {
        type,
        durationMs: duration,
        message,
      });
      return null;
    }

    logger.warn('Translation API error, falling back to standard description', {
      type,
      durationMs: duration,
      message,
    });
    return null;
  }
}
