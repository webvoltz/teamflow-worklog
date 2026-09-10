import { type ReactNode, useState } from 'react';
import { FaRegCopy } from 'react-icons/fa';
import { type IndividualSchedule, type OperationName } from '../../types/schdeule.type';
import { CopyAllWork } from '../../utils/copy-work';
import AccordionContent from './add-work-plan/accordion-content';
import { getHoursProgressInfo } from '../../utils/common-functions';
import { Accordion } from '../ui/accordion';
import { Progress } from '../ui/progress';

interface WorkPlanProps {
  scheduleTitle: string;
  scheduleicon?: ReactNode;
  isWorkExist?: boolean | undefined;
  operationName: OperationName;
  workData: IndividualSchedule;
}

const WorkPlan = ({
  scheduleTitle,
  scheduleicon,
  isWorkExist,
  operationName,
  workData,
}: WorkPlanProps) => {
  const [addWorkSchedule, setAddWorkSchedule] = useState(false);
  const [totalHours, setTotalHours] = useState(0);

  const header = (
    <div className="flex justify-between items-center text-black bg-transparent hover:bg-transparent font-bold text-base focus:ring-1 md:text-xl accordian-head">
      <div className="flex shrink-0 justify-start  items-center">
        {scheduleicon && (
          <span className="mr-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            {scheduleicon}
          </span>
        )}
        <div className="me-4 whitespace-nowrap">{scheduleTitle}</div>
        {isWorkExist && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              CopyAllWork(operationName, workData);
            }}
          >
            <FaRegCopy className="mr-2 h-5 w-5 cursor-pointer" />
          </button>
        )}
      </div>
      {isWorkExist && (
        <div className="text-base font-bold dark:text-white text-black">
          {getHoursProgressInfo(totalHours).maxHours} h
        </div>
      )}

      {addWorkSchedule && (
        <div className="progess-bar shrink-0">
          <div className="text-base font-bold dark:text-white">
            {totalHours}h / {getHoursProgressInfo(totalHours).maxHours}h
          </div>
          <Progress
            percent={getHoursProgressInfo(totalHours).progressPercentage}
            color={getHoursProgressInfo(totalHours).color}
            showInfo={false}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="mx-auto my-5 rounded-xl border border-border bg-background p-4 shadow-sm sm:p-6">
      <Accordion header={header}>
        <AccordionContent
          addWorkSchedule={addWorkSchedule}
          isWorkExist={isWorkExist}
          setAddWorkSchedule={setAddWorkSchedule}
          setTotalHours={setTotalHours}
          operationName={operationName}
        />
      </Accordion>
    </div>
  );
};

export default WorkPlan;
