import { gql } from "@apollo/client";

export const GET_TEAM_WORK_PLANS = gql`
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

export const REVIEW_WORK_PLAN = gql`
    mutation ReviewWorkPlan($entryId: ID!, $status: String!, $note: String) {
        reviewWorkPlan(input: { entryId: $entryId, status: $status, note: $note }) {
            success
            message
            status
        }
    }
`;
