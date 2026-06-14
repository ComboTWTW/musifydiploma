import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "../../config/firebase";

export interface UserSearchResult {
    uid: string;
    name: string;
    photoURL: string;
    status?: string;
    profileVisibility?: "public" | "private";
}

export const searchUsers = async (
    search: string,
): Promise<UserSearchResult[]> => {
    if (!search.trim()) return [];

    const q = query(
        collection(db, "Users"),
        where("usernameLower", ">=", search.toLowerCase()),
        where("usernameLower", "<=", search.toLowerCase() + "\uf8ff"),
    );

    const snapshot = await getDocs(q);

    return snapshot.docs
        .map((doc) => ({
            uid: doc.id,
            ...(doc.data() as Omit<UserSearchResult, "uid">),
        }))
        .filter((user) => user.profileVisibility !== "private");
};
