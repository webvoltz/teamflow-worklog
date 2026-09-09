import {
  type OperationName,
  type SliceResponse,
  type TeamWorkPlanEntry,
  type WorkPlanStatus,
} from '../types/schdeule.type';

export interface SampleUser {
  userId: string;
  name: string;
  username: string;
  email: string;
  userrole: string[];
  designation: string;
}

export const SAMPLE_USERS: SampleUser[] = [
  {
    userId: '1',
    name: 'Jordan Rivera',
    username: 'jordan.rivera',
    email: 'employee@teamflow.dev',
    userrole: ['employee'],
    designation: 'Frontend Engineer',
  },
  {
    userId: '2',
    name: 'Morgan Lee',
    username: 'morgan.lee',
    email: 'lead@teamflow.dev',
    userrole: ['team_leader'],
    designation: 'Engineering Team Lead',
  },
];

export const OTP_CODE = '123456';

export const findSampleUserByLogin = (login: string): SampleUser | undefined => {
  const normalized = login.trim().toLowerCase();
  return SAMPLE_USERS.find((user) => user.username === normalized || user.email === normalized);
};

export const findSampleUserById = (userId?: string | null): SampleUser | undefined =>
  SAMPLE_USERS.find((user) => user.userId === userId);

export const SAMPLE_PROJECTS = [
  { id: 'p1', title: 'Atlas Redesign' },
  { id: 'p2', title: 'Nimbus Mobile App' },
  { id: 'p3', title: 'Internal Tools' },
];

export const SAMPLE_TEAM_PROJECTS = [...SAMPLE_PROJECTS, { id: 'p4', title: 'Client Portal' }];

export const SAMPLE_TASK_TYPES = [
  { termTaxonomyId: 1, name: 'Development' },
  { termTaxonomyId: 2, name: 'Design' },
  { termTaxonomyId: 3, name: 'Code Review' },
  { termTaxonomyId: 4, name: 'Client Meeting' },
  { termTaxonomyId: 5, name: 'QA / Testing' },
  { termTaxonomyId: 6, name: 'Documentation' },
];

const emptySlice = (): SliceResponse => ({ updatedDataAndTime: '', projectDetail: [] });

type WorkPlanStore = Record<string, Record<OperationName, SliceResponse>>;

const buildInitialStore = (): WorkPlanStore => ({
  '1': {
    schedule: {
      updatedDataAndTime: new Date().toISOString(),
      projectDetail: [
        {
          projectId: 'p1',
          projectName: 'Atlas Redesign',
          taskDetail: [
            { description: 'Build the settings page layout', taskType: 'Development', hours: 4 },
            {
              description: 'Review pull request from the design team',
              taskType: 'Code Review',
              hours: 1,
            },
          ],
        },
      ],
    },
    update: {
      updatedDataAndTime: new Date().toISOString(),
      status: 'pending',
      projectDetail: [
        {
          projectId: 'p1',
          projectName: 'Atlas Redesign',
          taskDetail: [
            { description: 'Finished the settings page layout', taskType: 'Development', hours: 5 },
            { description: 'Addressed review comments', taskType: 'Code Review', hours: 1 },
          ],
        },
      ],
    },
    tomorrow: emptySlice(),
  },
  '2': {
    schedule: {
      updatedDataAndTime: new Date().toISOString(),
      projectDetail: [
        {
          projectId: 'p4',
          projectName: 'Client Portal',
          taskDetail: [
            {
              description: 'Sprint planning with the client',
              taskType: 'Client Meeting',
              hours: 2,
            },
          ],
        },
      ],
    },
    update: emptySlice(),
    tomorrow: emptySlice(),
  },
});

let workPlanStore: WorkPlanStore = buildInitialStore();

export const getWorkPlanEntry = (userId: string): Record<OperationName, SliceResponse> => {
  workPlanStore[userId] ??= {
    schedule: emptySlice(),
    update: emptySlice(),
    tomorrow: emptySlice(),
  };
  return workPlanStore[userId];
};

/** Resets all mutable mock state. Called between test cases. */
export const resetMockData = () => {
  workPlanStore = buildInitialStore();
};

const workPlanEntryId = (employeeId: string): string => `${employeeId}:update`;

/** Every non-team-lead's "work update" submission, newest-status-first for the review queue. */
export const listTeamWorkPlans = (): TeamWorkPlanEntry[] =>
  SAMPLE_USERS.filter((user) => !user.userrole.includes('team_leader'))
    .map((user) => {
      const update = getWorkPlanEntry(user.userId).update;
      if (update.projectDetail.length === 0) return null;
      const entry: TeamWorkPlanEntry = {
        id: workPlanEntryId(user.userId),
        employeeId: user.userId,
        employeeName: user.name,
        designation: user.designation,
        updatedDataAndTime: update.updatedDataAndTime,
        status: update.status ?? 'pending',
        reviewNote: update.reviewNote ?? null,
        projectDetail: update.projectDetail,
      };
      return entry;
    })
    .filter((entry): entry is TeamWorkPlanEntry => entry !== null)
    .sort((a, b) => (a.status === b.status ? 0 : a.status === 'pending' ? -1 : 1));

export const reviewWorkPlanEntry = (
  entryId: string,
  status: WorkPlanStatus,
  note?: string,
): { success: boolean; message: string } => {
  const [employeeId, operation] = entryId.split(':');
  if (!employeeId || operation !== 'update' || !findSampleUserById(employeeId)) {
    return { success: false, message: 'Work plan entry not found.' };
  }
  const entry = getWorkPlanEntry(employeeId);
  entry.update = { ...entry.update, status, reviewNote: note ?? null };
  return { success: true, message: `Work plan ${status}.` };
};
