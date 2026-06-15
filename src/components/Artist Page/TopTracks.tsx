import { NavLink } from "react-router-dom";
import type { ArtistTopTracksT } from "../../api/last.fm/artist/getTopTracks";

interface Props {
    artistTopTracks: ArtistTopTracksT;
}

const TopTracks = ({ artistTopTracks }: Props) => {
    console.log(artistTopTracks.toptracks.track);
    return (
        <div className="flex flex-col gap-4  w-full">
            <h2 className="font-poppins text-2xl font-semibold leading-[120%] text-whiteMain">
                Top Tracks
            </h2>
            <ol className="flex flex-col gap-5">
                {artistTopTracks.toptracks.track
                    .slice(0, 10)
                    .map((track, index) => {
                        return (
                            <li
                                key={track.mbid}
                                className="font-poppins  text-whiteMain flex gap-3 "
                            >
                                <p>
                                    {index + 1}. {track.artist.name}
                                </p>
                                —
                                <NavLink
                                    to={`/track?id=${track.mbid}`}
                                    className={`hover:text-purpleMain hover:underline hover:underline-offset-4`}
                                >
                                    <p>{track.name}</p>
                                </NavLink>
                            </li>
                        );
                    })}
            </ol>
        </div>
    );
};

export default TopTracks;
