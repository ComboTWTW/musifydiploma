import { useEffect, useState } from "react";

import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import FormatListBulletedAddIcon from "@mui/icons-material/FormatListBulletedAdd";

import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";

import { auth, db } from "../config/firebase";

interface Props {
    mediaType: "artist" | "album" | "track";
    name: string;
    lastfmId: string;
    imageUrl: string;
    artistName?: string;
}

interface UserList {
    id: string;
    name: string;
    visibility: "public" | "private";
    items: any[];
}

const MediaActions = ({
    mediaType,
    name,
    lastfmId,
    imageUrl,
    artistName,
}: Props) => {
    const [lists, setLists] = useState<UserList[]>([]);
    const [open, setOpen] = useState(false);
    const [newListName, setNewListName] = useState("");
    const [showInput, setShowInput] = useState(false);

    const [favoriteAdded, setFavoriteAdded] = useState(false);
    const [listenLaterAdded, setListenLaterAdded] = useState(false);

    const mediaItem = {
        id: crypto.randomUUID(),
        mediaType,
        name,
        lastfmId,
        imageUrl,
        ...(mediaType !== "artist" && artistName ? { artistName } : {}),
        createdAt: Timestamp.now(),
    };

    useEffect(() => {
        loadLists();
    }, []);

    const addActivity = async (
        actionType: "add" | "remove" | "create_list",
        listName: string,
        item: any,
    ) => {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(db, "Users", user.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) return;

        const data = snap.data();
        const prev = data.activity || [];

        const activityItem = {
            id: crypto.randomUUID(),
            createdAt: Timestamp.now(),
            actionType,
            listName,
            data: item, // 👈 FULL MEDIA OBJECT HERE
        };

        await updateDoc(userRef, {
            activity: [activityItem, ...prev],
        });
    };

    const loadLists = async () => {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(db, "Users", user.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) return;

        const data = snap.data();
        const userLists = data.lists || [];

        setLists(userLists);

        const favorites = userLists.find(
            (l: UserList) => l.name === "Favorites",
        );
        const listenLater = userLists.find(
            (l: UserList) => l.name === "Listen Later",
        );

        setFavoriteAdded(
            !!favorites?.items?.some((i: any) => i.lastfmId === lastfmId),
        );

        setListenLaterAdded(
            !!listenLater?.items?.some((i: any) => i.lastfmId === lastfmId),
        );
    };

    const toggleInList = async (listId: string) => {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(db, "Users", user.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) return;

        const data = snap.data();
        const currentLists: UserList[] = data.lists || [];

        let actionType: "add" | "remove" = "add";
        let listName = "";

        const updatedLists = currentLists.map((list) => {
            if (list.id !== listId) return list;

            listName = list.name;

            const exists = list.items?.some(
                (item: any) => item.lastfmId === lastfmId,
            );

            if (exists) {
                actionType = "remove";

                return {
                    ...list,
                    items: list.items.filter(
                        (item: any) => item.lastfmId !== lastfmId,
                    ),
                };
            }

            actionType = "add";

            return {
                ...list,
                items: [...(list.items || []), mediaItem],
            };
        });

        await updateDoc(userRef, {
            lists: updatedLists,
        });

        setLists(updatedLists);

        await addActivity(actionType, listName, mediaItem);

        await loadLists();
    };

    const createNewList = async () => {
        if (!newListName.trim()) return;

        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(db, "Users", user.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) return;

        const data = snap.data();
        const currentLists: UserList[] = data.lists || [];

        const newList: UserList = {
            id: crypto.randomUUID(),
            name: newListName,
            visibility: "private",
            items: [mediaItem],
        };

        const updatedLists = [...currentLists, newList];

        await updateDoc(userRef, {
            lists: updatedLists,
        });

        setLists(updatedLists);

        await addActivity("create_list", newListName, mediaItem);

        setNewListName("");
        setShowInput(false);

        await loadLists();
    };

    const quickAdd = async (targetName: string) => {
        const target = lists.find((l) => l.name === targetName);
        if (!target) return;

        await toggleInList(target.id);
    };

    return (
        <>
            <div className="flex items-center gap-5">
                <button onClick={() => quickAdd("Favorites")}>
                    <FavoriteIcon
                        sx={{
                            fontSize: 34,
                            color: favoriteAdded ? "#8B5CF6" : "#E6E6EB",
                        }}
                    />
                </button>

                <button onClick={() => quickAdd("Listen Later")}>
                    <BookmarkIcon
                        sx={{
                            fontSize: 34,
                            color: listenLaterAdded ? "#8B5CF6" : "#E6E6EB",
                        }}
                    />
                </button>

                <button onClick={() => setOpen(true)}>
                    <FormatListBulletedAddIcon
                        sx={{
                            fontSize: 36,
                            color: "#E6E6EB",
                        }}
                    />
                </button>
            </div>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Add to List</DialogTitle>

                <DialogContent>
                    <div className="flex flex-col gap-2 mt-2">
                        {lists.map((list) => {
                            const checked = list.items?.some(
                                (item: any) => item.lastfmId === lastfmId,
                            );

                            return (
                                <div
                                    key={list.id}
                                    className="flex justify-between items-center bg-[#2A2A35] px-3 py-2 rounded-lg"
                                >
                                    <span>{list.name}</span>

                                    <Checkbox
                                        checked={checked}
                                        onChange={() => toggleInList(list.id)}
                                    />
                                </div>
                            );
                        })}

                        {!showInput ? (
                            <Button onClick={() => setShowInput(true)}>
                                + Create New List
                            </Button>
                        ) : (
                            <>
                                <TextField
                                    value={newListName}
                                    onChange={(e) =>
                                        setNewListName(e.target.value)
                                    }
                                    placeholder="List name..."
                                    fullWidth
                                />

                                <Button
                                    variant="contained"
                                    onClick={createNewList}
                                >
                                    Create
                                </Button>
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default MediaActions;
