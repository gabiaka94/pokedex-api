import { Request, Response, NextFunction } from 'express';
import { getPokemon, getTranslatedPokemon } from '../services/pokemon.service';

export async function getPokemonHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const name = req.params.name as string;
    const pokemon = await getPokemon(name);
    res.json(pokemon);
  } catch (error) {
    next(error);
  }
}

export async function getTranslatedPokemonHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const name = req.params.name as string;
    const pokemon = await getTranslatedPokemon(name);
    res.json(pokemon);
  } catch (error) {
    next(error);
  }
}
