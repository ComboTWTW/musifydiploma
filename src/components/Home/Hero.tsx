import { NavLink } from "react-router-dom";
import { heroText } from "../../constants/constValues";
import { getTopArtists } from "../../api/last.fm/getTopArtists";
import type { topArtistsT } from "../../api/last.fm/getTopArtists";
import { useQuery } from "@tanstack/react-query";
import HeroAlbumsGrid from "./HeroAlbumsGrid";
import { useEffect } from "react";
import { auth } from "../../config/firebase";

const Hero = () => {
    const {
        data: topArtistsData,
        isLoading,
        error,
        refetch,
    } = useQuery<topArtistsT>({
        queryKey: ["getTopArtists"],
        queryFn: getTopArtists,
    });

    const artists = topArtistsData?.artists.artist.slice(0, 4);

    const user = auth.currentUser;

    useEffect(() => {
        refetch();
    }, []);
    return (
        <div className="flex justify-between">
            {/* Hero Text */}
            <div className="flex flex-col gap-7 max-w-[450px]">
                <h1 className="font-poppins font-semibold text-5xl leading-[120%] text-whiteMain line-clamp-3">
                    Your <span className="text-purpleMain">personal</span> music
                    encyclopedia
                </h1>

                <p className="font-poppins text-whiteMain font-medium leading-[170%] text-xl">
                    {heroText.subHeader}
                </p>

                {user ? (
                    <NavLink
                        to={`/profile?section=overview&id=${user.uid}`}
                        reloadDocument
                    >
                        <button className="border-purpleMain border bg-purpleMain cursor-pointer rounded-[10px] text-whiteMain font-inter font-light py-3 px-9">
                            Visit Profile Page
                        </button>
                    </NavLink>
                ) : (
                    <NavLink to={heroText.buttonPath} reloadDocument>
                        <button className="border-purpleMain  border bg-purpleMain cursor-pointer rounded-[10px] text-whiteMain font-inter font-light py-3 px-9">
                            {heroText.buttonText}
                        </button>
                    </NavLink>
                )}
            </div>

            {/* Albums Covers */}
            <div className="grid grid-cols-2 grid-rows-2 gap-4">
                {isLoading && <p className="text-white">Loading...</p>}

                {error && <p className="text-red-500">Error loading artists</p>}

                {artists?.map((artist) => (
                    <HeroAlbumsGrid
                        key={artist.mbid || artist.name}
                        mbid={artist.mbid}
                    />
                ))}
            </div>
        </div>
    );
};

export default Hero;
