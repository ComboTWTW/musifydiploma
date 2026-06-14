import React, { useReducer } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import type { UserT } from "../../functions/firebase/getUser";
import { auth, db } from "../../config/firebase";
import { doc, updateDoc } from "firebase/firestore";

interface Props {
    userData: UserT;
}

const History = ({ userData }: Props) => {
    const [searchParams] = useSearchParams();
    const sectionParam = searchParams.get("section");

    const clearHistory = async () => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            const userRef = doc(db, "Users", user.uid);

            await updateDoc(userRef, {
                activity: [], // or "history: []" depending on your field name
            });
            window.location.href = "/profile";

            console.log("History cleared");
        } catch (error) {
            console.error("Failed to clear history:", error);
        }
    };

    return (
        <div className=" flex flex-col gap-5  ">
            <div className="flex justify-between items-center">
                <h2 className="font-poppins text-4xl leading-[120%] text-whiteMain font-semibold">
                    History
                </h2>
                <button
                    className={`border-red-700  max-w-[175px] border bg-transparent cursor-pointer rounded-[10px] text-red-700 font-inter font-light py-2 px-4 ${sectionParam !== "history" && "hidden"}`}
                    onClick={() => clearHistory()}
                >
                    Clear History
                </button>
            </div>

            <ul className="flex flex-col gap-8 text-xl font-poppins mt-3">
                {userData.activity
                    ?.slice(
                        0,
                        sectionParam === "overview" || sectionParam === null
                            ? 5
                            : userData.activity.length,
                    )
                    .map((act, index) => {
                        return (
                            <li className="text-white font-poppins flex gap-2 justify-between">
                                <span className="text-white font-poppins flex gap-2 items-center">
                                    Added {/* Media Type */}
                                    <span className="capitalize">
                                        {act.data.mediaType}{" "}
                                    </span>
                                    {/* Artist or Content Name */}
                                    <NavLink
                                        to={`/${act.data.mediaType}${act.data.mediaType !== "artist" ? `?id=${act.data.mediaType === "track" && `${act.data.lastfmId}`}&artist=${act.data.artistName}&${act.data.mediaType === "track" ? "name" : "album"}=${act.data.name}` : `?id=&name=${act.data.name}`}`}
                                        reloadDocument={true}
                                        className={`underline-offset-4 underline hover:text-purpleMain font-semibold hover`}
                                    >
                                        {act.data.mediaType !== `artist`
                                            ? `${act.data.name}`
                                            : `${act.data.name}`}
                                    </NavLink>
                                    {/* By if not Artist */}
                                    <span
                                        className={`${act.data.mediaType === `artist` && `hidden`}`}
                                    >
                                        {` by `}
                                    </span>
                                    {/* Artist if Content */}
                                    <NavLink
                                        to={`/artist?id=&name=${act.data.artistName}`}
                                        reloadDocument={true}
                                        className={`${act.data.mediaType === `artist` && `hidden`} underline-offset-4 underline hover:text-purpleMain font-semibold hover`}
                                    >
                                        {act.data.artistName}
                                    </NavLink>
                                    {` to `}
                                    <span>{act.listName}</span>
                                </span>
                                {/* TimeStamp*/}
                                <span className="text-[12px] text-center">
                                    {`(`}
                                    {act.createdAt
                                        ?.toDate()
                                        .toLocaleString("en-GB", {
                                            weekday: "long",
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                            hour: "numeric",
                                            minute: "2-digit",
                                            hour12: true,
                                        })
                                        .replace(",", "")}
                                    {`)`}
                                </span>
                            </li>
                        );
                    })}
            </ul>
            <NavLink
                to={`/profile?section=history`}
                className={`mt-5 font-poppins font-medium text-xl underline-offset-4 underline text-whiteMain text-end ${sectionParam === "history" && "hidden"}`}
            >
                View All History {`>`}
            </NavLink>
        </div>
    );
};

export default History;
