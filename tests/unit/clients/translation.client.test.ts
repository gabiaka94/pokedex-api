import axios from 'axios';
import { translate } from '../../../src/clients/translation.client';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Translation Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return translated text on success', async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        contents: { translated: 'Created by a scientist, it was.' },
      },
    });

    const result = await translate('It was created by a scientist.', 'yoda');

    expect(result).toBe('Created by a scientist, it was.');
  });

  it('should call the correct endpoint for shakespeare', async () => {
    mockedAxios.post.mockResolvedValue({
      data: { contents: { translated: 'some text' } },
    });

    await translate('hello', 'shakespeare');

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/translate/shakespeare'),
      { text: 'hello' },
    );
  });

  it('should call the correct endpoint for yoda', async () => {
    mockedAxios.post.mockResolvedValue({
      data: { contents: { translated: 'some text' } },
    });

    await translate('hello', 'yoda');

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/translate/yoda'),
      { text: 'hello' },
    );
  });

  it('should return null on 429 rate limit', async () => {
    mockedAxios.post.mockRejectedValue({
      response: { status: 429 },
      isAxiosError: true,
    });
    mockedAxios.isAxiosError.mockReturnValue(true);

    const result = await translate('some text', 'shakespeare');

    expect(result).toBeNull();
  });

  it('should return null on network error', async () => {
    mockedAxios.post.mockRejectedValue(new Error('Network error'));
    mockedAxios.isAxiosError.mockReturnValue(false);

    const result = await translate('some text', 'yoda');

    expect(result).toBeNull();
  });

});
