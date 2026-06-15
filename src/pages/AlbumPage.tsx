import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import {
    getSearchAlbumMbid,
    type SearchAlbumMbidT,
} from "../api/last.fm/album/searchAlbumMbid";
import MediaActions from "../components/MediaActions";
import Comments from "../components/Comments/Comments";

const AlbumPage = () => {
    const [searchParams] = useSearchParams();

    const artistName: string = `${searchParams.get("artist")}`;
    const albumName: string = `${searchParams.get("album")}`;

    // Get Album Data by Artist and Album Name
    const {
        data: albumInfoData,
        isFetching,
        error,
        refetch: refetchAlbumInfo,
    } = useQuery<SearchAlbumMbidT>({
        queryKey: ["artistInfo", artistName, albumName],
        queryFn: () => getSearchAlbumMbid(artistName, albumName),
    });
    useEffect(() => {
        refetchAlbumInfo();
        albumInfoData && console.log(albumInfoData);
    }, []);
    return (
        <div className="w-full flex flex-col items-center mt-20">
            {albumInfoData && (
                <div className="w-full flex flex-col gap-3 ">
                    {/* Artist Name */}
                    <NavLink
                        to={`/artist?id=&name=${albumInfoData.album.artist}`}
                        reloadDocument
                        className="max-w-fit"
                    >
                        <p className="hover:text-purpleMain hover:underline hover:underline-offset-4 font-poppins font-medium text-2xl  text-whiteMain ">
                            {albumInfoData.album.artist}
                        </p>
                    </NavLink>
                    {/* Album Name + Media Buttons */}
                    <div className="flex gap-10">
                        <h2 className="font-poppins text-5xl font-semibold leading-[120%] text-whiteMain">
                            {albumInfoData.album.name}
                        </h2>
                        <MediaActions
                            imageUrl={albumInfoData.album.image[3]["#text"]}
                            lastfmId={albumInfoData.album.mbid}
                            mediaType="album"
                            name={albumInfoData.album.name}
                            artistName={albumInfoData.album.artist}
                        />
                    </div>
                    {/* Album Tags */}
                    <div
                        className={`${albumInfoData.album.tags.tag == undefined && "hidden"} text-center flex items-center`}
                    >
                        <ul className="flex gap-5 my-1 ">
                            {albumInfoData.album.tags.tag
                                .slice(0, 5)
                                .map((tag, index) => {
                                    return (
                                        <span className="text-whiteMain uppercase font-inter hover:text-purpleMain">
                                            {tag.name}{" "}
                                            <span
                                                className={`text-whiteMain ml-2 ${index === 4 && "hidden"}`}
                                            >
                                                •
                                            </span>
                                        </span>
                                    );
                                })}
                        </ul>{" "}
                    </div>
                    {/* Album Picture and Summary */}
                    <div className="flex gap-4">
                        {/* Album Cover */}
                        <img
                            src={`${albumInfoData.album.image[3]["#text"] !== undefined ? albumInfoData.album.image[3]["#text"] : ""}`}
                            alt=""
                        />
                        {/* Album Summary */}
                        {albumInfoData.album.wiki !== undefined && (
                            <p className="font-poppins text-xl max-w-200 text-whiteMain leading-[1.9]">
                                {albumInfoData.album.wiki.summary.replace(
                                    /<a[\s\S]*$/i,
                                    "",
                                )}
                            </p>
                        )}
                    </div>
                    {/* Album Tracklist */}
                    <div className="flex flex-col gap-4  w-full">
                        <h2 className="font-poppins text-2xl font-semibold leading-[120%] text-whiteMain">
                            Tracklist
                        </h2>
                        {/* TrackList */}
                        <ol className="flex flex-col gap-5">
                            {albumInfoData.album.tracks.track.map(
                                (track, index) => {
                                    return (
                                        <li
                                            key={track.name}
                                            className="font-poppins  text-whiteMain flex gap-3 "
                                        >
                                            {/* Artist Name */}
                                            <NavLink
                                                to={`/artist?id=${track.artist.mbid}&name=${track.artist.name}`}
                                                className={`hover:text-purpleMain hover:underline hover:underline-offset-4`}
                                            >
                                                <p>
                                                    {index + 1}.{" "}
                                                    {track.artist.name}
                                                </p>
                                            </NavLink>
                                            —{/* Track Name */}
                                            <NavLink
                                                to={`/track?id=&artist=${track.artist.name}&name=${track.name}`}
                                                className={`hover:text-purpleMain hover:underline hover:underline-offset-4`}
                                            >
                                                <p>{track.name}</p>
                                            </NavLink>
                                        </li>
                                    );
                                },
                            )}
                        </ol>
                    </div>
                    {/* Comments Section */}
                    <Comments />
                </div>
            )}
        </div>
    );
};

export default AlbumPage;
