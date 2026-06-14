import { useEffect, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import {
    collection,
    addDoc,
    serverTimestamp,
    query,
    where,
    onSnapshot,
    deleteDoc,
    doc,
    getDoc,
} from "firebase/firestore";

import { auth, db } from "../../config/firebase";

interface Comment {
    id: string;
    text: string;
    userId: string;
    userName: string;
    userPhoto: string;
    createdAt: any;
}

const Comments = () => {
    const [searchParams] = useSearchParams();

    const [text, setText] = useState("");
    const [sending, setSending] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);

    const user = auth.currentUser;

    const section = searchParams.get("section");
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const artist = searchParams.get("artist");
    const album = searchParams.get("album");

    const getTarget = () => {
        if (
            section === "overview" ||
            section === "followers" ||
            section === "following"
        ) {
            return {
                type: "profile",
                targetId: id,
            };
        }

        if (artist && name && !album) {
            return {
                type: "track",
                targetId: `${artist}-${name}`,
            };
        }

        if (artist && album) {
            return {
                type: "album",
                targetId: `${artist}-${album}`,
            };
        }

        if (name && !artist && !album) {
            return {
                type: "artist",
                targetId: name,
            };
        }

        return null;
    };

    const target = getTarget();

    useEffect(() => {
        if (!target) return;

        const q = query(
            collection(db, "Comments"),
            where("targetType", "==", target.type),
            where("targetId", "==", target.targetId),
        );

        const unsub = onSnapshot(q, (snap) => {
            const data: Comment[] = snap.docs.map((d) => ({
                id: d.id,
                ...(d.data() as Omit<Comment, "id">),
            }));

            data.sort((a, b) => {
                const aTime = a.createdAt?.seconds || 0;
                const bTime = b.createdAt?.seconds || 0;
                return bTime - aTime;
            });

            setComments(data);
        });

        return () => unsub();
    }, [target?.targetId, target?.type]);

    // SEND COMMENT (FIXED: uses Firestore user name)
    const handleSend = async () => {
        if (!user || !text.trim() || !target) return;

        setSending(true);

        try {
            const userSnap = await getDoc(doc(db, "Users", user.uid));

            const userData = userSnap.exists() ? userSnap.data() : null;

            await addDoc(collection(db, "Comments"), {
                text: text.trim(),

                userId: user.uid,
                userName: userData?.name || "Unknown",
                userPhoto: userData?.photoURL || "",

                targetType: target.type,
                targetId: target.targetId,

                createdAt: serverTimestamp(),
            });

            setText("");
        } catch (err) {
            console.error(err);
        } finally {
            setSending(false);
        }
    };

    const handleDelete = async (commentId: string) => {
        try {
            await deleteDoc(doc(db, "Comments", commentId));
        } catch (err) {
            console.error(err);
        }
    };

    if (!user) return null;

    return (
        <div className="flex flex-col gap-6 w-full mt-10">
            {/* INPUT */}
            <div className="flex items-start gap-4 w-full bg-[#1F1F27] p-4 rounded-xl">
                <img
                    src={user.photoURL || ""}
                    className="w-10 h-10 rounded-full object-cover"
                />

                <div className="flex flex-col w-full gap-2">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full bg-[#2A2A35] text-whiteMain p-3 rounded-lg outline-none resize-none"
                        rows={3}
                    />

                    <div className="flex justify-end">
                        <button
                            onClick={handleSend}
                            disabled={sending || !text.trim()}
                            className="bg-purpleMain text-white px-4 py-2 rounded-lg disabled:opacity-50"
                        >
                            {sending ? "Sending..." : "Send"}
                        </button>
                    </div>
                </div>
            </div>

            {/* COMMENTS */}
            <div className="flex flex-col gap-4">
                {comments.length === 0 && (
                    <p className="text-whiteMain opacity-60">
                        No comments yet.
                    </p>
                )}

                {comments.map((c) => (
                    <div
                        key={c.id}
                        className="group flex gap-3 p-3 rounded-lg bg-[#1A1A22] hover:bg-[#22222D] transition"
                    >
                        {/* avatar */}
                        <NavLink
                            to={`/profile?section=overview&id=${c.userId}`}
                            reloadDocument
                        >
                            <img
                                src={c.userPhoto}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        </NavLink>

                        {/* content */}
                        <div className="flex flex-col flex-1">
                            <div className="flex justify-between">
                                <NavLink
                                    to={`/profile?section=overview&id=${c.userId}`}
                                    className="text-whiteMain font-semibold hover:text-purpleMain"
                                >
                                    {c.userName}
                                </NavLink>

                                <span className="text-xs opacity-60 text-whiteMain">
                                    {c.createdAt?.toDate?.().toLocaleString?.()}
                                </span>
                            </div>

                            <p className="text-whiteMain mt-1">{c.text}</p>
                        </div>

                        {/* delete */}
                        {user.uid === c.userId && (
                            <button
                                onClick={() => handleDelete(c.id)}
                                className="opacity-0 group-hover:opacity-100 text-red-500 px-2"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Comments;
