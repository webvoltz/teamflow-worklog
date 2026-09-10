import { type ChangeEvent, useMemo } from 'react';
import { HiOutlinePlusCircle } from 'react-icons/hi';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { type RootState } from '../../store';
import { type OptionArray } from '../../types/common.type';
import { type SingleTask } from '../../types/schdeule.type';
import { validateTaskDetail } from '../../utils/common-functions';
import { calculateTaskTotalHours } from '../../utils/date-time-calculation';
import { cn } from '../../utils/cn';
import { notify } from '../../utils/notify';
import { Accordion } from '../ui/accordion';
import { Input, Textarea } from '../ui/input';
import { Select } from '../ui/select';

interface AddScheduleFormProps {
  workSchedule: SingleTask[];
  setWorkSchedule: (e: SingleTask[]) => void;
  projectDetail: SingleTask;
  projectIndex: number;
  showBillingType?: boolean | undefined;
}

const AddScheduleForm = ({
  workSchedule,
  setWorkSchedule,
  projectDetail,
  projectIndex,
  showBillingType,
}: AddScheduleFormProps) => {
  const { data: taskTypeData } = useSelector((state: RootState) => state.taskType);
  const { data: projectOptionData } = useSelector((state: RootState) => state.projectOption);
  const { taskDetail, projectId, totalHours } = projectDetail;
  const projectOption = useMemo<OptionArray>(() => {
    if (!projectOptionData) {
      return [
        { label: 'Project 1', value: 'project1' },
        { label: 'Project 2', value: 'project2' },
        { label: 'Project 3', value: 'project3' },
      ];
    }
    return projectOptionData.map((task) => ({ value: task.id, label: task.title }));
  }, [projectOptionData]);
  const taskTypeOption = useMemo<OptionArray>(() => {
    if (!taskTypeData) {
      return [
        { label: 'Client change', value: 'clientChange' },
        { label: 'Desgin', value: 'desgin' },
        { label: 'Development', value: 'developmenet' },
      ];
    }
    return taskTypeData.map((task) => ({ value: String(task.termTaxonomyId), label: task.name }));
  }, [taskTypeData]);
  const billingTypeOption = [
    { value: 'Billable', label: 'Billable' },
    { value: 'Non Billable', label: 'Non Billable' },
  ];

  const handleProjectSelectChange = (selectedValue: string) => {
    const changeDetail = [...workSchedule];
    const current = changeDetail[projectIndex];
    if (!current) return;
    const selectedOption = projectOption.find((option) => option.value === selectedValue);
    changeDetail[projectIndex] = {
      ...current,
      projectId: selectedValue,
      projectName: selectedOption ? selectedOption.label : '',
    };
    setWorkSchedule(changeDetail);
  };

  const handleTaskDetailChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    taskDetailIndex: number,
  ) => {
    const { value, name } = e.target;
    const changeDetail = [...workSchedule];
    const current = changeDetail[projectIndex];
    if (!current) return;
    if (name === 'hours') {
      // Validate if the input is a valid number and within the increments of 0.5 after the decimal
      const regex = /^\d*\.?\d{0,2}$/;
      if (!regex.test(value)) {
        return;
      }
      const [, decimalPart] = value.split('.');
      if (decimalPart?.length === 2) {
        const secondDecimalDigit = decimalPart[1];
        if (secondDecimalDigit && Number(secondDecimalDigit) % 5 !== 0) {
          return;
        }
      }
    }

    const updatedTaskDetail = [...current.taskDetail];
    const currentTask = updatedTaskDetail[taskDetailIndex];
    if (!currentTask) return;
    updatedTaskDetail[taskDetailIndex] =
      name === 'hours' ? { ...currentTask, hours: value } : { ...currentTask, description: value };
    if (name === 'hours') {
      const totalHours = calculateTaskTotalHours(updatedTaskDetail);
      changeDetail[projectIndex] = {
        ...current,
        taskDetail: updatedTaskDetail,
        totalHours,
      };
    } else {
      changeDetail[projectIndex] = {
        ...current,
        taskDetail: updatedTaskDetail,
      };
    }
    setWorkSchedule(changeDetail);
  };

  const handleTaskTypeChange = (e: string, taskDetailIndex: number, name: string) => {
    const changeDetail = [...workSchedule];
    const current = changeDetail[projectIndex];
    if (!current) return;
    const updatedTaskDetail = [...current.taskDetail];
    const currentTask = updatedTaskDetail[taskDetailIndex];
    if (!currentTask) return;
    updatedTaskDetail[taskDetailIndex] =
      name === 'taskStatus' ? { ...currentTask, taskStatus: e } : { ...currentTask, taskType: e };
    changeDetail[projectIndex] = {
      ...current,
      taskDetail: updatedTaskDetail,
    };
    setWorkSchedule(changeDetail);
  };

  const handleAddMoreTask = () => {
    const changeDetail = [...workSchedule];
    const current = changeDetail[projectIndex];
    if (!current) return;
    if (!validateTaskDetail(current.taskDetail)) {
      notify.error('Task description and task type should not be empty');
      return;
    }
    const updatedTaskDetail = [...current.taskDetail, { description: '', taskType: '', hours: 0 }];
    changeDetail[projectIndex] = {
      ...current,
      taskDetail: updatedTaskDetail,
    };
    setWorkSchedule(changeDetail);
  };

  const handleRemoveTask = (taskDetailIndex: number) => {
    const changeDetail = [...workSchedule];
    const current = changeDetail[projectIndex];
    if (!current) return;
    const updatedTaskDetail = [...current.taskDetail];
    updatedTaskDetail.splice(taskDetailIndex, 1);
    changeDetail[projectIndex] = {
      ...current,
      taskDetail: updatedTaskDetail,
      totalHours: updatedTaskDetail.reduce(
        (total, task) => total + (parseFloat(task.hours.toString()) || 0),
        0,
      ),
    };

    setWorkSchedule(changeDetail);
  };

  const header = (
    <div className="accordian-head">
      <Select
        id="projectName"
        data-testid="project-select"
        size="small"
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="custom-select text-sm text-[#667085] "
        value={projectId ?? null}
        onChange={(value) => {
          handleProjectSelectChange(value);
        }}
        placeholder="Client / Project Name"
        options={projectOption}
      />
      <div className="font-bold text-black">{totalHours}h</div>
    </div>
  );

  return (
    <Accordion header={header}>
      <div className="p-0">
        <form className="w-full">
          {taskDetail.map((singleTaskDetail, taskDetailIndex) => {
            const { description, taskType, hours, taskStatus = '' } = singleTaskDetail;
            return (
              <div
                key={taskDetailIndex}
                className={cn(
                  'grid grid-cols-1 gap-3 border-b border-border py-3 last:border-b-0 md:items-center',
                  showBillingType
                    ? 'md:grid-cols-[minmax(0,1fr)_11.25rem_11.25rem_10rem_auto]'
                    : 'md:grid-cols-[minmax(0,1fr)_11.25rem_10rem_auto]',
                )}
              >
                <Textarea
                  id="grid-city"
                  placeholder="Enter task details"
                  value={description}
                  name="description"
                  onChange={(e) => {
                    handleTaskDetailChange(e, taskDetailIndex);
                  }}
                />
                {showBillingType && (
                  <Select
                    id="grid-state"
                    value={taskStatus || null}
                    onChange={(e) => {
                      handleTaskTypeChange(e, taskDetailIndex, 'taskStatus');
                    }}
                    options={billingTypeOption}
                    placeholder="Select billing type"
                  />
                )}
                <Select
                  id="grid-state"
                  data-testid="task-type-select"
                  value={taskType || null}
                  onChange={(e) => {
                    handleTaskTypeChange(e, taskDetailIndex, 'taskType');
                  }}
                  options={taskTypeOption}
                  placeholder="Select task type"
                />
                <Input
                  id="grid-zip"
                  type="text"
                  placeholder="Enter hours"
                  suffix="Hours"
                  value={hours}
                  name="hours"
                  onChange={(e) => {
                    handleTaskDetailChange(e, taskDetailIndex);
                  }}
                />
                <div className="flex items-center justify-center gap-1 md:justify-end">
                  {taskDetail.length === 1 || taskDetail.length - 1 === taskDetailIndex ? (
                    <>
                      <HiOutlinePlusCircle
                        className="h-7 w-7 cursor-pointer text-muted-foreground hover:text-primary"
                        onClick={() => {
                          handleAddMoreTask();
                        }}
                      />
                      {taskDetail.length !== 1 && taskDetail.length - 1 === taskDetailIndex && (
                        <IoMdCloseCircleOutline
                          className="h-7 w-7 cursor-pointer text-muted-foreground hover:text-destructive"
                          onClick={() => {
                            handleRemoveTask(taskDetailIndex);
                          }}
                        />
                      )}
                    </>
                  ) : (
                    <IoMdCloseCircleOutline
                      className="h-7 w-7 cursor-pointer text-muted-foreground hover:text-destructive"
                      onClick={() => {
                        handleRemoveTask(taskDetailIndex);
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </form>
      </div>
    </Accordion>
  );
};

export default AddScheduleForm;
