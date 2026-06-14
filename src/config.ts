export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  pokeApiBaseUrl: process.env.POKEAPI_BASE_URL || 'https://pokeapi.co/api/v2',
  translationApiBaseUrl:
    process.env.TRANSLATION_API_BASE_URL || 'https://funtranslations.mercxry.me',
  logLevel: process.env.LOG_LEVEL || 'info',
};
