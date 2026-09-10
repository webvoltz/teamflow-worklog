import { FaPlus } from 'react-icons/fa';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import AddScheduleForm from '../add-schedule-form';
import { type SingleTask } from '../../../types/schdeule.type';
import { Button } from '../../ui/button';

interface AddProjectFormProps {
  workSchedule: SingleTask[];
  handleAddProject: (isTomorrow: boolean) => void;
  handleRemoveProject: (index: number, isTomorrow: boolean) => void;
  setWorkSchedule: (e: SingleTask[]) => void;
  isTomorrow: boolean;
  showBillingType?: boolean | undefined;
}

const AddProjectForm = ({
  workSchedule,
  handleAddProject,
  handleRemoveProject,
  setWorkSchedule,
  isTomorrow,
  showBillingType,
}: AddProjectFormProps) => {
  return (
    <>
      {workSchedule.map((projectDetail, projectIndex) => {
        return (
          <div key={projectDetail.projectId} className="mb-6 flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <AddScheduleForm
                workSchedule={workSchedule}
                setWorkSchedule={setWorkSchedule}
                projectDetail={projectDetail}
                projectIndex={projectIndex}
                showBillingType={showBillingType}
              />
            </div>
            {workSchedule.length > 1 && (
              <IoMdCloseCircleOutline
                className="mt-1 h-7 w-7 shrink-0 cursor-pointer text-muted-foreground hover:text-destructive"
                onClick={() => {
                  handleRemoveProject(projectIndex, isTomorrow);
                }}
              />
            )}
          </div>
        );
      })}
      <div className="flex justify-end">
        <Button
          variant="primary"
          size="large"
          className="border-primary focus:ring-0 text-primary btn-add bg-transparent enabled:hover:bg-primary "
          onClick={() => {
            handleAddProject(isTomorrow);
          }}
        >
          <FaPlus className="w-5 h-5 mr-2" />
          Add Project
        </Button>
      </div>
    </>
  );
};

export default AddProjectForm;
