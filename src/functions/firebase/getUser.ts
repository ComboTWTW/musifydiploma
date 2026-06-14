import { doc, getDoc } from "firebase/firestore";

import { db } from "../../config/firebase";

import { Timestamp } from "firebase/firestore";

export interface MediaItem {
    id: string;
    mediaType: "artist" | "album" | "track";
    name: string;
    lastfmId: string;
    imageUrl: string;
    artistName?: string;
    createdAt: Timestamp;
}

export interface ActivityItem {
    id: string;
    createdAt: Timestamp;

    actionType: "add" | "remove" | "create_list";

    listName: string;

    data: MediaItem; // full embedded media object
}

export interface UserList {
    id: string;
    name: string;
    visibility: "public" | "private";
    items: MediaItem[];
}

export interface UserT {
    id: string;

    name: string;
    email: string;
    photoURL: string;

    role: "user" | "moderator" | "admin";
    status: string;

    followers: string[];
    following: string[];

    lists: UserList[];

    activity?: ActivityItem[];
    usernameLower?: string;

    createdAt: Timestamp;
    profileVisibility: "public" | "private";
}

export const getUser = async (uid: string): Promise<UserT> => {
    try {
        const userRef = doc(db, "Users", uid);

        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            throw new Error("User not found");
        }

        return userSnap.data() as UserT;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
