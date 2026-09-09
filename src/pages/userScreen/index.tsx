import Spinner from '../../component/loader';
import TodayTimesheet from '../todayTimesheet';

const UserScreen = () => {
  return (
    <Spinner loading={false}>
      <div className="container mx-auto mt-24 px-3">
        <TodayTimesheet />
      </div>
    </Spinner>
  );
};

export default UserScreen;
