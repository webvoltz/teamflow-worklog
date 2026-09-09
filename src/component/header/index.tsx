import type { MenuProps } from "antd";
import { Avatar, Dropdown, Menu, Typography } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { CloseIcon, Hamburger } from "../../assets/svg-images";
import BrandLogo from "../brand-logo";
import { ROUTE_CONST } from "../../constants/route-constant";
import { RootState } from "../../store";
import { capitalizeFirstLetter } from "../../utils/common-functions";
import { clearLocalStorage } from "../../utils/local-storage";

const Header = () => {
    const { data } = useSelector((state: RootState) => state.user);
    const { Text } = Typography;
    const [menuVisible, setMenuVisible] = useState(false);

    const linkClasses = "text-black text-base md:text-black custom-hover border-b-2 border-transparent";
    const handleSignOut = () => {
        clearLocalStorage();
        // Full reload (rather than a client-side navigate) so the redux store and Apollo
        // cache don't carry the signed-out user's data into the next session.
        window.location.href = ROUTE_CONST.AUTH.LOGIN;
    };

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    const items: MenuProps["items"] = [
        {
            key: "0",
            label: (
                <div>
                    <Text>{data?.viewer?.name ?? "Team Member"}</Text> <br />
                    <Text ellipsis>{data?.viewer?.email ?? ""}</Text>
                </div>
            ),
        },
        {
            type: "divider",
        },
        {
            label: "Sign out",
            onClick: handleSignOut,
            key: "2",
        },
    ];

    const isTeamLeader = data?.viewer?.userrole?.includes("team_leader");

    const navItems: MenuProps["items"] = [
        {
            label: (
                <NavLink className={linkClasses} to={ROUTE_CONST.INITIAL_ROUTE}>
                    {" "}
                    Today’s Timesheet
                </NavLink>
            ),
            key: "today-timesheet",
            title: "",
        },
        ...(isTeamLeader
            ? [
                  {
                      label: (
                          <NavLink className={linkClasses} to={ROUTE_CONST.APPROVALS}>
                              {" "}
                              Approvals
                          </NavLink>
                      ),
                      key: "approvals",
                      title: "",
                  },
              ]
            : []),
    ];

    return (
        <div className="border-b">
            <div className="  my-0 fixed left-0 top-0 bg-white z-10 right-0 m-auto border-b">
                <div className="container mx-auto">
                    <nav
                        className="bg-white px-2 py-2.5 dark:border-gray-700 dark:bg-gray-800 sm:px-4 rounded flex items-center gap-2"
                        style={{ display: "Flex" }}
                    >
                        <a className="flex items-center mr-3" href="#">
                            <BrandLogo />
                        </a>
                        <div
                            className={`mx-auto flex flex-wrap items-center justify-between ${
                                menuVisible ? "menuVisible" : ""
                            }`}
                        >
                            <div
                                className={`mt-4 flex flex-col md:mt-0 md:flex-row md:space-x-8 md:text-sm md:font-medium`}
                            >
                                <Menu
                                    className="main-menu flex"
                                    mode="inline"
                                    inlineCollapsed={menuVisible}
                                    items={navItems}
                                />
                            </div>
                        </div>
                        <div className="flex md:order-2 gap-4 ">
                            <div className="space-y-1 text-sm dark:text-white avtar-profile">
                                <div className="text-[#101828] font-semibold ">
                                    {capitalizeFirstLetter(data?.viewer?.name ?? "team member") || ""}
                                </div>
                                <div className="text-sm text-[#667085] mt-0">
                                    {data?.viewer?.userInformation.designation ?? "Designation"}
                                </div>
                            </div>
                            <Dropdown menu={{ items }} trigger={["click"]}>
                                <a
                                    className="ant-dropdown-link"
                                    onClick={(e) => e.preventDefault()}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                        }
                                    }}
                                >
                                    {data?.viewer?.avatar?.url ? (
                                        <Avatar size={50} src={data?.viewer?.avatar?.url} />
                                    ) : (
                                        <Avatar
                                            style={{
                                                verticalAlign: "middle",
                                            }}
                                            size={50}
                                        >
                                            {data?.viewer?.name?.charAt(0).toUpperCase() ?? "TM"}
                                        </Avatar>
                                    )}
                                </a>
                            </Dropdown>
                        </div>
                        <button className="hamburger" onClick={toggleMenu}>
                            {menuVisible ? CloseIcon : Hamburger}
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Header;
