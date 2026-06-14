import { Request, Response, NextFunction } from 'express';
import { getPokemon } from '../services/pokemon.service';

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
