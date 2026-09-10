import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeamWorkPlans, reviewWorkPlan } from '../../redux/slice/team-approval-slice';
import { type AppDispatch, type RootState } from '../../store';
import { type TeamWorkPlanEntry, type WorkPlanStatus } from '../../types/schdeule.type';
import { calculateTaskTotalHours } from '../../utils/date-time-calculation';
import { Badge, type BadgeProps } from '../ui/badge';
import { Button } from '../ui/button';
import { Dialog } from '../ui/dialog';
import { EmptyState } from '../ui/empty-state';
import { Textarea } from '../ui/input';

const STATUS_COLOR: Record<WorkPlanStatus, NonNullable<BadgeProps['color']>> = {
  pending: 'gold',
  approved: 'green',
  rejected: 'red',
};

const TeamApprovals = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: userData } = useSelector((state: RootState) => state.user);
  const {
    data: teamWorkPlans,
    loading,
    error,
  } = useSelector((state: RootState) => state.teamApproval);
  const [rejectTarget, setRejectTarget] = useState<TeamWorkPlanEntry | null>(null);
  const [rejectNote, setRejectNote] = useState('');

  useEffect(() => {
    if (userData?.viewer) {
      void dispatch(fetchTeamWorkPlans({ teamLeaderId: userData.viewer.userId }));
    }
  }, [userData, dispatch]);

  const handleApprove = (entry: TeamWorkPlanEntry) => {
    void dispatch(reviewWorkPlan({ entryId: entry.id, status: 'approved' }));
  };

  const handleReject = () => {
    if (!rejectTarget) return;
    void dispatch(
      reviewWorkPlan({ entryId: rejectTarget.id, status: 'rejected', note: rejectNote }),
    );
    setRejectTarget(null);
    setRejectNote('');
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto mt-24 px-3">
      <h1 className="text-2xl font-bold mb-6">Team Approvals</h1>
      {!loading && teamWorkPlans.length === 0 && (
        <EmptyState description="No work updates submitted yet" />
      )}
      {teamWorkPlans.map((entry) => (
        <div key={entry.id} className="border-[#D0D5DD] border-2 rounded-lg px-4 py-4 mb-4">
          <div className="flex justify-between items-start flex-wrap gap-2">
            <div>
              <h2 className="text-base font-bold">{entry.employeeName}</h2>
              <p className="text-sm text-[#667085]">{entry.designation}</p>
            </div>
            <Badge color={STATUS_COLOR[entry.status]} className="uppercase">
              {entry.status}
            </Badge>
          </div>
          <ul className="py-3">
            {entry.projectDetail.map((project) => (
              <li key={project.projectId} className="text-sm mb-1">
                <span className="font-semibold">{project.projectName}</span> (
                {calculateTaskTotalHours(project.taskDetail)}h)
                <ul>
                  {project.taskDetail.map((task) => (
                    <li key={task.description}>
                      - {task.description} ({task.hours}h)
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          {entry.reviewNote && <p className="text-sm text-[#667085]">Note: {entry.reviewNote}</p>}
          {entry.status === 'pending' && (
            <div className="flex gap-2 justify-end">
              <Button
                onClick={() => {
                  setRejectTarget(entry);
                }}
              >
                Reject
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  handleApprove(entry);
                }}
              >
                Approve
              </Button>
            </div>
          )}
        </div>
      ))}
      <Dialog
        title={`Reject ${rejectTarget?.employeeName ?? ''}'s work update`}
        open={rejectTarget !== null}
        onOpenChange={(open) => {
          if (!open) setRejectTarget(null);
        }}
        onOk={handleReject}
        okText="Reject"
      >
        <Textarea
          placeholder="Optional note for the employee"
          value={rejectNote}
          onChange={(e) => {
            setRejectNote(e.target.value);
          }}
        />
      </Dialog>
    </div>
  );
};

export default TeamApprovals;
