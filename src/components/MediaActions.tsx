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

import {
    arrayUnion,
    doc,
    getDoc,
    updateDoc,
    collection,
    addDoc,
    Timestamp,
} from "firebase/firestore";

import { auth, db } from "../config/firebase";

interface Props {
    mediaType: "artist" | "album" | "track";
    name: string;
    lastfmId: string;
    imageUrl: string;
}

interface UserList {
    id: string;
    name: string;
    visibility: "public" | "private";
    items: any[];
}

const MediaActions = ({ mediaType, name, lastfmId, imageUrl }: Props) => {
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
        createdAt: Timestamp.now(),
    };

    useEffect(() => {
        loadLists();
    }, []);

    const loadLists = async () => {
        const user = auth.currentUser;

        if (!user) return;

        const userRef = doc(db, "Users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) return;

        const data = userSnap.data();

        const userLists = data.lists || [];

        setLists(userLists);

        // check if already added
        const favorites = userLists.find(
            (list: UserList) => list.name === "Favorites",
        );

        const listenLater = userLists.find(
            (list: UserList) => list.name === "Listen Later",
        );

        if (favorites?.items?.some((item: any) => item.lastfmId === lastfmId)) {
            setFavoriteAdded(true);
        }

        if (
            listenLater?.items?.some((item: any) => item.lastfmId === lastfmId)
        ) {
            setListenLaterAdded(true);
        }
    };

    const toggleInList = async (listId: string) => {
        const user = auth.currentUser;

        if (!user) return;

        const userRef = doc(db, "Users", user.uid);

        const updatedLists = lists.map((list) => {
            if (list.id !== listId) return list;

            const alreadyExists = list.items?.some(
                (item) => item.lastfmId === lastfmId,
            );

            if (alreadyExists) {
                return {
                    ...list,
                    items: list.items.filter(
                        (item) => item.lastfmId !== lastfmId,
                    ),
                };
            }

            return {
                ...list,
                items: [...(list.items || []), mediaItem],
            };
        });

        setLists(updatedLists);

        await updateDoc(userRef, {
            lists: updatedLists,
        });

        loadLists();
    };

    const createNewList = async () => {
        if (!newListName.trim()) return;

        const user = auth.currentUser;

        if (!user) return;

        const userRef = doc(db, "Users", user.uid);

        const newList = {
            id: crypto.randomUUID(),
            name: newListName,
            visibility: "private",
            items: [mediaItem],
        };

        const updatedLists = [...lists, newList];

        await updateDoc(userRef, {
            lists: updatedLists,
        });

        setLists(updatedLists);

        setNewListName("");
        setShowInput(false);
    };

    const quickAdd = async (targetName: string) => {
        const target = lists.find((l) => l.name === targetName);

        if (!target) return;

        await toggleInList(target.id);
    };

    return (
        <>
            <div className="flex items-center gap-5">
                {/* FAVORITES */}
                <button
                    onClick={() => quickAdd("Favorites")}
                    className="transition hover:scale-110"
                >
                    <FavoriteIcon
                        sx={{
                            fontSize: 34,
                            color: favoriteAdded ? "#8B5CF6" : "#E6E6EB",
                        }}
                    />
                </button>

                {/* LISTEN LATER */}
                <button
                    onClick={() => quickAdd("Listen Later")}
                    className="transition hover:scale-110"
                >
                    <BookmarkIcon
                        sx={{
                            fontSize: 34,
                            color: listenLaterAdded ? "#8B5CF6" : "#E6E6EB",
                        }}
                    />
                </button>

                {/* OPEN LISTS */}
                <button
                    onClick={() => setOpen(true)}
                    className="transition hover:scale-110"
                >
                    <FormatListBulletedAddIcon
                        sx={{
                            fontSize: 36,
                            color: "#E6E6EB",
                        }}
                    />
                </button>
            </div>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{
                    sx: {
                        backgroundColor: "#1E1E26",
                        color: "#E6E6EB",
                        minWidth: "350px",
                        borderRadius: "12px",
                    },
                }}
            >
                <DialogTitle
                    className="bg-bgMain text-whiteMain"
                    sx={{
                        fontFamily: "Poppins",
                        fontWeight: 600,
                    }}
                >
                    Add to List
                </DialogTitle>

                <DialogContent className="bg-bgMain text-whiteMain">
                    <div className="flex flex-col gap-2 mt-2">
                        {lists.map((list) => {
                            const checked = list.items?.some(
                                (item) => item.lastfmId === lastfmId,
                            );

                            return (
                                <div
                                    key={list.id}
                                    className="flex items-center justify-between bg-[#2A2A35] rounded-lg px-3 py-2"
                                >
                                    <span className="font-poppins text-sm">
                                        {list.name}
                                    </span>

                                    <Checkbox
                                        checked={checked}
                                        onChange={() => toggleInList(list.id)}
                                        sx={{
                                            color: "#8B5CF6",
                                            "&.Mui-checked": {
                                                color: "#8B5CF6",
                                            },
                                        }}
                                    />
                                </div>
                            );
                        })}

                        {!showInput ? (
                            <Button
                                onClick={() => setShowInput(true)}
                                sx={{
                                    mt: 1,
                                    color: "#8B5CF6",
                                    textTransform: "none",
                                }}
                            >
                                + Create New List
                            </Button>
                        ) : (
                            <div className="flex flex-col gap-2 mt-2">
                                <TextField
                                    size="small"
                                    value={newListName}
                                    onChange={(e) =>
                                        setNewListName(e.target.value)
                                    }
                                    placeholder="List name..."
                                    fullWidth
                                    sx={{
                                        input: {
                                            color: "#E6E6EB",
                                        },
                                    }}
                                />

                                <Button
                                    variant="contained"
                                    onClick={createNewList}
                                    sx={{
                                        backgroundColor: "#8B5CF6",
                                        textTransform: "none",
                                    }}
                                >
                                    Create
                                </Button>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default MediaActions;
