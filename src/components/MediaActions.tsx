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

    const addActivity = async (listName: string, item: any) => {
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
            listName,
            data: item,
        };

        await updateDoc(userRef, {
            activity: [activityItem, ...prev].slice(0, 200),
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

        setFavoriteAdded(!!favorites?.items?.some(isSameMedia));

        setListenLaterAdded(!!listenLater?.items?.some(isSameMedia));
    };

    const isSameMedia = (item: any) => {
        return (
            item.mediaType === mediaType &&
            item.name === name &&
            (item.artistName || "") === (artistName || "")
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

        let wasAdded = false;
        let targetListName = "";

        const updatedLists = currentLists.map((list) => {
            if (list.id !== listId) return list;

            targetListName = list.name;

            const exists = list.items?.some(isSameMedia);

            if (exists) {
                return {
                    ...list,
                    items: list.items.filter((item: any) => !isSameMedia(item)),
                };
            }

            wasAdded = true;

            return {
                ...list,
                items: [...(list.items || []), mediaItem],
            };
        });

        await updateDoc(userRef, {
            lists: updatedLists,
        });

        setLists(updatedLists);

        const favorites = updatedLists.find((l) => l.name === "Favorites");

        const listenLater = updatedLists.find((l) => l.name === "Listen Later");

        setFavoriteAdded(!!favorites?.items?.some(isSameMedia));

        setListenLaterAdded(!!listenLater?.items?.some(isSameMedia));

        // history only for additions
        if (wasAdded) {
            await addActivity(targetListName, mediaItem);
        }
    };

    const createNewList = async () => {
        const trimmed = newListName.trim();

        if (!trimmed) return;

        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(db, "Users", user.uid);
        const snap = await getDoc(userRef);

        if (!snap.exists()) return;

        const data = snap.data();
        const currentLists: UserList[] = data.lists || [];

        const exists = currentLists.some(
            (list) => list.name.toLowerCase() === trimmed.toLowerCase(),
        );

        if (exists) {
            alert("List already exists.");
            return;
        }

        const newList: UserList = {
            id: crypto.randomUUID(),
            name: trimmed,
            visibility: "private",
            items: [mediaItem],
        };

        const updatedLists = [...currentLists, newList];

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

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{
                    sx: {
                        backgroundColor: "#2A2A35",
                        border: "1px solid #0f0f14",
                        borderRadius: "12px",
                        minWidth: "360px",
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        color: "#E6E6EB",
                        backgroundColor: "#1F1F27",
                        fontFamily: "Poppins",
                        fontWeight: 600,
                        borderBottom: "1px solid #0f0f14",
                    }}
                >
                    Add to List
                </DialogTitle>

                <DialogContent
                    sx={{
                        backgroundColor: "#1F1F27",
                        paddingTop: "12px",
                    }}
                >
                    <div className="flex flex-col gap-2 mt-2">
                        {lists
                            .filter(
                                (list) =>
                                    list.name !== "Favorites" &&
                                    list.name !== "Listen Later",
                            )
                            .map((list) => {
                                const checked = list.items?.some(isSameMedia);

                                return (
                                    <div
                                        key={list.id}
                                        className="flex justify-between items-center px-3 py-2 rounded-lg"
                                        style={{
                                            backgroundColor: "#0f0f14",
                                            border: "1px solid #0f0f14",
                                        }}
                                    >
                                        <span
                                            style={{
                                                color: "#E6E6EB",
                                                fontFamily: "Poppins",
                                            }}
                                        >
                                            {list.name}
                                        </span>

                                        <Checkbox
                                            checked={checked}
                                            onChange={() =>
                                                toggleInList(list.id)
                                            }
                                            sx={{
                                                color: "#E6E6EB",
                                                "&.Mui-checked": {
                                                    color: "#7C5CFF",
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
                                    color: "#7C5CFF",
                                    fontFamily: "Poppins",
                                    textTransform: "none",
                                    justifyContent: "flex-start",
                                    paddingLeft: 0,
                                    "&:hover": {
                                        backgroundColor: "transparent",
                                        opacity: 0.8,
                                    },
                                }}
                            >
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
                                    sx={{
                                        input: {
                                            color: "#E6E6EB",
                                            fontFamily: "Poppins",
                                        },
                                        "& .MuiOutlinedInput-root": {
                                            "& fieldset": {
                                                borderColor: "#0f0f14",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: "#7C5CFF",
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "#7C5CFF",
                                            },
                                            backgroundColor: "#1F1F27",
                                        },
                                    }}
                                />

                                <Button
                                    variant="contained"
                                    onClick={createNewList}
                                    sx={{
                                        backgroundColor: "#7C5CFF",
                                        fontFamily: "Poppins",
                                        textTransform: "none",
                                        marginTop: "8px",
                                        "&:hover": {
                                            backgroundColor: "#6a4df0",
                                        },
                                    }}
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
