import { getPokemonSpecies } from '../clients/pokeapi.client';
import { translate, TranslationType } from '../clients/translation.client';
import { PokemonInfo } from '../types';

const CAVE_HABITAT = 'cave';

export async function getPokemon(name: string): Promise<PokemonInfo> {
  return getPokemonSpecies(name);
}

function getTranslationType(pokemon: PokemonInfo): TranslationType {
  if (pokemon.habitat === CAVE_HABITAT || pokemon.isLegendary) {
    return 'yoda';
  }
  return 'shakespeare';
}

export async function getTranslatedPokemon(name: string): Promise<PokemonInfo> {
  const pokemon = await getPokemonSpecies(name);

  if (!pokemon.description) {
    return pokemon;
  }

  const translationType = getTranslationType(pokemon);
  const translatedDescription = await translate(pokemon.description, translationType);

  return {
    ...pokemon,
    description: translatedDescription ?? pokemon.description,
  };
}
