import { getPokemonSpecies } from '../clients/pokeapi.client';
import { PokemonInfo } from '../types';

export async function getPokemon(name: string): Promise<PokemonInfo> {
  return getPokemonSpecies(name);
}
