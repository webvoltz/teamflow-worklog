import { Moon, Sunrise } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Spinner from '../../component/loader';
import TimesheetOverview from '../../component/timesheet-overview';
import WorkPlan from '../../component/work-plan';
import { fetchEmployeeWorkPlan } from '../../redux/slice/employee-work-plan-slice';
import { fetchProjectOption } from '../../redux/slice/project-option-slice';
import { fetchTaskType } from '../../redux/slice/task-type-slice';
import { type AppDispatch, type RootState } from '../../store';
import { compareDate } from '../../utils/date-time-calculation';

const TodayTimesheet = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: employeeWorkPlan,
    loading,
    error,
  } = useSelector((state: RootState) => state.employeeWorkPlan);
  const { data: userData } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (userData?.viewer) {
      void dispatch(fetchEmployeeWorkPlan({ userId: userData.viewer.userId }));
      void dispatch(fetchTaskType());
      const isTeamLeader = userData.viewer.userrole.includes('team_leader');
      void dispatch(fetchProjectOption({ userId: userData.viewer.userId, isTeamLeader }));
    }
  }, [userData, dispatch]);

  const isWorkScheduleExist = useMemo(
    () => compareDate(employeeWorkPlan.schedule),
    [employeeWorkPlan],
  );
  const isWorkUpdateExist = useMemo(() => compareDate(employeeWorkPlan.update), [employeeWorkPlan]);

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <Spinner loading={loading}>
      <TimesheetOverview name={userData?.viewer.name} workData={employeeWorkPlan} />
      {/* Work Schedule */}
      <WorkPlan
        scheduleTitle={'Work schedule'}
        scheduleicon={<Sunrise className="h-6 w-6" />}
        operationName={'schedule'}
        isWorkExist={isWorkScheduleExist}
        workData={employeeWorkPlan}
      />
      {isWorkScheduleExist && (
        <>
          {/* Work Update */}
          <WorkPlan
            scheduleTitle={'Work update'}
            operationName={'update'}
            scheduleicon={<Moon className="h-6 w-6" />}
            isWorkExist={isWorkUpdateExist}
            workData={employeeWorkPlan}
          />
        </>
      )}
    </Spinner>
  );
};

export default TodayTimesheet;
