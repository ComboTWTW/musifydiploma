import React, { useEffect } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import {
    getTrackInfo,
    type trackInfoT,
} from "../api/last.fm/track/getTrackInfo";
import { useQuery } from "@tanstack/react-query";
import { getTrackLength } from "../functions/getTrackLength";
import SimilarArtists from "../components/Artist Page/SimilarArtists";
import SimilarTracks from "../components/Track Page/SimilarTracks";

const TrackPage = () => {
    const [searchParams] = useSearchParams();

    const trackMbid: string = `${searchParams.get("id")}`;

    // Artist Data
    const {
        data: trackInfoData,
        isFetching: isFetchingTrackData,
        error: trackDataFetchingError,
        refetch: trackDataRefetch,
    } = useQuery<trackInfoT>({
        queryKey: ["trackInfo", trackMbid],
        queryFn: () => getTrackInfo(trackMbid),
    });

    useEffect(() => {
        trackDataRefetch();
    }, []);

    trackInfoData && console.log(trackInfoData);

    return (
        <div className="w-full flex flex-col items-center mt-20">
            {trackInfoData && (
                <div className="w-full flex flex-col gap-3 ">
                    <NavLink
                        to={`/artist?id=${trackInfoData.track.artist.mbid}`}
                        reloadDocument
                        className="max-w-fit"
                    >
                        <p className="hover:text-purpleMain hover:underline hover:underline-offset-4 font-poppins font-medium text-2xl  text-whiteMain ">
                            {trackInfoData.track.artist.name}
                        </p>
                    </NavLink>
                    <h2 className="font-poppins text-5xl font-semibold leading-[120%] text-whiteMain">
                        {trackInfoData.track.name}
                    </h2>
                    <div className="flex items-center text-center gap-5">
                        {" "}
                        <p
                            className={`${+trackInfoData.track.duration === 0 && "hidden"} font-poppins font-medium text-  text-whiteMain `}
                        >
                            Duration:{" "}
                            {getTrackLength(trackInfoData.track.duration)}
                        </p>
                        <div
                            className={`${trackInfoData.track.toptags.tag[0] == undefined && "hidden"} text-center flex items-center`}
                        >
                            <span className="text-whiteMain mr-5">•</span>
                            <p className="text-whiteMain"></p>
                            <ul className="flex gap-5 my-1 ">
                                {trackInfoData.track.toptags.tag
                                    .slice(0, 5)
                                    .map((tag, index) => {
                                        return (
                                            <NavLink to={"/"} reloadDocument>
                                                <span className="text-whiteMain uppercase font-inter hover:text-purpleMain">
                                                    {tag.name}
                                                </span>
                                            </NavLink>
                                        );
                                    })}
                            </ul>{" "}
                        </div>
                    </div>

                    <h2 className="font-poppins text-2xl font-semibold leading-[120%] text-whiteMain mt-4">
                        Fetured on:
                    </h2>
                    {/* Album Info */}
                    {trackInfoData.track.album && (
                        <div className="flex gap-4">
                            <img
                                src={`${trackInfoData.track.album.image[3]["#text"]}`}
                                alt=""
                            />
                            <div className="flex flex-col gap-3">
                                <NavLink
                                    to={`/artist?id=${trackInfoData.track.artist.mbid}`}
                                    reloadDocument
                                    className=""
                                >
                                    <h3 className="text-whiteMain font-poppins text-4xl font-semibold hover:text-purpleMain hover:underline hover:underline-offset-4">
                                        {trackInfoData.track.album.artist}
                                    </h3>
                                </NavLink>
                                <NavLink to={""} className="" reloadDocument>
                                    <h3 className="text-whiteMain font-poppins text-2xl ">
                                        {trackInfoData.track.album.title}
                                    </h3>
                                </NavLink>
                            </div>
                        </div>
                    )}
                    {/* Similar Tracks */}
                    <SimilarTracks trackMbid={trackMbid} />
                </div>
            )}
        </div>
    );
};

export default TrackPage;
