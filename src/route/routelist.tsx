import { BrowserRouter, Route, Routes } from 'react-router-dom';

import NotFound from '../component/not-found';
import { ROUTE_CONST } from '../constants/route-constant';
import AuthorisedLayout from '../layout/authorised/authorised.layout';
import UnAuthorisedLayout from '../layout/unAuthorised.layout';
import Authentication from '../pages/authentication';
import TeamApprovalsPage from '../pages/teamApprovals';
import UserScreen from '../pages/userScreen';

const RouteList = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTE_CONST.INITIAL_ROUTE} element={<AuthorisedLayout />}>
          <Route path={ROUTE_CONST.INITIAL_ROUTE} element={<UserScreen />} />
          <Route path={ROUTE_CONST.APPROVALS} element={<TeamApprovalsPage />} />
        </Route>
        <Route path={ROUTE_CONST.INITIAL_ROUTE} element={<UnAuthorisedLayout />}>
          <Route path={ROUTE_CONST.AUTH.LOGIN} element={<Authentication />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouteList;
