import { Router } from 'express';
import { getPokemonHandler, getTranslatedPokemonHandler } from '../controllers/pokemon.controller';

const router = Router();

router.get('/translated/:name', getTranslatedPokemonHandler);
router.get('/:name', getPokemonHandler);

export default router;
