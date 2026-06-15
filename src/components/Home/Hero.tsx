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
        <div className="flex flex-col-reverse lg:flex-row items-center lg:items-start justify-between gap-10 lg:gap-16">
            {/* Hero Text */}
            <div className="flex flex-col gap-6 md:gap-7 w-full lg:max-w-[450px] text-center lg:text-left">
                <h1 className="font-poppins font-semibold text-3xl sm:text-4xl md:text-5xl leading-[120%] text-whiteMain line-clamp-3">
                    Your <span className="text-purpleMain">personal</span> music
                    encyclopedia
                </h1>

                <p className="font-poppins text-whiteMain font-medium leading-[170%] text-base sm:text-lg md:text-[20px] lg:text-xl opacity-90">
                    {heroText.subHeader}
                </p>

                {/* Button wrapper */}
                <div className="flex justify-center lg:justify-start">
                    {user ? (
                        <NavLink
                            to={`/profile?section=overview&id=${user.uid}`}
                            reloadDocument
                        >
                            <button className="w-full sm:w-auto border border-purpleMain bg-purpleMain cursor-pointer rounded-[10px] text-whiteMain font-inter font-light py-3 px-8 sm:px-9 hover:opacity-90 transition">
                                Visit Profile Page
                            </button>
                        </NavLink>
                    ) : (
                        <NavLink to={heroText.buttonPath} reloadDocument>
                            <button className="w-full sm:w-auto border border-purpleMain bg-purpleMain cursor-pointer rounded-[10px] text-whiteMain font-inter font-light py-3 px-8 sm:px-9 hover:opacity-90 transition">
                                {heroText.buttonText}
                            </button>
                        </NavLink>
                    )}
                </div>
            </div>

            {/* Albums Covers */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-3 sm:gap-4 w-full lg:max-w-[50%]">
                {isLoading && (
                    <p className="text-whiteMain col-span-2 text-center">
                        Loading...
                    </p>
                )}

                {error && (
                    <p className="text-red-500 col-span-2 text-center">
                        Error loading artists
                    </p>
                )}

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
