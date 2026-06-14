import { getTranslatedPokemon } from '../../../src/services/pokemon.service';
import * as pokeapiClient from '../../../src/clients/pokeapi.client';
import * as translationClient from '../../../src/clients/translation.client';

jest.mock('../../../src/clients/pokeapi.client');
jest.mock('../../../src/clients/translation.client');

const mockedGetPokemonSpecies = pokeapiClient.getPokemonSpecies as jest.MockedFunction<
  typeof pokeapiClient.getPokemonSpecies
>;
const mockedTranslate = translationClient.translate as jest.MockedFunction<
  typeof translationClient.translate
>;

const basePokemon = {
  name: 'pikachu',
  description: 'A standard description.',
  habitat: 'forest',
  isLegendary: false,
};

describe('getTranslatedPokemon', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should use shakespeare translation for regular pokemon', async () => {
    mockedGetPokemonSpecies.mockResolvedValue(basePokemon);
    mockedTranslate.mockResolvedValue('A standard description, thou sayest.');

    await getTranslatedPokemon('pikachu');

    expect(mockedTranslate).toHaveBeenCalledWith('A standard description.', 'shakespeare');
  });

  it('should use yoda translation for legendary pokemon', async () => {
    mockedGetPokemonSpecies.mockResolvedValue({ ...basePokemon, isLegendary: true });
    mockedTranslate.mockResolvedValue('A standard description, it is.');

    await getTranslatedPokemon('mewtwo');

    expect(mockedTranslate).toHaveBeenCalledWith('A standard description.', 'yoda');
  });

  it('should use yoda translation for cave habitat pokemon', async () => {
    mockedGetPokemonSpecies.mockResolvedValue({ ...basePokemon, habitat: 'cave' });
    mockedTranslate.mockResolvedValue('In a cave, it lives.');

    await getTranslatedPokemon('zubat');

    expect(mockedTranslate).toHaveBeenCalledWith('A standard description.', 'yoda');
  });

  it('should use yoda for legendary pokemon even with non-cave habitat', async () => {
    mockedGetPokemonSpecies.mockResolvedValue({
      ...basePokemon,
      habitat: 'rare',
      isLegendary: true,
    });
    mockedTranslate.mockResolvedValue('Translated.');

    await getTranslatedPokemon('mewtwo');

    expect(mockedTranslate).toHaveBeenCalledWith('A standard description.', 'yoda');
  });

  it('should fallback to standard description when translation fails', async () => {
    mockedGetPokemonSpecies.mockResolvedValue(basePokemon);
    mockedTranslate.mockResolvedValue(null);

    const result = await getTranslatedPokemon('pikachu');

    expect(result.description).toBe('A standard description.');
  });

  it('should return translated description on success', async () => {
    mockedGetPokemonSpecies.mockResolvedValue(basePokemon);
    mockedTranslate.mockResolvedValue('Translated text here.');

    const result = await getTranslatedPokemon('pikachu');

    expect(result.description).toBe('Translated text here.');
  });

  it('should preserve other fields when translating', async () => {
    mockedGetPokemonSpecies.mockResolvedValue(basePokemon);
    mockedTranslate.mockResolvedValue('Translated.');

    const result = await getTranslatedPokemon('pikachu');

    expect(result.name).toBe('pikachu');
    expect(result.habitat).toBe('forest');
    expect(result.isLegendary).toBe(false);
  });
});
