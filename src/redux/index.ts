import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "./slice/user-slices";
import scheduleSlice from "./slice/schedule-slice";
import taskTypeSlice from "./slice/task-type-slice";
import projectOptionSlice from "./slice/project-option-slice";
import employeeWorkPlanSlice from "./slice/employee-work-plan-slice";
import teamApprovalSlice from "./slice/team-approval-slice";

const rootReducer = combineReducers({
    user: userSlice,
    schedule: scheduleSlice,
    taskType: taskTypeSlice,
    projectOption: projectOptionSlice,
    employeeWorkPlan: employeeWorkPlanSlice,
    teamApproval: teamApprovalSlice
});

export default rootReducer;
