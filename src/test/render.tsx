import { ApolloProvider } from "@apollo/client";
import { configureStore } from "@reduxjs/toolkit";
import { render, RenderOptions } from "@testing-library/react";
import { ReactElement, ReactNode } from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import rootReducer from "../redux";
import { createApolloClient } from "../services/apollo";

export const createTestStore = () => configureStore({ reducer: rootReducer });

type RenderWithProvidersOptions = Omit<RenderOptions, "wrapper"> & {
    route?: string;
    store?: ReturnType<typeof createTestStore>;
};

export function renderWithProviders(ui: ReactElement, { route = "/", store = createTestStore(), ...options }: RenderWithProvidersOptions = {}) {
    const apolloClient = createApolloClient();

    function Wrapper({ children }: { children: ReactNode }) {
        return (
            <Provider store={store}>
                <ApolloProvider client={apolloClient}>
                    <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
                </ApolloProvider>
            </Provider>
        );
    }

    return { store, ...render(ui, { wrapper: Wrapper, ...options }) };
}
