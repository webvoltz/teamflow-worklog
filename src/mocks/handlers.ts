import { graphql, HttpResponse } from 'msw';
import { z } from 'zod';
import { env } from '../config/env';
import { type WorkPlanStatus } from '../types/schdeule.type';
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
} from './data';

const api = graphql.link(env.graphqlApiUrl);

const operationNameSchema = z.enum(['schedule', 'update', 'tomorrow']);
const workPlanStatusSchema = z.enum([
  'pending',
  'approved',
  'rejected',
]) satisfies z.ZodType<WorkPlanStatus>;

const singleTaskDetailSchema = z.object({
  description: z.string(),
  taskType: z.string(),
  hours: z.union([z.number(), z.string()]),
  taskStatus: z.string().optional(),
});
const singleTaskSchema = z.object({
  projectName: z.string().optional(),
  name: z.string().optional(),
  projectId: z.string().optional(),
  datetime: z.string().optional(),
  totalHours: z.number().optional(),
  taskDetail: z.array(singleTaskDetailSchema),
});

const loginVariablesSchema = z.object({ username: z.string(), password: z.string() });
const verifyOtpVariablesSchema = z.object({ tempToken: z.string(), otp: z.string() });
const createTaskEntryVariablesSchema = z.object({
  userId: z.string(),
  schedule: z.array(singleTaskSchema),
  operationType: operationNameSchema,
});
const reviewWorkPlanVariablesSchema = z.object({
  entryId: z.string(),
  status: workPlanStatusSchema,
  note: z.string().optional(),
});
const graphqlRequestBodySchema = z.object({ query: z.string() });

const userIdFromToken = (request: Request): string | undefined => {
  const auth = request.headers.get('authorization') ?? '';
  const match = /^Bearer mock-token-(.+)$/.exec(auth);
  return match?.[1];
};

export const handlers = [
  api.mutation('Login', ({ variables }) => {
    const { username, password } = loginVariablesSchema.parse(variables);
    const user = findSampleUserByLogin(username);
    if (!user || !password) {
      return HttpResponse.json({
        errors: [{ message: 'No account found for those credentials.' }],
      });
    }
    return HttpResponse.json({
      data: {
        login: { tempToken: `temp-${user.userId}`, message: 'OTP sent to your registered email.' },
      },
    });
  }),

  api.mutation('VerifyOtp', ({ variables }) => {
    const { tempToken, otp } = verifyOtpVariablesSchema.parse(variables);
    const userId = tempToken.replace('temp-', '');
    const user = findSampleUserById(userId);
    if (!user || otp !== OTP_CODE) {
      return HttpResponse.json({
        data: {
          verifyOtp: {
            success: false,
            token: null,
            refreshToken: null,
            message: 'Invalid OTP. Please try again.',
          },
        },
      });
    }
    return HttpResponse.json({
      data: {
        verifyOtp: {
          success: true,
          token: `mock-token-${user.userId}`,
          refreshToken: `mock-refresh-${user.userId}`,
          message: 'Login successful.',
        },
      },
    });
  }),

  api.query('GetUser', ({ request }) => {
    const user = findSampleUserById(userIdFromToken(request));
    if (!user) {
      return HttpResponse.json({ errors: [{ message: 'Not authenticated.' }] });
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
          avatar: { height: 96, width: 96, url: '' },
          userInformation: { designation: user.designation },
        },
      },
    });
  }),

  api.mutation('CreateTaskEntry', ({ variables }) => {
    const { userId, schedule, operationType } = createTaskEntryVariablesSchema.parse(variables);
    const entry = getWorkPlanEntry(userId);
    entry[operationType] = {
      updatedDataAndTime: new Date().toISOString(),
      projectDetail: schedule,
      status: operationType === 'update' ? 'pending' : null,
    };
    return HttpResponse.json({
      data: { createMyTaskEntry: { success: true, message: 'Work plan saved.' } },
    });
  }),

  // GetUserSchedule inlines its userId argument into the query string rather than using a
  // GraphQL variable, so we read the parsed query text to know which employee it's for.
  api.query('GetUserSchedule', async ({ request }) => {
    const { query } = graphqlRequestBodySchema.parse(await request.clone().json());
    const userId = /userId:\s*"([^"]+)"/.exec(query)?.[1] ?? '';
    const entry = getWorkPlanEntry(userId);
    return HttpResponse.json({
      data: {
        schedule: entry.schedule,
        // The "update" query also asks for status/reviewNote (they don't apply to
        // schedule/tomorrow), so make sure they're always present, even as null -
        // Apollo warns about fields the query asked for but the response omitted.
        update: {
          ...entry.update,
          status: entry.update.status ?? null,
          reviewNote: entry.update.reviewNote ?? null,
        },
        tomorrow: entry.tomorrow,
      },
    });
  }),

  api.query('GetTaskType', () =>
    HttpResponse.json({ data: { taskTypes: { nodes: SAMPLE_TASK_TYPES } } }),
  ),

  api.query('GetMyCustomPostType', () =>
    HttpResponse.json({ data: { filteredProjects: SAMPLE_PROJECTS } }),
  ),

  api.query('teamprojects', () =>
    HttpResponse.json({ data: { allmemberProject: SAMPLE_TEAM_PROJECTS } }),
  ),

  api.query('GetTeamWorkPlans', () =>
    HttpResponse.json({ data: { teamWorkPlans: listTeamWorkPlans() } }),
  ),

  api.mutation('ReviewWorkPlan', ({ variables }) => {
    const { entryId, status, note } = reviewWorkPlanVariablesSchema.parse(variables);
    const result = reviewWorkPlanEntry(entryId, status, note);
    return HttpResponse.json({ data: { reviewWorkPlan: { ...result, status } } });
  }),
];
