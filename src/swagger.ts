import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pokedex API',
      version: '1.0.0',
      description: 'A fun Pokedex REST API with translated Pokemon descriptions',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local development',
      },
    ],
    paths: {
      '/pokemon/{name}': {
        get: {
          summary: 'Get basic Pokemon information',
          parameters: [
            {
              name: 'name',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              example: 'mewtwo',
            },
          ],
          responses: {
            '200': {
              description: 'Pokemon information',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/PokemonInfo',
                  },
                },
              },
            },
            '404': {
              description: 'Pokemon not found',
            },
            '502': {
              description: 'External API error',
            },
          },
        },
      },
      '/pokemon/translated/{name}': {
        get: {
          summary: 'Get Pokemon with translated description',
          description:
            'Returns Pokemon info with a fun translation. Cave or legendary Pokemon get Yoda translation, others get Shakespeare. Falls back to standard description if translation fails.',
          parameters: [
            {
              name: 'name',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              example: 'mewtwo',
            },
          ],
          responses: {
            '200': {
              description: 'Pokemon information with translated description',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/PokemonInfo',
                  },
                },
              },
            },
            '404': {
              description: 'Pokemon not found',
            },
            '502': {
              description: 'External API error',
            },
          },
        },
      },
    },
    components: {
      schemas: {
        PokemonInfo: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'mewtwo' },
            description: {
              type: 'string',
              example:
                'It was created by a scientist after years of horrific gene splicing and DNA engineering experiments.',
            },
            habitat: { type: 'string', nullable: true, example: 'rare' },
            isLegendary: { type: 'boolean', example: true },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
