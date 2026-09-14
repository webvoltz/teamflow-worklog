import {
  type OperationName,
  type SliceResponse,
  type TeamWorkPlanEntry,
  type WorkPlanStatus,
} from '../types/schdeule.type';
import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from '../utils/local-storage';

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

/**
 * No sample users start with any work logged - every schedule/update/tomorrow's-plan
 * entry is created by actually using the app, then persisted to localStorage
 * (see loadStore/persistWorkPlanStore below). getWorkPlanEntry lazily creates an
 * empty {schedule,update,tomorrow} record the first time a given user is looked up.
 */
const buildInitialStore = (): WorkPlanStore => ({});

/**
 * The seeded sample data only describes the *first* load. Every actual mutation
 * (submitting a schedule, approving/rejecting a work update) is persisted to
 * localStorage so it survives a page reload instead of snapping back to the
 * seed - this is what makes the mock backend feel "real" across a session,
 * not just within it.
 */
const WORK_PLAN_STORAGE_KEY = 'teamflow_worklog_mock_work_plan_store';

const isWorkPlanStore = (value: unknown): value is WorkPlanStore =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const loadStore = (): WorkPlanStore => {
  const raw = getLocalStorageItem(WORK_PLAN_STORAGE_KEY);
  if (!raw) return buildInitialStore();
  try {
    const parsed: unknown = JSON.parse(raw);
    if (isWorkPlanStore(parsed)) {
      return parsed;
    }
  } catch {
    // Corrupted/outdated localStorage value - fall through to a clean seed.
  }
  return buildInitialStore();
};

let workPlanStore: WorkPlanStore = loadStore();

const persistWorkPlanStore = () => {
  setLocalStorageItem(WORK_PLAN_STORAGE_KEY, JSON.stringify(workPlanStore));
};

export const getWorkPlanEntry = (userId: string): Record<OperationName, SliceResponse> => {
  if (!workPlanStore[userId]) {
    workPlanStore[userId] = {
      schedule: emptySlice(),
      update: emptySlice(),
      tomorrow: emptySlice(),
    };
    persistWorkPlanStore();
  }
  return workPlanStore[userId];
};

/** Writes one operation's slice (schedule/update/tomorrow) for a user and persists it. */
export const setWorkPlanSlice = (
  userId: string,
  operation: OperationName,
  slice: SliceResponse,
): void => {
  const entry = getWorkPlanEntry(userId);
  entry[operation] = slice;
  persistWorkPlanStore();
};

/** Resets all mutable mock state, including the persisted copy. Called between test cases. */
export const resetMockData = () => {
  workPlanStore = buildInitialStore();
  removeLocalStorageItem(WORK_PLAN_STORAGE_KEY);
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
  persistWorkPlanStore();
  return { success: true, message: `Work plan ${status}.` };
};
