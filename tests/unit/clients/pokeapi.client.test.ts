import axios from 'axios';
import { getPokemonSpecies } from '../../../src/clients/pokeapi.client';
import { PokemonNotFoundError, ExternalApiError } from '../../../src/errors';


jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockSpeciesResponse = {
  name: 'mewtwo',
  is_legendary: true,
  habitat: { name: 'rare' },
  flavor_text_entries: [
    {
      flavor_text: 'It was created by\na scientist after\nyears of horrific\fgene splicing.',
      language: { name: 'en' },
    },
    {
      flavor_text: 'Pokemon en japonais',
      language: { name: 'ja' },
    },
  ],
};

describe('PokéAPI Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return pokemon info with cleaned description', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockSpeciesResponse });

    const result = await getPokemonSpecies('mewtwo');

    expect(result).toEqual({
      name: 'mewtwo',
      description: 'It was created by a scientist after years of horrific gene splicing.',
      habitat: 'rare',
      isLegendary: true,
    });
  });

  it('should handle pokemon with null habitat', async () => {
    mockedAxios.get.mockResolvedValue({
      data: { ...mockSpeciesResponse, habitat: null },
    });

    const result = await getPokemonSpecies('deoxys');

    expect(result.habitat).toBeNull();
  });

  it('should lowercase the pokemon name in the URL', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockSpeciesResponse });

    await getPokemonSpecies('Mewtwo');

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('/pokemon-species/mewtwo'),
    );
  });

  it('should trim whitespace from the pokemon name', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockSpeciesResponse });

    await getPokemonSpecies(' mewtwo ');

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('/pokemon-species/mewtwo'),
    );
   })

  it('should throw PokemonNotFoundError on 404', async () => {
    mockedAxios.get.mockRejectedValue({
      response: { status: 404 },
      isAxiosError: true,
    });
    mockedAxios.isAxiosError.mockReturnValue(true);

    await expect(getPokemonSpecies('notapokemon')).rejects.toThrow(PokemonNotFoundError);
  });

  it('should throw ExternalApiError on other errors', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network error'));
    mockedAxios.isAxiosError.mockReturnValue(false);

    await expect(getPokemonSpecies('mewtwo')).rejects.toThrow(ExternalApiError);
  });

  it('should return empty description if no english entry exists', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        ...mockSpeciesResponse,
        flavor_text_entries: [{ flavor_text: 'Solo japonais', language: { name: 'ja' } }],
      },
    });

    const result = await getPokemonSpecies('mewtwo');

    expect(result.description).toBe('');
  });

  it('should return isLegendary false for non-legendary pokemon', async () => {
     mockedAxios.get.mockResolvedValue({
      data: { ...mockSpeciesResponse, is_legendary: false },
    });

    const result = await getPokemonSpecies('gengar');

    expect(result.isLegendary).toBeFalsy();
  });

});
