import { combineReducers } from '@reduxjs/toolkit';
import userSlice from './slice/user-slices';
import taskTypeSlice from './slice/task-type-slice';
import projectOptionSlice from './slice/project-option-slice';
import employeeWorkPlanSlice from './slice/employee-work-plan-slice';
import teamApprovalSlice from './slice/team-approval-slice';

const rootReducer = combineReducers({
  user: userSlice,
  taskType: taskTypeSlice,
  projectOption: projectOptionSlice,
  employeeWorkPlan: employeeWorkPlanSlice,
  teamApproval: teamApprovalSlice,
});

export default rootReducer;
