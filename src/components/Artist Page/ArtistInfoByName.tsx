import { useQuery } from "@tanstack/react-query";
import { NavLink, useSearchParams } from "react-router-dom";
import {
    getArtistInfoByName,
    type ArtistInfoByNameT,
} from "../../api/last.fm/artist/getArtistInfoByName";
import { useEffect } from "react";
import MediaActions from "../MediaActions";
import {
    getTopAlbumsByName,
    type ArtistTopAlbumsByNameT,
} from "../../api/last.fm/artist/getTopAlbumsByName";
import TopAlbums from "./TopAlbums";
import {
    getTopTracksByName,
    type ArtistTopTracksByNameT,
} from "../../api/last.fm/artist/getArtistTopTracksByName";
import TopTracks from "./TopTracks";
import SimilarArtists from "./SimilarArtists";
import {
    getSimilarArtistsByName,
    type similarArtistsByNameT,
} from "../../api/last.fm/artist/getSimilarArtistsByName";

const ArtistInfoByName = () => {
    const [searchParams] = useSearchParams();

    const artistName: string = `${searchParams.get("name")}`;

    // Artist Data by Name
    const {
        data: artistDataByNameData,
        isFetching: isFetchingArtistDataByName,
        error: errorArtistDataByName,
        refetch: refetchArtistDataByName,
    } = useQuery<ArtistInfoByNameT>({
        queryKey: ["artistInfoByName", artistName],
        queryFn: () => getArtistInfoByName(artistName),
    });

    // Artist Top Albums by Name
    const {
        data: artistTopAlbumsDataByName,
        isFetching: artistTopAlbumsByNameisFetching,
        error: artistTopAlbumsByNameisFetchingError,
        refetch: refetchArtistTopAlbumsByName,
    } = useQuery<ArtistTopAlbumsByNameT>({
        queryKey: ["ArtistTopAlbumsByNameT", artistName],
        queryFn: () => getTopAlbumsByName(artistName),
    });

    // Artist Top Tracks by Name
    const {
        data: artistTopTracksDataByName,
        isFetching: artistTopTracksByNameisFetching,
        error: artistTopTracksByNameisFetchingError,
        refetch: refetchArtistTopTracksByName,
    } = useQuery<ArtistTopTracksByNameT>({
        queryKey: ["ArtistTopTracksByNameT", artistName],
        queryFn: () => getTopTracksByName(artistName),
    });
    // Similar Artists by Name
    const {
        data: similarArtistsDataByName,
        isFetching: SimilarArtistsByNameisFetching,
        error: SimilarArtistsByNameisFetchingError,
        refetch: refetchSimilarArtistsByName,
    } = useQuery<similarArtistsByNameT>({
        queryKey: ["similarArtistsByNameT", artistName],
        queryFn: () => getSimilarArtistsByName(artistName),
    });

    useEffect(() => {
        refetchArtistDataByName();
        refetchArtistTopAlbumsByName();
        refetchArtistTopTracksByName();
        refetchSimilarArtistsByName();
    }, []);

    artistDataByNameData && console.log(artistDataByNameData);
    return (
        <div className="w-full flex flex-col items-center mt-20">
            {artistDataByNameData &&
                artistTopAlbumsDataByName &&
                artistTopTracksDataByName &&
                similarArtistsDataByName && (
                    <div className="w-full flex flex-col gap-3 ">
                        <div className="flex gap-10">
                            <h2 className="font-poppins text-5xl font-semibold leading-[120%] text-whiteMain">
                                {artistDataByNameData?.artist.name}
                            </h2>
                            {/* Media Actions Need to Provide Top Albums Data*/}
                            <MediaActions
                                imageUrl={`${
                                    artistTopAlbumsDataByName.topalbums.album[0]
                                        .image[3]["#text"]
                                }`}
                                lastfmId={artistName}
                                mediaType="artist"
                                name={artistName}
                            />
                        </div>
                        <ul className="flex gap-5 my-1 ">
                            {artistDataByNameData.artist.tags.tag
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
                            {artistDataByNameData?.artist.bio.summary.replace(
                                /<a[\s\S]*$/i,
                                "",
                            )}
                        </p>
                        {/* Top Albums Section */}
                        <TopAlbums
                            artistTopAlbums={artistTopAlbumsDataByName}
                        />
                        {/* Top Tracks Section */}
                        <TopTracks
                            artistTopTracks={artistTopTracksDataByName}
                        />
                        {/* Similar Artists Section */}
                        <SimilarArtists
                            similarArtists={similarArtistsDataByName}
                        />
                    </div>
                )}
        </div>
    );
};

export default ArtistInfoByName;
