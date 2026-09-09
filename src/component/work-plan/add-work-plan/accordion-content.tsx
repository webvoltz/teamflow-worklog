import { Button } from 'antd';
import { useState } from 'react';
import { FaRegCopy } from 'react-icons/fa';
import { HiPlus } from 'react-icons/hi';
import { type OperationName } from '../../../types/schdeule.type';
import AddSchedule from './add-schedule';
import ViewSchedule from '../view-work-plan';

interface AccordionContentProps {
  addWorkSchedule: boolean;
  isWorkExist?: boolean | undefined;
  setAddWorkSchedule: (addWorkSchedule: boolean) => void;
  setTotalHours: (totalHours: number) => void;
  operationName: OperationName;
}

const AccordionContent = ({
  addWorkSchedule,
  isWorkExist,
  setAddWorkSchedule,
  setTotalHours,
  operationName,
}: AccordionContentProps) => {
  const [isCopyScheduleData, setIsCopyScheduleData] = useState(false);
  if (addWorkSchedule) {
    return (
      <AddSchedule
        setAddWorkSchedule={setAddWorkSchedule}
        setTotalHours={setTotalHours}
        operationName={operationName}
        isCopyScheduleData={isCopyScheduleData}
      />
    );
  } else if (isWorkExist) {
    return <ViewSchedule operationName={operationName} />;
  }
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <Button
        size="large"
        className="border-primary focus:ring-0 text-primary btn-add bg-transparent enabled:hover:bg-primary"
        onClick={() => {
          setAddWorkSchedule(true);
          setIsCopyScheduleData(false);
        }}
      >
        <HiPlus className="mr-2 h-5 w-5" />{' '}
        {operationName === 'schedule' ? 'Add new schedule' : 'Add Timesheet'}
      </Button>
      {operationName === 'schedule' && (
        <Button
          size="large"
          type="primary"
          className="bg-primary focus:ring-0 enabled:hover:bg-transparent hover:border-primary btn-copy"
          onClick={() => {
            setIsCopyScheduleData(true);
            setAddWorkSchedule(true);
          }}
        >
          <FaRegCopy className="mr-2 h-5 w-5" /> Copy from yesterday
        </Button>
      )}
    </div>
  );
};

export default AccordionContent;
