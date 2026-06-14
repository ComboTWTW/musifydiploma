import { NavLink, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import {
    getTrackInfo,
    type trackInfoT,
} from "../api/last.fm/track/getTrackInfo";

import { getTrackInfoByName } from "../api/last.fm/track/getTrackInfoByName";

import { getTrackLength } from "../functions/getTrackLength";

import SimilarTracks from "../components/Track Page/SimilarTracks";
import Lyrics from "./Lyrics";
import MediaActions from "../components/MediaActions";
import Comments from "../components/Comments/Comments";

const TrackPage = () => {
    const [searchParams] = useSearchParams();

    const trackMbid = searchParams.get("id") || "";
    const artistName = searchParams.get("artist") || "";
    const trackName = searchParams.get("name") || "";

    // Query by MBID
    const {
        data: trackInfoData,
        isFetching: isFetchingByMbid,
        error: mbidError,
    } = useQuery<trackInfoT>({
        queryKey: ["trackInfo", trackMbid],
        queryFn: () => getTrackInfo(trackMbid),
        enabled: !!trackMbid,
    });

    // Query by Artist + Track Name
    const {
        data: trackInfoByName,
        isFetching: isFetchingByName,
        error: nameError,
    } = useQuery<trackInfoT>({
        queryKey: ["trackInfoByName", artistName, trackName],
        queryFn: () => getTrackInfoByName(artistName, trackName),
        enabled: !trackMbid && !!artistName && !!trackName,
    });

    const currentTrackInfo = trackMbid ? trackInfoData : trackInfoByName;

    const isLoading = isFetchingByMbid || isFetchingByName;

    const error = mbidError || nameError;

    if (isLoading) {
        return (
            <div className="w-full flex justify-center mt-20">
                <p className="text-whiteMain">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full flex justify-center mt-20">
                <p className="text-red-500">Error loading track information</p>
            </div>
        );
    }

    if (!currentTrackInfo) {
        return (
            <div className="w-full flex justify-center mt-20">
                <p className="text-whiteMain">Track information not found</p>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col items-center mt-20">
            <div className="w-full flex flex-col gap-3">
                <NavLink
                    to={`/artist?id=&name=${currentTrackInfo.track.artist.name}`}
                    reloadDocument
                    className="max-w-fit"
                >
                    <p className="hover:text-purpleMain hover:underline hover:underline-offset-4 font-poppins font-medium text-2xl text-whiteMain">
                        {currentTrackInfo.track.artist.name}
                    </p>
                </NavLink>

                <div className="flex gap-10">
                    <h2 className="font-poppins text-5xl font-semibold leading-[120%] text-whiteMain">
                        {currentTrackInfo.track.name}
                    </h2>

                    <MediaActions
                        imageUrl={
                            currentTrackInfo.track.album?.image?.[3]?.[
                                "#text"
                            ] || ""
                        }
                        lastfmId={trackMbid}
                        mediaType="track"
                        name={currentTrackInfo.track.name}
                        artistName={currentTrackInfo.track.artist.name}
                    />
                </div>

                <div className="flex items-center gap-5">
                    {+currentTrackInfo.track.duration > 0 && (
                        <p className="font-poppins font-medium text-whiteMain">
                            Duration:{" "}
                            {getTrackLength(currentTrackInfo.track.duration)}
                        </p>
                    )}

                    {currentTrackInfo.track.toptags?.tag?.length > 0 && (
                        <div className="flex items-center">
                            <span className="text-whiteMain mr-5">•</span>

                            <ul className="flex gap-5">
                                {currentTrackInfo.track.toptags.tag
                                    .slice(0, 5)
                                    .map((tag) => (
                                        <NavLink
                                            key={tag.name}
                                            to="/"
                                            reloadDocument
                                        >
                                            <span className="text-whiteMain uppercase font-inter hover:text-purpleMain">
                                                {tag.name}
                                            </span>
                                        </NavLink>
                                    ))}
                            </ul>
                        </div>
                    )}
                </div>

                <h2 className="font-poppins text-2xl font-semibold leading-[120%] text-whiteMain mt-4">
                    Featured on:
                </h2>

                {currentTrackInfo.track.album && (
                    <div className="flex gap-4">
                        <img
                            src={
                                currentTrackInfo.track.album.image?.[3]?.[
                                    "#text"
                                ] || ""
                            }
                            alt={currentTrackInfo.track.album.title}
                        />

                        <div className="flex flex-col gap-3">
                            <NavLink
                                to={`/artist?id=${currentTrackInfo.track.artist.mbid}`}
                                reloadDocument
                            >
                                <h3 className="text-whiteMain font-poppins text-4xl font-semibold hover:text-purpleMain hover:underline hover:underline-offset-4">
                                    {currentTrackInfo.track.album.artist}
                                </h3>
                            </NavLink>
                            {/* Album Name */}
                            <NavLink
                                to={`/album?artist=${currentTrackInfo.track.artist.name}&album=${currentTrackInfo.track.album.title}`}
                                reloadDocument
                            >
                                <h3 className="text-whiteMain font-poppins text-2xl">
                                    {currentTrackInfo.track.album.title}
                                </h3>
                            </NavLink>
                        </div>
                    </div>
                )}

                <h2 className="font-poppins text-2xl font-semibold leading-[120%] text-whiteMain mt-4">
                    Lyrics:
                </h2>

                <Lyrics
                    q={`${currentTrackInfo.track.artist.name} ${currentTrackInfo.track.name}`}
                />

                <SimilarTracks trackMbid={trackMbid} />
                <Comments />
            </div>
        </div>
    );
};

export default TrackPage;
