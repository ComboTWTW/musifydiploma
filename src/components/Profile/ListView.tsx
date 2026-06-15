import { useMemo, useState, useEffect } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { doc, updateDoc, setDoc, deleteDoc } from "firebase/firestore";

import { auth, db } from "../../config/firebase";
import type { UserT } from "../../functions/firebase/getUser";

interface Props {
    userData: UserT;
}

const ListView = ({ userData }: Props) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const listName = searchParams.get("listName");
    const show = searchParams.get("show");
    const profileId = searchParams.get("id"); // profile owner

    const isOwnProfile = auth.currentUser?.uid === profileId;

    const [localLists, setLocalLists] = useState(userData.lists);

    useEffect(() => {
        setLocalLists(userData.lists);
    }, [userData.lists]);

    const listId = searchParams.get("listId");

    const currentList = useMemo(() => {
        const list = localLists.find((list) => list.id === listId);

        if (!list) return null;

        if (!isOwnProfile && list.visibility !== "public") {
            return null;
        }

        return list;
    }, [localLists, listId, isOwnProfile]);

    const filteredItems = useMemo(() => {
        if (!currentList) return [];

        return currentList.items.filter((item) => {
            if (show === "artists") return item.mediaType === "artist";
            if (show === "albums") return item.mediaType === "album";
            if (show === "tracks") return item.mediaType === "track";
            return true;
        });
    }, [currentList, show]);

    const buildLink = (params: Record<string, string>) => {
        const idPart = profileId ? `&id=${profileId}` : "";
        const base = `/profile?section=listView${idPart}`;

        const extra = Object.entries(params)
            .map(([k, v]) => `&${k}=${encodeURIComponent(v)}`)
            .join("");

        return `${base}${extra}`;
    };

    const syncPublicList = async (updatedLists: typeof localLists) => {
        const user = auth.currentUser;
        if (!user) return;

        const updated = updatedLists.find((l) => l.name === listName);
        if (!updated) return;

        await setDoc(doc(db, "PublicLists", `${user.uid}_${updated.id}`), {
            id: updated.id,
            ownerUid: user.uid,
            ownerName: userData.name,
            name: updated.name,
            visibility: "public",
            items: updated.items,
            createdAt: new Date(),
        });
    };

    const removeItem = async (itemId: string) => {
        if (!isOwnProfile) return;

        const user = auth.currentUser;
        if (!user || !currentList) return;

        const updatedLists = localLists.map((list) => {
            if (list.id !== currentList.id) return list;

            return {
                ...list,
                items: list.items.filter((item) => item.id !== itemId),
            };
        });

        setLocalLists(updatedLists);

        await updateDoc(doc(db, "Users", user.uid), {
            lists: updatedLists,
        });

        if (currentList.visibility === "public") {
            await syncPublicList(updatedLists);
        }
    };

    const toggleVisibility = async () => {
        if (!isOwnProfile) return;

        const user = auth.currentUser;
        if (!user || !currentList) return;

        const newVisibility =
            currentList.visibility === "public" ? "private" : "public";

        const updatedLists = localLists.map((list) => {
            if (list.id !== currentList.id) return list;

            return {
                ...list,
                visibility: newVisibility,
            };
        });

        setLocalLists(updatedLists);

        await updateDoc(doc(db, "Users", user.uid), {
            lists: updatedLists,
        });

        const publicRef = doc(
            db,
            "PublicLists",
            `${user.uid}_${currentList.id}`,
        );

        if (newVisibility === "public") {
            await setDoc(publicRef, {
                id: currentList.id,
                ownerUid: user.uid,
                ownerName: userData.name,
                name: currentList.name,
                visibility: "public",
                items: currentList.items,
                createdAt: new Date(),
            });
        } else {
            await deleteDoc(publicRef);
        }
    };

    const deleteList = async () => {
        if (!isOwnProfile) return;

        const user = auth.currentUser;
        if (!user || !currentList) return;

        const confirmed = window.confirm(`Delete "${currentList.name}"?`);
        if (!confirmed) return;

        const updatedLists = localLists.filter(
            (list) => list.id !== currentList.id,
        );

        setLocalLists(updatedLists);

        await updateDoc(doc(db, "Users", user.uid), {
            lists: updatedLists,
        });

        if (currentList.visibility === "public") {
            await deleteDoc(
                doc(db, "PublicLists", `${user.uid}_${currentList.id}`),
            );
        }

        navigate(
            `/profile?section=myLists${profileId ? `&id=${profileId}` : ""}`,
        );
    };

    if (!currentList) {
        return (
            <div className="flex flex-col gap-3">
                <h2 className="font-poppins text-3xl text-whiteMain font-semibold">
                    List unavailable
                </h2>

                <p className="text-whiteMain/70 font-poppins">
                    This list is private or does not exist.
                </p>
            </div>
        );
    }
    return (
        <div className="flex flex-col gap-5 w-full">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h2 className="font-poppins text-4xl text-whiteMain font-semibold">
                    List «{listName}»
                </h2>

                {/* ONLY OWNER CONTROLS */}
                {isOwnProfile &&
                    currentList.name !== "Favorites" &&
                    currentList.name !== "Listen Later" && (
                        <div className="flex gap-5">
                            <div className="flex items-center gap-2">
                                <span className="text-whiteMain font-poppins">
                                    Visibility:
                                </span>

                                <button
                                    onClick={toggleVisibility}
                                    className={`px-4 py-2 rounded-lg font-poppins transition ${
                                        currentList.visibility === "public"
                                            ? "bg-green-600 text-white"
                                            : "bg-[#2A2A35] text-whiteMain"
                                    }`}
                                >
                                    {currentList.visibility}
                                </button>
                            </div>

                            <button
                                onClick={deleteList}
                                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-poppins"
                            >
                                Delete List
                            </button>
                        </div>
                    )}
            </div>

            {/* FILTERS */}
            <ul className="flex gap-10">
                {["artists", "albums", "tracks"].map((type) => (
                    <NavLink
                        key={type}
                        to={`${buildLink({
                            listName: listName || "",
                            show: type,
                        })}&listId=${listId}`}
                        className={`capitalize text-3xl font-poppins hover:text-purpleMain ${
                            show === type
                                ? "text-purpleMain underline underline-offset-8"
                                : "text-white"
                        }`}
                    >
                        <li>{type}</li>
                    </NavLink>
                ))}
            </ul>

            {/* LIST */}
            <ol className="flex flex-col gap-2 list-decimal list-inside">
                {filteredItems.map((item) => (
                    <li
                        key={item.id}
                        className="group text-white font-poppins font-semibold"
                    >
                        <div className="flex items-center justify-between rounded-lg hover:bg-[#2A2A35] transition p-2">
                            <NavLink
                                to={
                                    item.mediaType === "artist"
                                        ? `/artist?id=&name=${item.name}`
                                        : item.mediaType === "album"
                                          ? `/album?id=&artist=${item.artistName}&album=${item.name}`
                                          : `/track?id=&artist=${item.artistName}&name=${item.name}`
                                }
                                className="flex items-center gap-4 flex-1"
                            >
                                <img
                                    src={item.imageUrl}
                                    className="w-14 h-14 object-cover rounded"
                                />

                                <div className="text-whiteMain font-poppins">
                                    {item.mediaType === "artist" && item.name}
                                    {item.mediaType === "album" &&
                                        `${item.name} by ${item.artistName}`}
                                    {item.mediaType === "track" &&
                                        `${item.artistName} — ${item.name}`}
                                </div>
                            </NavLink>

                            {/* ONLY OWNER CAN REMOVE */}
                            {isOwnProfile && (
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="opacity-0 group-hover:opacity-100 text-red-500 px-3"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default ListView;
