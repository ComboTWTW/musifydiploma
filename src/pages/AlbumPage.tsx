import React from "react";
import { NavLink } from "react-router-dom";

const AlbumPage = () => {
    return (
        <div className="w-full flex flex-col items-center mt-20">
            {true && (
                <div className="w-full flex flex-col gap-3 ">
                    <NavLink to={``} reloadDocument className="max-w-fit">
                        <p className="hover:text-purpleMain hover:underline hover:underline-offset-4 font-poppins font-medium text-2xl  text-whiteMain ">
                            {/* {trackInfoData.track.artist.name} */}
                        </p>
                    </NavLink>
                    <h2 className="font-poppins text-5xl font-semibold leading-[120%] text-whiteMain">
                        {/* {trackInfoData.track.name} */}
                    </h2>

                    <h2 className="font-poppins text-2xl font-semibold leading-[120%] text-whiteMain mt-4">
                        Fetured on:
                    </h2>
                </div>
            )}
        </div>
    );
};

export default AlbumPage;
