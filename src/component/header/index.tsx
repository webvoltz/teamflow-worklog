import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { CloseIcon, Hamburger } from '../../assets/svg-images';
import BrandLogo from '../brand-logo';
import { Avatar } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { ROUTE_CONST } from '../../constants/route-constant';
import { type RootState } from '../../store';
import { capitalizeFirstLetter } from '../../utils/common-functions';
import { clearLocalStorage } from '../../utils/local-storage';

const Header = () => {
  const { data } = useSelector((state: RootState) => state.user);
  const [menuVisible, setMenuVisible] = useState(false);

  const linkClasses =
    'text-black text-base font-medium rounded-lg px-3 py-1.5 transition-colors md:hover:bg-muted aria-[current=page]:bg-primary/10 aria-[current=page]:text-primary aria-[current=page]:font-semibold';
  const handleSignOut = () => {
    clearLocalStorage();
    // Full reload (rather than a client-side navigate) so the redux store and Apollo
    // cache don't carry the signed-out user's data into the next session.
    window.location.href = ROUTE_CONST.AUTH.LOGIN;
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const isTeamLeader = data?.viewer.userrole.includes('team_leader');

  return (
    <div className="border-b">
      <div className="  my-0 fixed left-0 top-0 bg-white z-10 right-0 m-auto border-b">
        <div className="container mx-auto">
          <nav
            className="bg-white px-2 py-2.5 dark:border-gray-700 dark:bg-gray-800 sm:px-4 rounded flex items-center gap-2"
            style={{ display: 'Flex' }}
          >
            <Link className="flex items-center mr-3" to={ROUTE_CONST.INITIAL_ROUTE}>
              <BrandLogo />
            </Link>
            <div
              className={`mx-auto flex flex-wrap items-center justify-between ${
                menuVisible ? 'menuVisible' : ''
              }`}
            >
              <div
                className={`mt-4 flex flex-col md:mt-0 md:flex-row md:space-x-8 md:text-sm md:font-medium`}
              >
                <ul className="main-menu flex">
                  <li>
                    <NavLink end className={linkClasses} to={ROUTE_CONST.INITIAL_ROUTE}>
                      {' '}
                      Today’s Timesheet
                    </NavLink>
                  </li>
                  {isTeamLeader && (
                    <li>
                      <NavLink className={linkClasses} to={ROUTE_CONST.APPROVALS}>
                        {' '}
                        Approvals
                      </NavLink>
                    </li>
                  )}
                </ul>
              </div>
            </div>
            <div className="flex md:order-2 gap-4 ">
              <div className="space-y-1 text-sm dark:text-white avtar-profile">
                <div className="text-[#101828] font-semibold ">
                  {capitalizeFirstLetter(data?.viewer.name ?? 'team member')}
                </div>
                <div className="text-sm text-[#667085] mt-0">
                  {data?.viewer.userInformation.designation ?? 'Designation'}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger render={<button type="button" className="dropdown-trigger" />}>
                  {data?.viewer.avatar.url ? (
                    <Avatar size={50} src={data.viewer.avatar.url} />
                  ) : (
                    <Avatar size={50}>{data?.viewer.name.charAt(0).toUpperCase() ?? 'TM'}</Avatar>
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>
                    <div>{data?.viewer.name ?? 'Team Member'}</div>
                    <div className="truncate">{data?.viewer.email ?? ''}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <button className="hamburger" onClick={toggleMenu}>
              {menuVisible ? <CloseIcon /> : <Hamburger />}
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Header;
