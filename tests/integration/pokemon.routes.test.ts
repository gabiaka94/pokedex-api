import request from 'supertest';
import axios from 'axios';
import app from '../../src/app';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockMewtwo = {
  name: 'mewtwo',
  is_legendary: true,
  habitat: { name: 'rare' },
  flavor_text_entries: [
    {
      flavor_text: 'It was created by\na scientist after\nyears of horrific\fgene splicing.',
      language: { name: 'en' },
    },
  ],
};

describe('GET /pokemon/:name', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return pokemon info', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockMewtwo });

    const res = await request(app).get('/pokemon/mewtwo');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      name: 'mewtwo',
      description: 'It was created by a scientist after years of horrific gene splicing.',
      habitat: 'rare',
      isLegendary: true,
    });
  });

  it('should return 404 for unknown pokemon', async () => {
    mockedAxios.get.mockRejectedValue({
      response: { status: 404 },
      isAxiosError: true,
    });
    mockedAxios.isAxiosError.mockReturnValue(true);

    const res = await request(app).get('/pokemon/notapokemon');

    expect(res.status).toBe(404);
    expect(res.body.error).toContain('not found');
  });

  it('should return 502 when PokéAPI is down', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Connection refused'));
    mockedAxios.isAxiosError.mockReturnValue(false);

    const res = await request(app).get('/pokemon/mewtwo');

    expect(res.status).toBe(502);
  });
});

describe('GET /health', () => {
  it('should return ok', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
