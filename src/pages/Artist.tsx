import React, { useEffect } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { getArtistInfo } from "../api/last.fm/getArtistInfo";
import type { ArtistInfoT } from "../api/last.fm/getArtistInfo";

import { useQuery } from "@tanstack/react-query";
import { getTopAlbums } from "../api/last.fm/artist/getTopAlbums";
import type { ArtistTopAlbumsT } from "../api/last.fm/artist/getTopAlbums";
import TopAlbums from "../components/Artist Page/TopAlbums";
import TopTracks from "../components/Artist Page/TopTracks";
import {
    getTopTracks,
    type ArtistTopTracksT,
} from "../api/last.fm/artist/getTopTracks";
import {
    getSimilarArtists,
    type similarArtistsT,
} from "../api/last.fm/artist/getSimilarArtists";
import SimilarArtists from "../components/Artist Page/SimilarArtists";
import MediaActions from "../components/MediaActions";
import ArtistInfoByName from "../components/Artist Page/ArtistInfoByName";

const Artist = () => {
    const [searchParams] = useSearchParams();

    const mbid: string = `${searchParams.get("id")}`;

    // Artist Data
    const {
        data: artistData,
        isFetching,
        error,
        refetch,
    } = useQuery<ArtistInfoT>({
        queryKey: ["artistInfo", mbid],
        queryFn: () => getArtistInfo(mbid),
    });
    // Artist Top Albums
    const {
        data: artistTopAlbums,
        isFetching: artistTopAlbumsisFetching,
        error: artistTopAlbumsisFetchingError,
        refetch: refetchArtistTopAlbums,
    } = useQuery<ArtistTopAlbumsT>({
        queryKey: ["artistTopAlbums", mbid],
        queryFn: () => getTopAlbums(mbid),
    });

    // Artist Top Tracks
    const {
        data: artistTopTracks,
        isFetching: artistTopTracksisFetching,
        error: artistTopTracksFetchingError,
        refetch: refetchArtistTopTracks,
    } = useQuery<ArtistTopTracksT>({
        queryKey: ["artistTopTracks", mbid],
        queryFn: () => getTopTracks(mbid),
    });

    // Similar Artists
    const {
        data: similarArtistsData,
        isFetching: similarArtistsIsFetching,
        error: similarArtistsFetchingError,
        refetch: refetchSimilarArtists,
    } = useQuery<similarArtistsT>({
        queryKey: ["similarArtists", mbid],
        queryFn: () => getSimilarArtists(mbid),
    });

    useEffect(() => {
        refetch();
        refetchArtistTopAlbums();
        refetchArtistTopTracks();
        refetchSimilarArtists();
    }, []);

    similarArtistsData && console.log(similarArtistsData);

    return (
        <div className="w-full flex flex-col items-center mt-20">
            {mbid !== "" &&
                artistData &&
                artistTopAlbums &&
                artistTopTracks &&
                similarArtistsData && (
                    <div className="w-full flex flex-col gap-3 ">
                        <div className="flex gap-10">
                            <h2 className="font-poppins text-5xl font-semibold leading-[120%] text-whiteMain">
                                {artistData.artist.name}
                            </h2>
                            <MediaActions
                                imageUrl={`${
                                    artistTopAlbums.topalbums.album[0].image[3][
                                        "#text"
                                    ]
                                }`}
                                lastfmId={mbid}
                                mediaType="artist"
                                name={artistData.artist.name}
                            />
                        </div>
                        <ul className="flex gap-5 my-1 ">
                            {artistData.artist.tags.tag
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
                        </ul>
                        <p className="font-poppins font-medium text-xl max-w-250 text-whiteMain leading-[1.9]">
                            {artistData.artist.bio.summary.replace(
                                /<a[\s\S]*$/i,
                                "",
                            )}
                        </p>
                        {/* Top Albums Section */}
                        <TopAlbums artistTopAlbums={artistTopAlbums} />
                        {/* Top Tracks Section */}
                        <TopTracks artistTopTracks={artistTopTracks} />
                        {/* Similar Artists Section */}
                        <SimilarArtists similarArtists={similarArtistsData} />
                    </div>
                )}
            {mbid === "" && <ArtistInfoByName />}
        </div>
    );
};

export default Artist;
