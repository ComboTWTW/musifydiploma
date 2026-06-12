import React, { useEffect, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSearchArtist } from "../../api/last.fm/searchArtist";
import type { SearchArtistT } from "../../api/last.fm/searchArtist";
import SimilarArtistsPicture from "../../components/Artist Page/SimilarArtistsPicture";

const ArtistSearch = () => {
    const [searchParams] = useSearchParams();

    const { data, isFetching, error, refetch } = useQuery<SearchArtistT>({
        queryKey: ["artistInfo", searchParams.get("q")],
        queryFn: () => getSearchArtist(`${searchParams.get("q")}`),
    });

    useEffect(() => {
        refetch();
    }, []);
    data && console.log(data);
    return (
        <div className="">
            {data && (
                <ul className="grid grid-cols-8 gap-5  mt-3 text-whiteMain font-poppins ">
                    {data.results.artistmatches.artist
                        .slice(0, 5)
                        .map((artist, index) => {
                            return (
                                <NavLink
                                    reloadDocument
                                    to={`/artist?id=${artist.mbid}&name=${artist.name}`}
                                    className={`flex flex-col gap-3`}
                                >
                                    <div className="max-h-[160px]">
                                        <SimilarArtistsPicture
                                            mbid={artist.mbid}
                                        />
                                        <p>{artist.name}</p>
                                    </div>
                                </NavLink>
                            );
                        })}
                </ul>
            )}
        </div>
    );
};

export default ArtistSearch;
