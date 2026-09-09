import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getLocalStorageItem } from "../utils/local-storage";

// Defaults to "/graphql", which is served locally by the MSW mock layer (see src/mocks).
// Point VITE_GRAPHQL_API_URL at a real backend to go live.
const httpLink = createHttpLink({
    uri: import.meta.env.VITE_GRAPHQL_API_URL || "/graphql",
});

// Set up the context link to include the authorization token
const authLink = setContext((_, { headers }) => {
    // Get the authentication token from local storage if it exists
    const token = getLocalStorageItem("token");

    // Return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        },
    };
});

// Create the Apollo Client instance
export const APOLLO_CLIENT = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});
