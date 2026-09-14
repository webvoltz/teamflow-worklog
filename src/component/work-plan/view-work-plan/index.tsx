import dayjs from 'dayjs';
import { useMemo } from 'react';
import { FaRegCopy } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import { type RootState } from '../../../store';
import {
  type OperationName,
  type SingleTask,
  type WorkPlanStatus,
} from '../../../types/schdeule.type';
import { capitalizeFirstLetter } from '../../../utils/common-functions';
import { CopySingleWork } from '../../../utils/copy-work';
import { calculateTaskTotalHours } from '../../../utils/date-time-calculation';
import { Badge, type BadgeProps } from '../../ui/badge';
import { TomorrowPlan } from './tomorrow-plan';

const STATUS_COLOR: Record<WorkPlanStatus, NonNullable<BadgeProps['color']>> = {
  pending: 'gold',
  approved: 'green',
  rejected: 'red',
};

interface ViewScheduleProps {
  operationName: OperationName;
  viewMode?: string;
  taskData?: SingleTask[];
}

const ViewSchedule = ({ operationName, viewMode, taskData }: ViewScheduleProps) => {
  const { data: employeeWorkPlan } = useSelector((state: RootState) => state.employeeWorkPlan);

  const viewData = useMemo<SingleTask[]>(() => {
    if (viewMode) {
      return taskData ?? [];
    }
    return employeeWorkPlan[operationName].projectDetail;
  }, [employeeWorkPlan, operationName, taskData, viewMode]);
  const tomorrowPlanView = useMemo<SingleTask[]>(() => {
    if (!viewMode && operationName === 'update') {
      return employeeWorkPlan.tomorrow.projectDetail;
    }
    return [];
  }, [employeeWorkPlan, operationName, viewMode]);

  return (
    <>
      {viewData.map((item) => (
        <div
          className="border-[#D0D5DD] border-2 rounded-lg px-3 py-3 mb-4 timesheet-card"
          key={item.projectId}
        >
          <h2 className="text-sm font-bold flex justify-start gap-2">
            {capitalizeFirstLetter(item.projectName ?? item.name ?? '')} (
            {calculateTaskTotalHours(item.taskDetail)}h)
            <button
              onClick={() => {
                CopySingleWork('Update', item);
              }}
            >
              <FaRegCopy className="mr-2 h-5 w-5 cursor-pointer" />
            </button>
          </h2>
          <ul className="py-4">
            {item.taskDetail.map((taskData, taskIndex) => (
              <li className="text-sm" key={taskIndex}>
                - {taskData.description}{' '}
                <span className="font-medium text-black">({taskData.hours}h)</span>
              </li>
            ))}
          </ul>
          {operationName === 'update' &&
            tomorrowPlanView.map(
              (data, tomorrowIndex) =>
                data.projectId === item.projectId && (
                  <TomorrowPlan
                    tomorrowIndex={tomorrowIndex}
                    taskDetailData={data}
                    key={data.projectId}
                  />
                ),
            )}
        </div>
      ))}
      {tomorrowPlanView
        .filter((e) => viewData.every((a) => a.projectId !== e.projectId))
        .map(
          (data, tomorrowIndex) =>
            data.projectId && (
              <div
                className="border-[#D0D5DD] border-2 rounded-lg px-3 py-3 mb-4 timesheet"
                key={data.projectId}
              >
                <TomorrowPlan
                  tomorrowIndex={tomorrowIndex}
                  taskDetailData={data}
                  isOnlyPlan={true}
                />
              </div>
            ),
        )}
      {operationName === 'update' && !viewMode && (
        <>
          <p className="update-msg text-sm flex items-center gap-2">
            Thank you for your submission.
            {employeeWorkPlan.update.status && (
              <Badge color={STATUS_COLOR[employeeWorkPlan.update.status]} className="uppercase">
                {employeeWorkPlan.update.status}
              </Badge>
            )}
          </p>
          {employeeWorkPlan.update.reviewNote && (
            <p className="update-msg text-sm">
              Reviewer note: {employeeWorkPlan.update.reviewNote}
            </p>
          )}
          <p className="update-msg text-sm">
            Submitted:{' '}
            {employeeWorkPlan[operationName].updatedDataAndTime &&
              dayjs(employeeWorkPlan[operationName].updatedDataAndTime).format(
                'hh:mm A, Do MMMM, YYYY',
              )}
          </p>
        </>
      )}
    </>
  );
};

export default ViewSchedule;
