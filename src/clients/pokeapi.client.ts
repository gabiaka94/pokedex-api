import axios from 'axios';
import { config } from '../config';
import { PokemonInfo } from '../types';
import { PokemonNotFoundError, ExternalApiError } from '../errors';
import { logger } from '../utils/logger';

// Types co-located: only this client needs to know the raw API shape
type PokeApiFlavorTextEntry = {
  flavor_text: string;
  language: { name: string };
};

type PokeApiSpeciesResponse = {
  name: string;
  is_legendary: boolean;
  habitat: { name: string } | null;
  flavor_text_entries: PokeApiFlavorTextEntry[];
};

function cleanFlavorText(text: string): string {
  return text.replace(/[\n\f\r]/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractEnglishDescription(name: string, entries: PokeApiFlavorTextEntry[]): string {
  const entry = entries.find((e) => e.language.name === 'en');
  if (!entry) {
    logger.warn('No English description found', { pokemon: name });
    return '';
  }
  return cleanFlavorText(entry.flavor_text);
}

export async function getPokemonSpecies(name: string): Promise<PokemonInfo> {
  const url = `${config.pokeApiBaseUrl}/pokemon-species/${name.toLowerCase().trim()}`;
  const start = Date.now();

  try {
    const { data } = await axios.get<PokeApiSpeciesResponse>(url);
    const duration = Date.now() - start;
    logger.info('PokéAPI call', { url, durationMs: duration });

    return {
      name: data.name,
      description: extractEnglishDescription(data.name, data.flavor_text_entries),
      habitat: data.habitat?.name ?? null,
      isLegendary: data.is_legendary,
    };
  } catch (error) {
    const duration = Date.now() - start;

    if (axios.isAxiosError(error) && error.response?.status === 404) {
      logger.warn('Pokemon not found', { name, durationMs: duration });
      throw new PokemonNotFoundError(name);
    }

    logger.error('PokéAPI error', { url, durationMs: duration, message: (error as Error).message });
    throw new ExternalApiError('PokéAPI', error as Error);
  }
}
