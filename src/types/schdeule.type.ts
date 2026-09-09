export interface SingleTaskDetail {
  description: string;
  taskType: string;
  hours: number | string;
  taskStatus?: string | undefined;
}

export interface SingleTask {
  projectName?: string | undefined;
  name?: string | undefined;
  projectId?: string | undefined;
  datetime?: string | undefined;
  totalHours?: number | undefined;
  taskDetail: SingleTaskDetail[];
}

export type OperationName = 'update' | 'schedule' | 'tomorrow';

export interface TaskTypeResponse {
  name: string;
  termTaxonomyId: number;
}

export interface ProjectResponse {
  id: string;
  title: string;
}

export type WorkPlanStatus = 'pending' | 'approved' | 'rejected';

export interface SliceResponse {
  updatedDataAndTime: string;
  projectDetail: SingleTask[];
  status?: WorkPlanStatus | null;
  reviewNote?: string | null;
}

export interface IndividualSchedule {
  schedule: SliceResponse;
  update: SliceResponse;
  tomorrow: SliceResponse;
}

export interface ScheduleSlice {
  data: IndividualSchedule;
  loading: boolean;
  error: string | null;
}

export interface TeamWorkPlanEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  updatedDataAndTime: string;
  status: WorkPlanStatus;
  reviewNote?: string | null;
  projectDetail: SingleTask[];
}
