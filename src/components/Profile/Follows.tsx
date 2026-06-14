import { useEffect, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { auth, db } from "../../config/firebase";

interface Props {
    userId: string;
    followType: "following" | "followers";
}

interface MiniUser {
    id: string;
    name: string;
    photoURL: string;
}

const Follows = ({ userId, followType }: Props) => {
    const [searchParams] = useSearchParams();
    const sectionParam = searchParams.get("section");

    const [users, setUsers] = useState<MiniUser[]>([]);
    const [loading, setLoading] = useState(true);

    const currentUser = auth.currentUser;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);

                const userRef = doc(db, "Users", userId);
                const snap = await getDoc(userRef);

                if (!snap.exists()) return;

                const data = snap.data();

                const ids: string[] =
                    followType === "followers"
                        ? data.followers || []
                        : data.following || [];

                const results = await Promise.all(
                    ids.map(async (id) => {
                        const userSnap = await getDoc(doc(db, "Users", id));

                        if (!userSnap.exists()) return null;

                        const u = userSnap.data();

                        return {
                            id,
                            name: u.name,
                            photoURL: u.photoURL,
                        } as MiniUser;
                    }),
                );

                setUsers(results.filter(Boolean) as MiniUser[]);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchUsers();
    }, [userId, followType]);

    // 👇 LIMIT FOR OVERVIEW
    const displayedUsers =
        sectionParam === "overview" ? users.slice(0, 5) : users;

    const handleUnfollow = async (targetId: string) => {
        if (!currentUser) return;

        try {
            const currentRef = doc(db, "Users", currentUser.uid);
            const targetRef = doc(db, "Users", targetId);

            // remove from current user following
            if (followType === "following") {
                await updateDoc(currentRef, {
                    following: arrayRemove(targetId),
                });

                await updateDoc(targetRef, {
                    followers: arrayRemove(currentUser.uid),
                });

                setUsers((prev) => prev.filter((u) => u.id !== targetId));
            }

            // remove follower (optional UX: only works if YOU own profile)
            if (followType === "followers" && userId === currentUser.uid) {
                await updateDoc(currentRef, {
                    followers: arrayRemove(targetId),
                });

                setUsers((prev) => prev.filter((u) => u.id !== targetId));
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col gap-5">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h2 className="font-poppins text-4xl text-whiteMain font-semibold">
                    {followType === "followers" ? "Followers" : "Following"}
                </h2>
            </div>

            {/* LIST */}
            {loading ? (
                <p className="text-whiteMain">Loading...</p>
            ) : displayedUsers.length === 0 ? (
                <p className="text-whiteMain opacity-70">
                    No {followType} yet.
                </p>
            ) : (
                <ul className="flex flex-col gap-4">
                    {displayedUsers.map((user) => (
                        <li
                            key={user.id}
                            className="group flex items-center justify-between p-3 rounded-lg hover:bg-[#2A2A35] transition"
                        >
                            <NavLink
                                to={`/profile?section=overview&id=${user.id}`}
                                className="flex items-center gap-4"
                                reloadDocument
                            >
                                <img
                                    src={user.photoURL}
                                    alt={user.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />

                                <span className="text-whiteMain font-poppins text-lg">
                                    {user.name}
                                </span>
                            </NavLink>

                            {/* 👇 UNFOLLOW BUTTON (hover only) */}
                            {currentUser?.uid !== user.id && (
                                <button
                                    onClick={() => handleUnfollow(user.id)}
                                    className="
                                        opacity-0 group-hover:opacity-100
                                        transition
                                        text-red-500
                                        hover:text-red-400
                                        font-poppins text-sm
                                    "
                                >
                                    Unfollow
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {/* FOOTER */}
            <NavLink
                to={`/profile?section=${followType}&id=${userId}`}
                className="mt-5 font-poppins font-medium text-xl underline text-whiteMain text-end"
            >
                View All{" "}
                {followType === "followers" ? "Followers" : "Following"} {" > "}
            </NavLink>
        </div>
    );
};

export default Follows;
