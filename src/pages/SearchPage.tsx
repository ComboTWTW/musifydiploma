import React, { useEffect, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSearchArtist } from "../api/last.fm/searchArtist";
import type { SearchArtistT } from "../api/last.fm/searchArtist";
import SimilarArtistsPicture from "../components/Artist Page/SimilarArtistsPicture";
import BandSearch from "../components/Search Page/ArtistSearch";
import ArtistSearch from "../components/Search Page/ArtistSearch";
import AlbumsSearch from "../components/Search Page/AlbumsSearch";
import TrackSearch from "../components/Search Page/TrackSearch";

const SearchPage = () => {
    const [searchType, setSearchType] = useState<"artist" | "album" | "track">(
        "artist",
    );

    const [searchParams] = useSearchParams();

    const { data, isFetching, error, refetch } = useQuery<SearchArtistT>({
        queryKey: ["artistInfo", searchParams.get("q")],
        queryFn: () => getSearchArtist(`${searchParams.get("q")}`),
    });

    useEffect(() => {
        refetch();
    }, []);

    return (
        <div className="w-full flex flex-col items-center mt-20">
            <div className="w-full flex flex-col items-start gap-5">
                <h2 className="font-poppins text-4xl font-semibold leading-[120%] text-whiteMain">
                    Search results for «{searchParams.get("q")}»
                </h2>
                <ul className="flex gap-10">
                    <li
                        onClick={() => {
                            setSearchType("artist");
                        }}
                        className={` font-poppins font-semibold text-2xl cursor-pointer ${searchType == "artist" ? "underline underline-offset-4 text-purpleMain" : "text-white"}`}
                    >
                        Artist
                    </li>
                    <li
                        onClick={() => {
                            setSearchType("album");
                        }}
                        className={` font-poppins font-semibold text-2xl cursor-pointer ${searchType == "album" ? "underline underline-offset-4 text-purpleMain" : "text-white"}`}
                    >
                        Album
                    </li>
                    <li
                        onClick={() => {
                            setSearchType("track");
                        }}
                        className={` font-poppins font-semibold text-2xl cursor-pointer ${searchType == "track" ? "underline underline-offset-4 text-purpleMain" : "text-white"}`}
                    >
                        Track
                    </li>
                </ul>

                {searchType === "artist" && <ArtistSearch />}
                {searchType === "album" && <AlbumsSearch />}
                {searchType === "track" && <TrackSearch />}
            </div>
        </div>
    );
};

export default SearchPage;
