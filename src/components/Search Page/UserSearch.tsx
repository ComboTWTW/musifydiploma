import { NavLink, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import {
    searchUsers,
    type UserSearchResult,
} from "../../functions/firebase/searchUsers";
import { useEffect } from "react";

const UserSearch = () => {
    const [searchParams] = useSearchParams();

    const userSearchQuery = searchParams.get("q") || "";

    const { data, isFetching, error, refetch } = useQuery<UserSearchResult[]>({
        queryKey: ["userSearch", userSearchQuery],
        queryFn: () => searchUsers(userSearchQuery),
        enabled: !!userSearchQuery.trim(),
    });

    if (isFetching) {
        return (
            <p className="text-whiteMain font-poppins">Searching users...</p>
        );
    }

    if (error) {
        return (
            <p className="text-red-500 font-poppins">Failed to search users.</p>
        );
    }

    return (
        <ul className="grid grid-cols-8 gap-5 mt-3 text-whiteMain font-poppins">
            {data?.map((user) => (
                <li key={user.uid}>
                    <NavLink
                        reloadDocument
                        to={`/profile?section=overview&id=${user.uid}`}
                        className="flex flex-col gap-3 hover:opacity-80 transition"
                    >
                        <div className="max-h-[160px]">
                            <img
                                src={
                                    user.photoURL?.startsWith(
                                        "https://lh3.googleusercontent.com",
                                    )
                                        ? `${user.photoURL.slice(0, -5)}s300-c`
                                        : user.photoURL
                                }
                                alt={user.name}
                                className="
                                    w-[160px]
                                    h-[160px]
                                    object-cover
                                    rounded-full
                                "
                            />

                            <p className="mt-2 text-center font-semibold">
                                {user.name}
                            </p>
                        </div>
                    </NavLink>
                </li>
            ))}

            {data?.length === 0 && (
                <p className="text-whiteMain opacity-70">No users found.</p>
            )}
        </ul>
    );
};

export default UserSearch;
