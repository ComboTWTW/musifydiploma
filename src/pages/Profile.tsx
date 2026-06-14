import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { auth } from "../config/firebase";
import { getUser } from "../functions/firebase/getUser";

import ProfileSidebar from "../components/Profile/ProfileSidebar";
import MainSection from "../components/Profile/MainSection";

import { useState } from "react";

const Profile = () => {
    const [searchParams] = useSearchParams();

    const profileId = searchParams.get("id");
    const currentUser = auth.currentUser;

    const isOwnProfile = profileId === currentUser?.uid;

    const [sideBarLink, setSideBarLink] = useState("overview");

    const { data, isLoading, error } = useQuery({
        queryKey: ["user", profileId],
        queryFn: () => getUser(profileId!),
        enabled: !!profileId,
    });

    if (isLoading) {
        return (
            <div className="text-whiteMain mt-20 text-center">
                Loading profile...
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-whiteMain mt-20 text-center">
                User not found
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col items-center">
            <div className="w-full flex flex-col items-center mt-20">
                {/* TOP SECTION */}
                <div className="flex w-full gap-10 items-center">
                    {/* PROFILE IMAGE */}
                    <img
                        src={
                            data.photoURL?.startsWith(
                                "https://lh3.googleusercontent.com",
                            )
                                ? `${data.photoURL.slice(0, -5)}s300-c`
                                : data.photoURL || ""
                        }
                        alt="Profile"
                        className="max-w-[155px] rounded-full"
                    />

                    {/* NAME + STATUS */}
                    <div className="flex flex-col gap-3">
                        <h2 className="font-poppins text-4xl font-semibold text-whiteMain">
                            {data.name}
                        </h2>

                        {data.status && (
                            <h3 className="font-poppins text-whiteMain">
                                «{data.status}»
                            </h3>
                        )}

                        {/* OPTIONAL FOLLOW BUTTON */}
                        {!isOwnProfile && (
                            <button className="bg-purpleMain text-white px-4 py-2 rounded-lg w-fit">
                                Follow
                            </button>
                        )}
                    </div>
                </div>

                {/* MAIN SECTION */}
                <div className="w-full flex mt-15 gap-20">
                    {/* SIDEBAR ONLY FOR OWN PROFILE */}
                    {isOwnProfile && (
                        <ProfileSidebar
                            sideBarLink={sideBarLink}
                            setSideBarLink={setSideBarLink}
                        />
                    )}

                    <MainSection userData={data} isOwnProfile={isOwnProfile} />
                </div>
            </div>
        </div>
    );
};

export default Profile;
