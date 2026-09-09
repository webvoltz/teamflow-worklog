import { z } from 'zod';

// VITE_GRAPHQL_API_URL may be a relative path (the default, served by the MSW
// mock layer in src/mocks) or an absolute http(s) URL pointing at a real backend.
function isValidGraphqlApiUrl(value: string): boolean {
  if (value.startsWith('/')) return true;
  try {
    return ['http:', 'https:'].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

const envSchema = z.object({
  VITE_GRAPHQL_API_URL: z
    .string()
    .optional()
    // An unset (or explicitly empty) value means "use the default mock endpoint".
    .transform((value) => (value === '' ? undefined : value))
    .refine((value) => value === undefined || isValidGraphqlApiUrl(value), {
      message: 'VITE_GRAPHQL_API_URL must be a relative path or an http(s) URL.',
    }),
});

const result = envSchema.safeParse(import.meta.env);

if (!result.success) {
  // Never surface the offending value or Zod's raw issue details here - this
  // error can end up in logs/error trackers, and a malformed config value
  // isn't something a user or attacker should learn the shape of.
  throw new Error('Invalid application configuration.');
}

export const env = {
  graphqlApiUrl: result.data.VITE_GRAPHQL_API_URL ?? '/graphql',
};
