import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { getWorkPlanEntry } from "../../../mocks/data";
import { fetchUserData } from "../../../redux/slice/user-slices";
import TodayTimesheet from "../../../pages/todayTimesheet";
import { createTestStore, renderWithProviders } from "../../../test/render";

describe("Add work plan", () => {
    afterEach(() => {
        localStorage.clear();
    });

    it("lets an employee add and submit a new work schedule", async () => {
        localStorage.setItem("token", "mock-token-1");
        // The sample fixture ships with a schedule already submitted; clear it so the
        // "Add new schedule" flow is exercised instead of the read-only view.
        getWorkPlanEntry("1").schedule = { updatedDataAndTime: "", projectDetail: [] };

        const store = createTestStore();
        await store.dispatch(fetchUserData());

        const user = userEvent.setup();
        renderWithProviders(<TodayTimesheet />, { store });

        await user.click(await screen.findByRole("button", { name: /add new schedule/i }));
        // Wait for the real project list (fetched via GraphQL) to replace the placeholder options.
        await waitFor(() => expect(store.getState().projectOption.data).not.toBeNull());

        const projectSelect = within(screen.getByTestId("project-select")).getByRole("combobox");
        await user.click(projectSelect);
        await user.click(await screen.findByText("Atlas Redesign"));

        await user.type(screen.getByPlaceholderText("Enter task details"), "Paired on the approval flow");

        const taskTypeSelect = within(screen.getByTestId("task-type-select")).getByRole("combobox");
        await user.click(taskTypeSelect);
        await user.click(await screen.findByText("Development"));

        await user.type(screen.getByPlaceholderText("Enter hours"), "3");

        await user.click(screen.getByRole("button", { name: /^submit$/i }));

        expect(await screen.findByText(/paired on the approval flow/i)).toBeInTheDocument();
    });
});
