import { useQuery } from "@tanstack/react-query";
import { NavLink, useSearchParams } from "react-router-dom";
import {
    getSearchTracks,
    type SearchTrackT,
} from "../../api/last.fm/track/searchTracks";
import { useEffect } from "react";

const TrackSearch = () => {
    const [searchParams] = useSearchParams();

    // Search Track By Query
    const { data, isFetching, error, refetch } = useQuery<SearchTrackT>({
        queryKey: ["SearchTrackT", searchParams.get("q")],
        queryFn: () => getSearchTracks(`${searchParams.get("q")}`),
    });

    useEffect(() => {
        refetch();
        data && console.log(data);
    }, []);

    return (
        data && (
            <ol className="flex flex-col gap-5 text-xl">
                {data.results.trackmatches.track
                    .slice(0, 10)
                    .map((track, index) => {
                        return (
                            <NavLink
                                to={`/track?id=${track.mbid}`}
                                className={`text-whiteMain hover:text-purpleMain ${track.mbid == "" && "hidden"}`}
                            >
                                <li
                                    key={track.mbid}
                                    className="font-poppins   flex gap-3 "
                                >
                                    <p>{track.artist}</p>—<p>{track.name}</p>
                                </li>
                            </NavLink>
                        );
                    })}
            </ol>
        )
    );
};

export default TrackSearch;
