import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Header from "../../component/header";
import { ROUTE_CONST } from "../../constants/route-constant";
import { fetchUserData } from "../../redux/slice/user-slices";
import { AppDispatch, RootState } from "../../store";
import { getLocalStorageItem } from "../../utils/local-storage";

const AuthorisedLayout = () => {
  const authToken = getLocalStorageItem("token") || '';
  const dispatch = useDispatch<AppDispatch>();
  const { data: userData } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (authToken && !userData) {
      dispatch(fetchUserData());
    }
  }, [authToken, userData]);

  if (!authToken) {
    return <Navigate to={ROUTE_CONST.AUTH.LOGIN} />;
  }
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
};

export default AuthorisedLayout;
