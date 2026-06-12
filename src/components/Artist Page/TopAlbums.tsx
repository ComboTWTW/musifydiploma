import { NavLink } from "react-router-dom";
import type { ArtistTopAlbumsT } from "../../api/last.fm/artist/getTopAlbums";

interface Props {
    artistTopAlbums: ArtistTopAlbumsT;
}

const TopAlbums = ({ artistTopAlbums }: Props) => {
    return (
        artistTopAlbums && (
            <div className="flex flex-col gap-4 mt-5 w-full">
                <h2 className="font-poppins text-2xl font-semibold leading-[120%] text-whiteMain">
                    Top Albums
                </h2>
                <ul className="flex gap-4">
                    {artistTopAlbums.topalbums.album
                        .slice(0, 5)
                        .map((album, index) => {
                            return (
                                <NavLink
                                    to={`/album?artist=${album.artist.name}&album=${album.name}`}
                                    reloadDocument
                                >
                                    <li className="flex flex-col gap-3 max-w-[255px]">
                                        <div className="">
                                            <img
                                                src={`${album.image[3]["#text"]}`}
                                                alt=""
                                                className=" "
                                            />
                                        </div>
                                        <h3 className="font-poppins  text-whiteMain ">
                                            {album.name}
                                        </h3>
                                    </li>
                                </NavLink>
                            );
                        })}
                </ul>
                <NavLink
                    to="/"
                    className="font-poppins font-medium text-xl underline-offset-4 underline text-whiteMain text-end"
                >
                    Discover All Albums {`>`}
                </NavLink>
            </div>
        )
    );
};

export default TopAlbums;
