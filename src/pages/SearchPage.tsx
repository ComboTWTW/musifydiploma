import React, { useEffect } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSearchArtist } from "../api/last.fm/searchArtist";
import type { SearchArtistT } from "../api/last.fm/searchArtist";

const SearchPage = () => {
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
        <div className="w-full flex flex-col items-center mt-20">
            <div className="w-full flex flex-col ">
                <h2 className="font-poppins text-4xl font-semibold leading-[120%] text-whiteMain">
                    Search results for «{searchParams.get("q")}»
                </h2>

                {data && (
                    <ul className="grid grid-cols-7 gap-10 mt-3 text-whiteMain font-poppins ">
                        {data.results.artistmatches.artist
                            .slice(0, 5)
                            .map((artist, index) => {
                                return (
                                    <NavLink
                                        reloadDocument
                                        to={`/artist?id=${artist.mbid}`}
                                        className="flex flex-col gap-3"
                                    >
                                        <img
                                            src="https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png"
                                            className=" w-40"
                                        />
                                        <p>{artist.name}</p>
                                    </NavLink>
                                );
                            })}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
