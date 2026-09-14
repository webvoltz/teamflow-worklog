import { Navigate, Outlet } from 'react-router-dom';

import { ROUTE_CONST } from '../constants/route-constant';

const UnAuthorisedLayout = () => {
  const authToken = localStorage.getItem('token');
  if (authToken) {
    return <Navigate to={ROUTE_CONST.INITIAL_ROUTE} />;
  }
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default UnAuthorisedLayout;
