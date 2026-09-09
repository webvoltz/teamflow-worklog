import { screen } from "@testing-library/react";
import { graphql, HttpResponse } from "msw";
import { afterEach, describe, expect, it } from "vitest";
import { server } from "../../../mocks/server";
import { fetchUserData } from "../../../redux/slice/user-slices";
import { createTestStore, renderWithProviders } from "../../../test/render";
import TodayTimesheet from "../index";

describe("Today timesheet - GraphQL error state", () => {
    afterEach(() => {
        localStorage.clear();
    });

    it("shows an error message when the schedule query fails", async () => {
        server.use(
            graphql.link("/graphql").query("GetUserSchedule", () =>
                HttpResponse.json({ errors: [{ message: "Internal server error" }] })
            )
        );

        localStorage.setItem("token", "mock-token-1");
        const store = createTestStore();
        await store.dispatch(fetchUserData());

        renderWithProviders(<TodayTimesheet />, { store });

        expect(await screen.findByText(/error/i)).toBeInTheDocument();
    });
});
