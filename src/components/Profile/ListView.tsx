import { useMemo, useState } from "react";
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

    const syncPublicList = async (updatedLists: any[]) => {
        const user = auth.currentUser;

        if (!user || !currentList) return;

        const updatedCurrentList = updatedLists.find(
            (list) => list.id === currentList.id,
        );

        if (!updatedCurrentList) return;

        await setDoc(
            doc(db, "PublicLists", `${user.uid}_${updatedCurrentList.id}`),
            {
                id: updatedCurrentList.id,
                ownerUid: user.uid,
                ownerName: userData.name,

                name: updatedCurrentList.name,
                visibility: "public",

                items: updatedCurrentList.items,

                createdAt: new Date(),
            },
        );
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

        try {
            await updateDoc(doc(db, "Users", user.uid), {
                lists: updatedLists,
            });

            if (currentList.visibility === "public") {
                await syncPublicList(updatedLists);
            }

            setLocalLists(updatedLists);
        } catch (error) {
            console.error(error);
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

        try {
            await updateDoc(doc(db, "Users", user.uid), {
                lists: updatedLists,
            });

            const publicListRef = doc(
                db,
                "PublicLists",
                `${user.uid}_${currentList.id}`,
            );

            if (newVisibility === "public") {
                await setDoc(publicListRef, {
                    id: currentList.id,

                    ownerUid: user.uid,
                    ownerName: userData.name,

                    name: currentList.name,
                    visibility: "public",

                    items: currentList.items,

                    createdAt: new Date(),
                });
            } else {
                await deleteDoc(publicListRef);
            }

            setLocalLists(updatedLists);
        } catch (error) {
            console.error(error);
        }
    };

    const deleteList = async () => {
        const user = auth.currentUser;

        if (!user || !currentList) return;

        const confirmed = window.confirm(`Delete "${currentList.name}"?`);

        if (!confirmed) return;

        try {
            const updatedLists = localLists.filter(
                (list) => list.id !== currentList.id,
            );

            await updateDoc(doc(db, "Users", user.uid), {
                lists: updatedLists,
            });

            if (currentList.visibility === "public") {
                await deleteDoc(
                    doc(db, "PublicLists", `${user.uid}_${currentList.id}`),
                );
            }

            navigate("/profile");
        } catch (error) {
            console.error(error);
        }
    };

    if (!currentList) {
        return <p className="text-whiteMain">List not found.</p>;
    }

    return (
        <div className="flex flex-col gap-5 w-full">
            <div className="flex justify-between items-center">
                <h2 className="font-poppins text-4xl leading-[120%] text-whiteMain font-semibold">
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
                                    className={`px-4 py-2 rounded-lg font-poppins transition
                                ${
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
                                className="
                                bg-red-600
                                hover:bg-red-500
                                text-white
                                px-4
                                py-2
                                rounded-lg
                                font-poppins
                                w-fit
                            "
                            >
                                Delete List
                            </button>
                        </div>
                    )}
            </div>

            <ul className="flex gap-10">
                <NavLink
                    to={`/profile?section=listView&listName=${listName}&show=artists`}
                    className={`capitalize text-3xl font-poppins hover:text-purpleMain ${
                        show === "artists"
                            ? "text-purpleMain underline underline-offset-8"
                            : "text-white"
                    }`}
                >
                    <li>artists</li>
                </NavLink>

                <NavLink
                    to={`/profile?section=listView&listName=${listName}&show=albums`}
                    className={`capitalize text-3xl font-poppins hover:text-purpleMain ${
                        show === "albums"
                            ? "text-purpleMain underline underline-offset-8"
                            : "text-white"
                    }`}
                >
                    <li>albums</li>
                </NavLink>

                <NavLink
                    to={`/profile?section=listView&listName=${listName}&show=tracks`}
                    className={`capitalize text-3xl font-poppins hover:text-purpleMain ${
                        show === "tracks"
                            ? "text-purpleMain underline underline-offset-8"
                            : "text-white"
                    }`}
                >
                    <li>tracks</li>
                </NavLink>
            </ul>

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
                                          ? `/album?artist=${item.artistName}&album=${item.name}`
                                          : `/track?id=${item.lastfmId}`
                                }
                                reloadDocument
                                className="flex items-center gap-4 flex-1"
                            >
                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="w-14 h-14 object-cover rounded"
                                />

                                <div className="text-whiteMain font-poppins">
                                    {item.mediaType === "artist" && (
                                        <span>{item.name}</span>
                                    )}

                                    {item.mediaType === "album" && (
                                        <span>
                                            {item.name} by {item.artistName}
                                        </span>
                                    )}

                                    {item.mediaType === "track" && (
                                        <span>
                                            {item.artistName} — {item.name}
                                        </span>
                                    )}
                                </div>
                            </NavLink>

                            <button
                                onClick={() => removeItem(item.id)}
                                className="
                                    opacity-0
                                    group-hover:opacity-100
                                    transition
                                    text-red-500
                                    hover:text-red-400
                                    text-xl
                                    px-3
                                "
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
