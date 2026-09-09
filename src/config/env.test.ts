import { afterEach, describe, expect, it, vi } from 'vitest';

const genericMessage = 'Invalid application configuration.';

async function loadWithApiUrl(value: string | undefined) {
  if (value === undefined) {
    vi.stubEnv('VITE_GRAPHQL_API_URL', '');
  } else {
    vi.stubEnv('VITE_GRAPHQL_API_URL', value);
  }
  vi.resetModules();
  return import('./env');
}

async function loadInvalidApiUrl(value: string): Promise<Error> {
  vi.stubEnv('VITE_GRAPHQL_API_URL', value);
  vi.resetModules();

  try {
    await import('./env');
  } catch (error: unknown) {
    if (error instanceof Error) {
      return error;
    }
    throw new Error('Environment validation threw a non-Error value.');
  }

  throw new Error('Environment validation unexpectedly succeeded.');
}

function expectGenericError(error: Error, suppliedValue: string): void {
  expect(error.name).toBe('Error');
  expect(error.message).toBe(genericMessage);
  expect(error).not.toHaveProperty('code');
  expect(error).not.toHaveProperty('input');

  const renderedError = `${error.name}: ${error.message}\n${error.stack ?? ''}`;
  expect(renderedError).not.toContain(suppliedValue);
  expect(renderedError).not.toContain('Invalid URL');
  expect(renderedError).not.toContain('ERR_INVALID_URL');
}

describe('Application environment validation', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('defaults to the mock GraphQL endpoint when unset', async () => {
    const { env } = await loadWithApiUrl(undefined);
    expect(env).toEqual({ graphqlApiUrl: '/graphql' });
  });

  it('accepts a relative path', async () => {
    const { env } = await loadWithApiUrl('/graphql-proxy');
    expect(env).toEqual({ graphqlApiUrl: '/graphql-proxy' });
  });

  it('accepts an http(s) URL', async () => {
    const { env } = await loadWithApiUrl('https://api.example.test/graphql');
    expect(env).toEqual({ graphqlApiUrl: 'https://api.example.test/graphql' });
  });

  it.each(['definitely not a url', 'ftp://public.example.test'])(
    'returns only the generic error for a rejected API URL %s',
    async (value) => {
      const error = await loadInvalidApiUrl(value);

      expectGenericError(error, value);
    },
  );
});
