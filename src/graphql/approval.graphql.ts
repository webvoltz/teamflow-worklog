import { gql, type TypedDocumentNode } from '@apollo/client';
import { type TeamWorkPlanEntry, type WorkPlanStatus } from '../types/schdeule.type';

export interface GetTeamWorkPlansResult {
  teamWorkPlans: TeamWorkPlanEntry[];
}

export interface GetTeamWorkPlansVariables {
  teamLeaderId: string;
}

export const GET_TEAM_WORK_PLANS: TypedDocumentNode<
  GetTeamWorkPlansResult,
  GetTeamWorkPlansVariables
> = gql`
  query GetTeamWorkPlans($teamLeaderId: ID!) {
    teamWorkPlans(teamLeaderId: $teamLeaderId) {
      id
      employeeId
      employeeName
      designation
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
  }
`;

export interface ReviewWorkPlanResult {
  reviewWorkPlan: {
    success: boolean;
    message: string;
    status: WorkPlanStatus;
  };
}

export interface ReviewWorkPlanVariables {
  entryId: string;
  status: WorkPlanStatus;
  note?: string | undefined;
}

export const REVIEW_WORK_PLAN: TypedDocumentNode<ReviewWorkPlanResult, ReviewWorkPlanVariables> =
  gql`
    mutation ReviewWorkPlan($entryId: ID!, $status: String!, $note: String) {
      reviewWorkPlan(input: { entryId: $entryId, status: $status, note: $note }) {
        success
        message
        status
      }
    }
  `;
