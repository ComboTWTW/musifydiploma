import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { auth } from "../config/firebase";
import MyLists from "../components/Profile/MyLists";
import { useQuery } from "@tanstack/react-query";
import { getUser, type UserT } from "../functions/firebase/getUser";
import { useEffect } from "react";

const Profile = () => {
    const user = auth.currentUser;

    const handleLogout = async () => {
        try {
            await signOut(auth);
            window.location.href = "/";
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const { data, isLoading, error } = useQuery({
        queryKey: ["user", user?.uid],
        queryFn: () => getUser(user!.uid),
        enabled: !!user?.uid,
    });

    return (
        <div className="w-full flex flex-col items-center">
            <div className="w-full flex flex-col items-center mt-20">
                {/* Top Section */}
                <div className="flex w-full gap-10">
                    {/* Pfp */}
                    <img
                        src={`${`${user?.photoURL}`.slice(0, -5)}s300-c`}
                        alt="Profile Picture"
                        className="max-w-[155px] rounded-full"
                    />
                    {/* UserName */}
                    <div className="flex flex-col gap-3">
                        <h2 className="font-poppins text-4xl font-semibold leading-[120%] text-whiteMain">
                            {user?.displayName}
                        </h2>
                        {/* Status */}
                        <h3 className="font-poppins text-whiteMain">
                            «Eesti, Eesti, Eesti on my mind!»
                        </h3>
                    </div>
                </div>
                {/* Main Section (SideBar and Main) */}
                <div className="w-full flex mt-10">
                    {data && <MyLists userData={data} />}
                </div>
                <button
                    onClick={handleLogout}
                    className="border-red-700 max-w-[175px] mt-10 border bg-transparent cursor-pointer rounded-[10px] text-whiteMain font-inter font-light py-3 px-9"
                >
                    Log out
                </button>
            </div>
        </div>
    );
};

export default Profile;
