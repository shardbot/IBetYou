import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';

/** Returns the page query, or null if the page is not yet hydrated. */
export const useQuery = (): ParsedUrlQuery => {
  const router = useRouter();

  const hasQueryParams = /\[.+\]/.test(router.route) || /\?./.test(router.asPath);
  const ready = !hasQueryParams || Object.keys(router.query).length > 0;

  if (!ready) return null;

  return router.query;
};
