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

    const [localLists, setLocalLists] = useState(userData.lists);

    // 🔁 keep in sync if parent updates
    useEffect(() => {
        setLocalLists(userData.lists);
    }, [userData.lists]);

    const currentList = useMemo(() => {
        return localLists.find((list) => list.name === listName);
    }, [localLists, listName]);

    const filteredItems = useMemo(() => {
        if (!currentList) return [];

        return currentList.items.filter((item) => {
            if (show === "artists") return item.mediaType === "artist";
            if (show === "albums") return item.mediaType === "album";
            if (show === "tracks") return item.mediaType === "track";
            return true;
        });
    }, [currentList, show]);

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

        navigate("/profile?section=myLists");
    };

    if (!currentList) {
        return <p className="text-whiteMain">List not found.</p>;
    }

    return (
        <div className="flex flex-col gap-5 w-full">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h2 className="font-poppins text-4xl text-whiteMain font-semibold">
                    List «{listName}»
                </h2>

                {currentList.name !== "Favorites" &&
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
                        to={`/profile?section=listView&listName=${listName}&show=${type}`}
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
                                        ? `/artist?id=${item.lastfmId}`
                                        : item.mediaType === "album"
                                          ? `/album?id=${item.lastfmId}`
                                          : `/track?id=${item.lastfmId}`
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

                            <button
                                onClick={() => removeItem(item.id)}
                                className="opacity-0 group-hover:opacity-100 text-red-500 px-3"
                            >
                                ✕
                            </button>
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default ListView;
