import { graphql, HttpResponse } from "msw";
import { OperationName, WorkPlanStatus } from "../types/schdeule.type";
import {
    findSampleUserByLogin,
    findSampleUserById,
    getWorkPlanEntry,
    listTeamWorkPlans,
    OTP_CODE,
    reviewWorkPlanEntry,
    SAMPLE_PROJECTS,
    SAMPLE_TASK_TYPES,
    SAMPLE_TEAM_PROJECTS,
} from "./data";

const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_API_URL || "/graphql";
const api = graphql.link(GRAPHQL_ENDPOINT);

const userIdFromToken = (request: Request): string | undefined => {
    const auth = request.headers.get("authorization") ?? "";
    const match = auth.match(/^Bearer mock-token-(.+)$/);
    return match?.[1];
};

export const handlers = [
    api.mutation("Login", async ({ variables }) => {
        const { username, password } = variables as { username: string; password: string };
        const user = findSampleUserByLogin(username);
        if (!user || !password) {
            return HttpResponse.json({ errors: [{ message: "No account found for those credentials." }] });
        }
        return HttpResponse.json({
            data: { login: { tempToken: `temp-${user.userId}`, message: "OTP sent to your registered email." } },
        });
    }),

    api.mutation("VerifyOtp", async ({ variables }) => {
        const { tempToken, otp } = variables as { tempToken: string; otp: string };
        const userId = tempToken.replace("temp-", "");
        const user = findSampleUserById(userId);
        if (!user || otp !== OTP_CODE) {
            return HttpResponse.json({
                data: { verifyOtp: { success: false, token: null, refreshToken: null, message: "Invalid OTP. Please try again." } },
            });
        }
        return HttpResponse.json({
            data: {
                verifyOtp: {
                    success: true,
                    token: `mock-token-${user.userId}`,
                    refreshToken: `mock-refresh-${user.userId}`,
                    message: "Login successful.",
                },
            },
        });
    }),

    api.query("GetUser", async ({ request }) => {
        const user = findSampleUserById(userIdFromToken(request));
        if (!user) {
            return HttpResponse.json({ errors: [{ message: "Not authenticated." }] });
        }
        return HttpResponse.json({
            data: {
                viewer: {
                    databaseId: user.userId,
                    userId: user.userId,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    userrole: user.userrole,
                    avatar: { height: 96, width: 96, url: "" },
                    userInformation: { designation: user.designation },
                },
            },
        });
    }),

    api.mutation("CreateTaskEntry", async ({ variables }) => {
        const { userId, schedule, operationType } = variables as {
            userId: string;
            schedule: unknown;
            operationType: OperationName;
        };
        const entry = getWorkPlanEntry(userId);
        entry[operationType] = {
            updatedDataAndTime: new Date().toISOString(),
            projectDetail: schedule as never,
            status: operationType === "update" ? "pending" : undefined,
        };
        return HttpResponse.json({ data: { createMyTaskEntry: { success: true, message: "Work plan saved." } } });
    }),

    // GetUserSchedule inlines its userId argument into the query string rather than using a
    // GraphQL variable, so we read the parsed query text to know which employee it's for.
    api.query("GetUserSchedule", async ({ request }) => {
        const { query } = (await request.clone().json()) as unknown as { query: string };
        const userId = query.match(/userId:\s*"([^"]+)"/)?.[1] ?? "";
        const entry = getWorkPlanEntry(userId);
        return HttpResponse.json({ data: { schedule: entry.schedule, update: entry.update, tomorrow: entry.tomorrow } });
    }),

    api.query("GetTaskType", () => HttpResponse.json({ data: { taskTypes: { nodes: SAMPLE_TASK_TYPES } } })),

    api.query("GetMyCustomPostType", () => HttpResponse.json({ data: { filteredProjects: SAMPLE_PROJECTS } })),

    api.query("teamprojects", () => HttpResponse.json({ data: { allmemberProject: SAMPLE_TEAM_PROJECTS } })),

    api.query("GetTeamWorkPlans", () => HttpResponse.json({ data: { teamWorkPlans: listTeamWorkPlans() } })),

    api.mutation("ReviewWorkPlan", async ({ variables }) => {
        const { entryId, status, note } = variables as { entryId: string; status: WorkPlanStatus; note?: string };
        const result = reviewWorkPlanEntry(entryId, status, note);
        return HttpResponse.json({ data: { reviewWorkPlan: { ...result, status } } });
    }),
];
