import dayjs from 'dayjs';
import { Briefcase, CalendarCheck2, Clock3 } from 'lucide-react';
import { Badge, type BadgeProps } from '../ui/badge';
import { Progress } from '../ui/progress';
import { StatCard } from '../ui/stat-card';
import { type IndividualSchedule, type WorkPlanStatus } from '../../types/schdeule.type';
import { calculateProjectTotalHours } from '../../utils/date-time-calculation';
import { getHoursProgressInfo } from '../../utils/common-functions';

const STATUS_COLOR: Record<WorkPlanStatus, NonNullable<BadgeProps['color']>> = {
  pending: 'gold',
  approved: 'green',
  rejected: 'red',
};

const STATUS_LABEL: Record<WorkPlanStatus, string> = {
  pending: 'Pending review',
  approved: 'Approved',
  rejected: 'Rejected',
};

interface TimesheetOverviewProps {
  name?: string | undefined;
  workData: IndividualSchedule;
}

const TimesheetOverview = ({ name, workData }: TimesheetOverviewProps) => {
  const hour = dayjs().hour();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = name?.split(' ')[0];

  const todaysHours = calculateProjectTotalHours(workData.schedule.projectDetail);
  const { maxHours, progressPercentage, color } = getHoursProgressInfo(todaysHours);
  const projectCount = workData.schedule.projectDetail.length;
  const updateStatus = workData.update.status;

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-text-color md:text-3xl">
            {greeting}
            {firstName ? `, ${firstName}` : ''}
          </h1>
          <p className="text-sm text-muted-foreground">{dayjs().format('dddd, DD MMMM YYYY')}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          accent="primary"
          icon={<Clock3 className="h-5 w-5" />}
          label="Today's hours"
          value={`${String(todaysHours)}h / ${String(maxHours)}h`}
          footer={
            <Progress
              percent={progressPercentage}
              color={color}
              showInfo={false}
              className="w-full"
            />
          }
        />
        <StatCard
          accent="info"
          icon={<Briefcase className="h-5 w-5" />}
          label="Projects today"
          value={projectCount}
        />
        <StatCard
          accent={updateStatus ? 'success' : 'warning'}
          icon={<CalendarCheck2 className="h-5 w-5" />}
          label="Work update"
          value={
            updateStatus ? (
              <Badge color={STATUS_COLOR[updateStatus]} className="uppercase">
                {STATUS_LABEL[updateStatus]}
              </Badge>
            ) : (
              <span className="text-sm font-medium text-muted-foreground">Not submitted</span>
            )
          }
        />
      </div>
    </div>
  );
};

export default TimesheetOverview;
