import React from "react";

const SubHero = () => {
    return (
        <div className="w-full flex flex-col md:flex-row items-center md:items-start justify-center md:justify-between gap-12 md:gap-8 lg:gap-12 text-whiteMain font-poppins text-center mt-16 md:mt-24 lg:mt-28">
            {/* Item 1 */}
            <div className="flex flex-col max-w-[320px] items-center md:items-center">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-[120%]">
                    Track <span className="text-purpleMain">your</span> music
                    your way
                </h3>
                <p className="mt-3 md:mt-4 max-w-[260px] leading-relaxed text-sm sm:text-base opacity-90">
                    Log your listening manually or automatically — no streaming
                    required.
                </p>
            </div>

            {/* Item 2 */}
            <div className="flex flex-col max-w-[320px] items-center">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-[120%]">
                    All music info in{" "}
                    <span className="text-purpleMain">one</span> place
                </h3>
                <p className="mt-3 md:mt-4 max-w-[260px] leading-relaxed text-sm sm:text-base opacity-90">
                    Artists, albums, tracks, and lyrics combined into a single
                    platform.
                </p>
            </div>

            {/* Item 3 */}
            <div className="flex flex-col max-w-[320px] items-center">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-[120%]">
                    Build <span className="text-purpleMain">your</span> musical
                    world
                </h3>
                <p className="mt-3 md:mt-4 max-w-[260px] leading-relaxed text-sm sm:text-base opacity-90">
                    Curated lists for favorite artists, essential albums,
                    timeless tracks — all organized by you.
                </p>
            </div>
        </div>
    );
};

export default SubHero;
