import React from "react";
import { NavLink } from "react-router-dom";
import type { UserT } from "../../functions/firebase/getUser";

interface Props {
    userData: UserT;
}

const History = ({ userData }: Props) => {
    console.log(userData);
    return (
        <div className=" flex flex-col gap-5  ">
            <h2 className="font-poppins text-4xl leading-[120%] text-whiteMain font-semibold">
                History
            </h2>
            <ul className="flex flex-col gap-8 text-xl font-poppins">
                {userData.activity?.map((act, index) => {
                    return (
                        <li className="text-white font-poppins flex gap-2">
                            Added {/* Media Type */}
                            <span className="capitalize">
                                {act.data.mediaType}{" "}
                            </span>
                            {/* Artist or Content Name */}
                            <NavLink
                                to={`/${act.data.mediaType}${act.data.mediaType !== "artist" ? `?id=&artist=${act.data.artistName}&${act.data.mediaType}=${act.data.name}` : `?id=&name=${act.data.name}`}`}
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
                        </li>
                    );
                })}
            </ul>
            <NavLink
                to={`/profile?section=history`}
                className="mt-5 font-poppins font-medium text-xl underline-offset-4 underline text-whiteMain text-end"
            >
                View All History {`>`}
            </NavLink>
        </div>
    );
};

export default History;
