import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import TeamApprovals from '../../component/team-approvals';
import Spinner from '../../component/loader';
import { ROUTE_CONST } from '../../constants/route-constant';
import { type RootState } from '../../store';

const TeamApprovalsPage = () => {
  const { data: userData, loading } = useSelector((state: RootState) => state.user);
  const isTeamLeader = userData?.viewer.userrole.includes('team_leader');

  if (!loading && userData && !isTeamLeader) {
    return <Navigate to={ROUTE_CONST.INITIAL_ROUTE} />;
  }

  return (
    <Spinner loading={loading}>
      <TeamApprovals />
    </Spinner>
  );
};

export default TeamApprovalsPage;
