import { signOut } from "firebase/auth";
import { NavLink, useNavigate } from "react-router-dom";

import { auth } from "../config/firebase";
import MyLists from "../components/Profile/MyLists";
import { useQuery } from "@tanstack/react-query";
import { getUser, type UserT } from "../functions/firebase/getUser";
import { useEffect, useState } from "react";
import { profileSideBarLinks } from "../constants/constValues";
import ProfileSidebar from "../components/Profile/ProfileSidebar";
import MainSection from "../components/Profile/MainSection";

import Icon from "@mui/material/Icon";

const Profile = () => {
    const user = auth.currentUser;

    const { data, isLoading, error } = useQuery({
        queryKey: ["user", user?.uid],
        queryFn: () => getUser(user!.uid),
        enabled: !!user?.uid,
    });

    // Sidebar Link State
    const [sideBarLink, setSideBarLink] = useState<string>("overview");

    return (
        <div className="w-full flex flex-col items-center">
            <div className="w-full flex flex-col items-center mt-20">
                {/* Top Section */}
                <div className="flex w-full gap-10 items-center">
                    {/* Profile Picture */}
                    <img
                        src={`${`${user?.photoURL}`.slice(0, -5)}s300-c`}
                        alt="Profile Picture"
                        className="max-w-[155px] rounded-full"
                    />
                    {/* UserName */}
                    <div className="flex flex-col gap-3">
                        <h2 className="font-poppins text-4xl font-semibold leading-[120%] text-whiteMain">
                            {data?.name}
                        </h2>

                        <h3
                            className={`font-poppins text-whiteMain ${
                                !data?.status && "hidden"
                            }`}
                        >
                            «{data?.status}»
                        </h3>
                    </div>
                </div>
                {/* Main Section (SideBar and Main) */}
                <div className="w-full flex mt-15 gap-20">
                    {/* SideBar */}
                    <ProfileSidebar
                        sideBarLink={sideBarLink}
                        setSideBarLink={setSideBarLink}
                    />
                    {/* Main Section */}
                    {data && <MainSection userData={data} />}
                </div>
            </div>
        </div>
    );
};

export default Profile;
