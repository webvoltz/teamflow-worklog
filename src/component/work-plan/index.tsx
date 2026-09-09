import { Collapse, type CollapseProps, Progress } from 'antd';
import { useState } from 'react';
import { FaRegCopy } from 'react-icons/fa';
import { type IndividualSchedule, type OperationName } from '../../types/schdeule.type';
import { CopyAllWork } from '../../utils/copy-work';
import AccordionContent from './add-work-plan/accordion-content';
import { getHoursProgressInfo } from '../../utils/common-functions';

interface WorkPlanProps {
  scheduleTitle: string;
  scheduleicon?: string | undefined;
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

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: (
        <div className="flex justify-between items-center text-black bg-transparent hover:bg-transparent font-bold text-base focus:ring-1 md:text-xl accordian-head">
          <div className="flex justify-start  items-center">
            {scheduleicon && <img src={scheduleicon} alt="" className="inline-block mr-3" />}
            <div className="me-4">{scheduleTitle}</div>
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
            <div className="progess-bar">
              <div className="text-base font-bold dark:text-white">
                {totalHours}h / {getHoursProgressInfo(totalHours).maxHours}h
              </div>
              <Progress
                percent={getHoursProgressInfo(totalHours).progressPercentage}
                size="small"
                strokeColor={getHoursProgressInfo(totalHours).color}
                showInfo={false}
              />
            </div>
          )}
        </div>
      ),
      children: (
        <AccordionContent
          addWorkSchedule={addWorkSchedule}
          isWorkExist={isWorkExist}
          setAddWorkSchedule={setAddWorkSchedule}
          setTotalHours={setTotalHours}
          operationName={operationName}
        />
      ),
    },
  ];

  return (
    <div className="mx-auto my-5">
      <Collapse items={items} expandIconPosition="end" defaultActiveKey={[1]} />
    </div>
  );
};

export default WorkPlan;
