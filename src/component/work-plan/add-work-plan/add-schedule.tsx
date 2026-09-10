import { useMutation } from '@apollo/client/react';
import { Button, notification } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { SUBMIT_SCHEDULE } from '../../../graphql/schedule.graphql';
import { fetchEmployeeWorkPlan } from '../../../redux/slice/employee-work-plan-slice';
import { type AppDispatch, type RootState } from '../../../store';
import { type SingleTask } from '../../../types/schdeule.type';
import { vaildateSchedule } from '../../../utils/common-functions';
import {
  addCalculateWorkScheduleHours,
  calculateProjectTotalHours,
  convertHoursToFloat,
  removeTotalHours,
} from '../../../utils/date-time-calculation';
import AddProjectForm from './add-project-form';

interface AddScheduleProps {
  setAddWorkSchedule: (value: boolean) => void;
  setTotalHours: (value: number) => void;
  operationName: string;
  isCopyScheduleData: boolean;
}

const AddSchedule = ({
  setAddWorkSchedule,
  setTotalHours,
  operationName,
  isCopyScheduleData,
}: AddScheduleProps) => {
  const { data: employeeWorkPlan } = useSelector((state: RootState) => state.employeeWorkPlan);
  const { data: userData } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const [submitScheduleMutation, { loading: isSubmitLoading }] = useMutation(SUBMIT_SCHEDULE);
  const singleTask: SingleTask = useMemo(
    () => ({
      projectName: '',
      projectId: '',
      totalHours: 0,
      taskDetail: [{ description: '', taskType: '', hours: '' }],
    }),
    [],
  );
  const initialWorkSchedule = useMemo(() => [singleTask], [singleTask]);
  const [workSchedule, setWorkSchedule] = useState(initialWorkSchedule);
  const [tomorrowSchedule, setTomorrowSchedule] = useState(initialWorkSchedule);

  // The "copy from yesterday" effect below intentionally reads the latest
  // employeeWorkPlan without re-running whenever it changes - a ref keeps
  // that legitimate, without silencing react-hooks/exhaustive-deps. Synced in
  // its own effect (not during render) per react-hooks/refs.
  const employeeWorkPlanRef = useRef(employeeWorkPlan);
  useEffect(() => {
    employeeWorkPlanRef.current = employeeWorkPlan;
  }, [employeeWorkPlan]);

  const handleAddProject = useCallback(
    (isTomorrow: boolean) => {
      const schedule = isTomorrow ? tomorrowSchedule : workSchedule;
      const setSchedule = isTomorrow ? setTomorrowSchedule : setWorkSchedule;
      if (vaildateSchedule(schedule)) {
        setSchedule([...schedule, singleTask]);
      }
    },
    [tomorrowSchedule, workSchedule, singleTask],
  );

  const handleRemoveProject = useCallback(
    (projectIndex: number, isTomorrow: boolean) => {
      const schedule = isTomorrow ? tomorrowSchedule : workSchedule;
      const setSchedule = isTomorrow ? setTomorrowSchedule : setWorkSchedule;
      setSchedule(schedule.filter((_, index) => index !== projectIndex));
    },
    [tomorrowSchedule, workSchedule],
  );

  const handleSubmitSchedule = async () => {
    if (!vaildateSchedule(workSchedule)) {
      return;
    }
    const schdeuleWork = removeTotalHours(workSchedule);
    let tomorrowWork: SingleTask[] = [singleTask];
    if (operationName === 'update') {
      tomorrowWork = removeTotalHours(tomorrowSchedule);
    }
    const convertedWorkSchedule = convertHoursToFloat(schdeuleWork);
    const userId = userData?.viewer.userId;
    const result = await submitScheduleMutation({
      variables: {
        userId: userId,
        schedule: convertedWorkSchedule,
        operationType: operationName,
      },
    }).catch((error: unknown) => {
      notification.error({ title: error instanceof Error ? error.message : 'An error occurred' });
      return null;
    });
    if (!result?.data?.createMyTaskEntry.success) {
      return;
    }
    if (operationName === 'update' && vaildateSchedule(tomorrowSchedule, true)) {
      await submitScheduleMutation({
        variables: {
          userId: userId,
          schedule: convertHoursToFloat(tomorrowWork),
          operationType: 'tomorrow',
        },
      }).catch((error: unknown) => {
        notification.error({
          title: error instanceof Error ? error.message : 'An error occurred',
        });
      });
    }
    // Refetch (and only then close the form) here, synchronously with the
    // successful submit - a useEffect keyed on the mutation's own `data`
    // races against this same submit unmounting AddSchedule via
    // setAddWorkSchedule(false) and can lose, leaving the redux store stale.
    setAddWorkSchedule(false);
    if (userId) {
      void dispatch(fetchEmployeeWorkPlan({ userId }));
    }
  };

  useEffect(() => {
    setTotalHours(calculateProjectTotalHours(workSchedule));
  }, [workSchedule, setTotalHours]);

  useEffect(() => {
    // if copy then copy from Tomorrow data if added click for update then copy from schedule
    const latestWorkPlan = employeeWorkPlanRef.current;
    if (
      (isCopyScheduleData &&
        operationName === 'schedule' &&
        latestWorkPlan.tomorrow.projectDetail.length > 0) ||
      (operationName === 'update' && latestWorkPlan.schedule.projectDetail.length > 0)
    ) {
      const data =
        isCopyScheduleData && operationName === 'schedule'
          ? latestWorkPlan.tomorrow.projectDetail
          : latestWorkPlan.schedule.projectDetail;
      const calcluatedHours = addCalculateWorkScheduleHours(data, false);
      setWorkSchedule(calcluatedHours);
    } else {
      setWorkSchedule(initialWorkSchedule);
      setTomorrowSchedule(initialWorkSchedule);
    }
  }, [isCopyScheduleData, operationName, initialWorkSchedule]);

  return (
    <>
      {operationName === 'update' && (
        <h2 className="text-sm font-bold text-gray-800 mb-5">Today</h2>
      )}
      <AddProjectForm
        workSchedule={workSchedule}
        handleAddProject={handleAddProject}
        handleRemoveProject={handleRemoveProject}
        setWorkSchedule={setWorkSchedule}
        isTomorrow={false}
      />
      {operationName === 'update' && (
        <div className="border-t mt-6">
          <h2 className="text-sm font-bold text-gray-800 pt-5 mb-5">Tomorrow’s Plan</h2>
          <AddProjectForm
            workSchedule={tomorrowSchedule}
            handleAddProject={handleAddProject}
            handleRemoveProject={handleRemoveProject}
            setWorkSchedule={setTomorrowSchedule}
            isTomorrow={true}
          />
        </div>
      )}
      <div>
        <div className="flex flex-wrap gap-2 pt-6 justify-center mb-4 mt-6">
          <Button
            onClick={() => {
              setAddWorkSchedule(false);
            }}
            size="large"
            className="cancel-btn"
          >
            Cancel
          </Button>
          <Button
            size="large"
            className="bg-primary focus:ring-0 enabled:hover:bg-transparent hover:border-primary btn-copy"
            onClick={() => {
              void handleSubmitSchedule();
            }}
            loading={isSubmitLoading}
            type="primary"
          >
            <FaCheckCircle className="w-5 h-5 mr-2" />
            Submit
          </Button>
        </div>

        <span className="flex flex-wrap justify-center text-sm text-[#667085]">
          **You can not edit the details once you submit.
        </span>
      </div>
    </>
  );
};

export default AddSchedule;
