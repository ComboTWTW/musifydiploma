import React from "react";

const SubHero = () => {
    return (
        <div className="w-full flex justify-between text-whiteMain font-poppins text-center mt-28">
            <div className="flex flex-col max-w-[350px] items-center">
                <h3 className="text-4xl font-semibold leading-[120%]">
                    Track <span className="text-purpleMain">your</span> music
                    your way
                </h3>
                <p className="mt-4 max-w-[260px] leading-relaxed">
                    Log your listening manually or automatically — no streaming
                    required.
                </p>
            </div>
            <div className="flex flex-col max-w-[350px] items-center">
                <h3 className="text-4xl font-semibold leading-[120%]">
                    All music info in{" "}
                    <span className="text-purpleMain">one</span> place
                </h3>
                <p className="mt-4 max-w-[260px] leading-relaxed">
                    Artists, albums, tracks, and lyrics combined into a single
                    platform.
                </p>
            </div>
            <div className="flex flex-col max-w-[350px] items-center">
                <h3 className="text-4xl font-semibold leading-[120%]">
                    Build <span className="text-purpleMain">your</span> musical
                    world
                </h3>
                <p className="mt-4 max-w-[260px] leading-relaxed">
                    Curated lists for favorite artists, essential albums,
                    timeless tracks — all organized by you.
                </p>
            </div>
        </div>
    );
};

export default SubHero;
