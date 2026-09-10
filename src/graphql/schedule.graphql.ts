import { gql, type TypedDocumentNode } from '@apollo/client';
import {
  type IndividualSchedule,
  type ProjectResponse,
  type SingleTask,
  type TaskTypeResponse,
} from '../types/schdeule.type';

export interface SubmitScheduleResult {
  createMyTaskEntry: {
    success: boolean;
    message: string;
  };
}

export interface SubmitScheduleVariables {
  userId: string | undefined;
  schedule: SingleTask[];
  operationType: string;
}

export const SUBMIT_SCHEDULE: TypedDocumentNode<SubmitScheduleResult, SubmitScheduleVariables> =
  gql`
    mutation CreateTaskEntry($userId: ID!, $schedule: [ScheduleInput]!, $operationType: String) {
      createMyTaskEntry(
        input: { userId: $userId, schedule: $schedule, operationType: $operationType }
      ) {
        success
        message
      }
    }
  `;

export interface TaskTypeQueryResult {
  taskTypes: {
    nodes: TaskTypeResponse[];
  };
}

export const TASK_TYPE: TypedDocumentNode<TaskTypeQueryResult, Record<string, never>> = gql`
  query GetTaskType {
    taskTypes {
      nodes {
        termTaxonomyId
        name
      }
    }
  }
`;

export interface ProjectQueryResult {
  filteredProjects: ProjectResponse[];
}

export interface ProjectQueryVariables {
  usersId: string;
}

export const PROJECT_QUERY: TypedDocumentNode<ProjectQueryResult, ProjectQueryVariables> = gql`
  query GetMyCustomPostType($usersId: Int!) {
    filteredProjects(usersId: $usersId) {
      id
      title
    }
  }
`;

export interface TeamLeaderProjectQueryResult {
  allmemberProject: ProjectResponse[];
}

export interface TeamLeaderProjectQueryVariables {
  teamLeaderId: string;
}

export const TL_PROJECT_QUERY: TypedDocumentNode<
  TeamLeaderProjectQueryResult,
  TeamLeaderProjectQueryVariables
> = gql`
  query teamprojects($teamLeaderId: Int!) {
    allmemberProject(teamLeaderId: $teamLeaderId) {
      id
      title
    }
  }
`;

export const getEmployeeWorkPlan = (
  userId: string,
): TypedDocumentNode<IndividualSchedule, Record<string, never>> => gql`
query GetUserSchedule {
    schedule: getUserSchedule(input: {operationType: "schedule", userId: "${userId}"}) {
        updatedDataAndTime
        projectDetail {
            projectId
            projectName
            taskDetail {
                description
                hours
                taskType
            }
        }
    }
    update: getUserSchedule(input: {operationType: "update", userId: "${userId}"}) {
        updatedDataAndTime
        status
        reviewNote
        projectDetail {
            projectId
            projectName
            taskDetail {
                description
                hours
                taskType
            }
        }
    }
    tomorrow: getUserSchedule(input: {operationType: "tomorrow", userId: "${userId}"}) {
        updatedDataAndTime
        projectDetail {
            projectId
            projectName
            taskDetail {
                description
                hours
                taskType
            }
        }
    }
}
`;
