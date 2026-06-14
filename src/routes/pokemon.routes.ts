import { Router } from 'express';
import { getPokemonHandler } from '../controllers/pokemon.controller';

const router = Router();

router.get('/:name', getPokemonHandler);

export default router;
