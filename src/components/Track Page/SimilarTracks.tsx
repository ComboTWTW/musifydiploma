import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
    getSimilarTracks,
    type similarTracksT,
} from "../../api/last.fm/track/getSimilarTracks";
import { useQuery } from "@tanstack/react-query";
import { getTrackLength } from "../../functions/getTrackLength";

interface Props {
    trackMbid: string;
}

const SimilarTracks = ({ trackMbid }: Props) => {
    // Similar Tracks
    const {
        data: similarTracksData,
        isFetching: isFetchingSimilarTracks,
        error: similarTracksFetchingError,
        refetch: similarTracksRefetch,
    } = useQuery<similarTracksT>({
        queryKey: ["similarTracks", trackMbid],
        queryFn: () => getSimilarTracks(trackMbid),
    });

    useEffect(() => {
        similarTracksRefetch();
    }, []);

    similarTracksData && console.log(similarTracksData);

    return (
        similarTracksData && (
            <div className="flex flex-col gap-4  w-full mt-4">
                <h2 className="font-poppins text-2xl font-semibold leading-[120%] text-whiteMain">
                    Similar Tracks
                </h2>
                <ol className="flex flex-col gap-5">
                    {similarTracksData.similartracks.track
                        .slice(0, 10)
                        .map((track, index) => {
                            return (
                                <li
                                    key={track.mbid}
                                    className="font-poppins  text-whiteMain flex gap-3 "
                                >
                                    <p>
                                        {index + 1}.{" "}
                                        <NavLink
                                            className={`hover:text-purpleMain hover:underline hover:underline-offset-4`}
                                            reloadDocument
                                            to={`../artist?id=${track.artist.mbid}`}
                                        >
                                            {track.artist.name}
                                        </NavLink>
                                    </p>
                                    —
                                    <NavLink
                                        to={`${track.mbid === undefined ? `artist?id=${track.artist.mbid}` : `/track?id=${track.mbid}`}`}
                                        reloadDocument
                                        className={`hover:text-purpleMain hover:underline hover:underline-offset-4`}
                                    >
                                        <p>{track.name}</p>
                                    </NavLink>
                                    <span
                                        className={`${track.duration === 0 && "hidden"}`}
                                    >
                                        •
                                    </span>
                                    <p
                                        className={`${track.duration === 0 && "hidden"}`}
                                    >
                                        {getTrackLength(
                                            `${track.duration * 1000} `,
                                        )}
                                    </p>
                                </li>
                            );
                        })}
                </ol>
                <NavLink
                    to="/"
                    className="font-poppins font-medium text-xl underline-offset-4 underline text-whiteMain text-end"
                >
                    Discover Similar Tracks {`>`}
                </NavLink>
            </div>
        )
    );
};

export default SimilarTracks;
