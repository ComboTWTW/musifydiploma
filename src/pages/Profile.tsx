import { useQuery, useQueryClient } from "@tanstack/react-query";
import { NavLink, useSearchParams } from "react-router-dom";
import { auth, db } from "../config/firebase";
import { getUser } from "../functions/firebase/getUser";
import ProfileSidebar from "../components/Profile/ProfileSidebar";
import MainSection from "../components/Profile/MainSection";
import { useEffect, useMemo, useState } from "react";
import {
    doc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    getDoc,
} from "firebase/firestore";

const Profile = () => {
    const [searchParams] = useSearchParams();
    const profileId = searchParams.get("id");

    const currentUser = auth.currentUser;
    const queryClient = useQueryClient();

    const isOwnProfile = profileId === currentUser?.uid;

    const [sideBarLink, setSideBarLink] = useState("overview");

    const { data, isLoading } = useQuery({
        queryKey: ["user", profileId],
        queryFn: () => getUser(profileId!),
        enabled: !!profileId,
    });

    // 🔥 LOCAL STATE (this fixes your UI bug)
    const [followers, setFollowers] = useState<string[]>([]);

    // sync when data loads / changes
    useEffect(() => {
        if (data?.followers) {
            setFollowers(data.followers);
        }
    }, [data]);

    // 🔥 correct reactive follow check
    const isFollowing = useMemo(() => {
        return followers.includes(currentUser?.uid || "");
    }, [followers, currentUser]);

    const handleFollow = async () => {
        if (!currentUser || !data) return;

        const currentUserRef = doc(db, "Users", currentUser.uid);
        const targetUserRef = doc(db, "Users", data.id);

        const currentUserSnap = await getDoc(currentUserRef);
        const currentUserData = currentUserSnap.data();

        const alreadyFollowing = currentUserData?.following?.includes(data.id);

        try {
            if (alreadyFollowing) {
                // ❌ UNFOLLOW
                await updateDoc(currentUserRef, {
                    following: arrayRemove(data.id),
                });

                await updateDoc(targetUserRef, {
                    followers: arrayRemove(currentUser.uid),
                });

                // 🔥 instant UI update
                setFollowers((prev) =>
                    prev.filter((id) => id !== currentUser.uid),
                );
            } else {
                // ✅ FOLLOW
                await updateDoc(currentUserRef, {
                    following: arrayUnion(data.id),
                });

                await updateDoc(targetUserRef, {
                    followers: arrayUnion(currentUser.uid),
                });

                // 🔥 instant UI update
                setFollowers((prev) => [...prev, currentUser.uid]);
            }

            // optional: refresh cached users
            queryClient.invalidateQueries({
                queryKey: ["user", profileId],
            });
        } catch (err) {
            console.error(err);
        }
    };

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
                    <NavLink
                        to={`/profile?section=overview&id=${profileId}`}
                        reloadDocument
                    >
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
                    </NavLink>

                    <div className="flex flex-col gap-3">
                        <h2 className="font-poppins text-4xl font-semibold text-whiteMain">
                            {data.name}
                        </h2>

                        {data.status && (
                            <h3 className="font-poppins text-whiteMain">
                                «{data.status}»
                            </h3>
                        )}

                        {/* FOLLOW BUTTON */}
                        {!isOwnProfile && (
                            <button
                                onClick={handleFollow}
                                className={`px-4 py-2 rounded-lg w-fit text-white transition ${
                                    isFollowing
                                        ? "bg-gray-600"
                                        : "bg-purpleMain"
                                }`}
                            >
                                {isFollowing ? "Unfollow" : "Follow"}
                            </button>
                        )}
                    </div>
                </div>

                {/* MAIN */}
                <div className="w-full flex mt-15 gap-20">
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
