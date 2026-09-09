import { gql } from "@apollo/client";

export const SUBMIT_SCHEDULE = gql`
    mutation CreateTaskEntry($userId: ID!, $schedule: [ScheduleInput]!, $operationType: String) {
        createMyTaskEntry(input: { userId: $userId, schedule: $schedule, operationType: $operationType }) {
            success
            message
        }
    }
`;

export const TASK_TYPE = gql`
    query GetTaskType {
        taskTypes {
            nodes {
                termTaxonomyId
                name
            }
        }
    }
`;

export const PROJECT_QUERY = gql`
    query GetMyCustomPostType($usersId: Int!) {
        filteredProjects(usersId: $usersId) {
            id
            title
        }
    }
`;

export const TL_PROJECT_QUERY = gql`
    query teamprojects($teamLeaderId: Int!) {
        allmemberProject(teamLeaderId:$teamLeaderId) {
            id
            title
        }
    }
`;

export const getEmployeeWorkPlan = (userId: string) => gql`
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