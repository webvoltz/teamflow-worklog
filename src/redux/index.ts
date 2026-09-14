import { combineReducers } from '@reduxjs/toolkit';

import employeeWorkPlanSlice from './slice/employee-work-plan-slice';
import projectOptionSlice from './slice/project-option-slice';
import taskTypeSlice from './slice/task-type-slice';
import teamApprovalSlice from './slice/team-approval-slice';
import userSlice from './slice/user-slices';

const rootReducer = combineReducers({
  user: userSlice,
  taskType: taskTypeSlice,
  projectOption: projectOptionSlice,
  employeeWorkPlan: employeeWorkPlanSlice,
  teamApproval: teamApprovalSlice,
});

export default rootReducer;
