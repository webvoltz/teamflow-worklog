import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getLocalStorageItem } from "../utils/local-storage";

// Apollo attaches its own AbortController signal to every request. In jsdom
// (used by the test suite) that AbortController is a different class than the
// one the real fetch() implementation validates against, so requests fail
// with "Expected signal to be an instance of AbortSignal". This app never
// relies on request cancellation, so dropping the signal is a no-op in the
// browser and fixes the mismatch under jsdom.
const fetchWithoutAbortSignal: typeof fetch = (input, init) => {
    if (!init?.signal) return fetch(input, init);
    const rest = { ...init };
    delete rest.signal;
    return fetch(input, rest);
};

// Defaults to "/graphql", which is served locally by the MSW mock layer (see src/mocks).
// Point VITE_GRAPHQL_API_URL at a real backend to go live.
export const createApolloClient = () => {
    const httpLink = createHttpLink({
        uri: import.meta.env.VITE_GRAPHQL_API_URL || "/graphql",
        fetch: fetchWithoutAbortSignal,
    });

    const authLink = setContext((_, { headers }) => {
        const token = getLocalStorageItem("token");
        return {
            headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : "",
            },
        };
    });

    return new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache(),
    });
};

export const APOLLO_CLIENT = createApolloClient();
