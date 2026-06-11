import { doc, getDoc, Timestamp } from "firebase/firestore";

import { db } from "../../config/firebase";

export interface UserT {
    id: string;

    name: string;

    email: string;

    photoURL: string;

    role: string;

    status: string;

    followers: string[];

    following: string[];

    lists: {
        id: string;

        name: string;

        visibility: "public" | "private";

        items: {
            id: string;

            contentType: "artist" | "album" | "track";

            title: string;

            imageUrl: string;
            createdAt: Timestamp;
        }[];
    }[];

    createdAt: unknown;
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
