import { NavLink } from "react-router-dom";
import { type similarArtistsT } from "../../api/last.fm/artist/getSimilarArtists";
import SimilarArtistsPicture from "./SimilarArtistsPicture";

interface Props {
    similarArtists: similarArtistsT;
}

const SimilarArtists = ({ similarArtists }: Props) => {
    return (
        <div className="flex flex-col gap-4 mt-5 w-full">
            <h2 className="font-poppins text-2xl font-semibold leading-[120%] text-whiteMain">
                Similar Artists
            </h2>
            <ul className="flex gap-4">
                {similarArtists.similarartists.artist
                    .slice(0, 5)
                    .map((artist, index) => {
                        return (
                            <li
                                className={`max-w-[255px] flex flex-col gap-3 ${artist.mbid == undefined && "hidden"}`}
                            >
                                <NavLink
                                    to={`/artist?id=${artist.mbid}`}
                                    reloadDocument
                                >
                                    <SimilarArtistsPicture mbid={artist.mbid} />
                                    <h3 className="font-poppins  text-whiteMain mt-2">
                                        {artist.name}
                                    </h3>
                                </NavLink>
                            </li>
                        );
                    })}
            </ul>
        </div>
    );
};

export default SimilarArtists;
