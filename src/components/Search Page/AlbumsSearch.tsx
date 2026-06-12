import { useQuery } from "@tanstack/react-query";
import {
    getSearchAlbum,
    type SearchAlbumT,
} from "../../api/last.fm/album/searchAlbum";
import { NavLink, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import SimilarArtistsPicture from "../Artist Page/SimilarArtistsPicture";
import AlbumImageByName from "./AlbumImageByName";

const AlbumsSearch = () => {
    const [searchParams] = useSearchParams();
    // Get Albums by Artist's name
    const { data, isFetching, error, refetch } = useQuery<SearchAlbumT>({
        queryKey: ["SearchAlbumT", searchParams.get("q")],
        queryFn: () => getSearchAlbum(`${searchParams.get("q")}`),
    });

    useEffect(() => {
        refetch();
    }, []);

    return (
        <div className="">
            {data && (
                <ul className="grid grid-cols-8 gap-5  mt-3 text-whiteMain font-poppins ">
                    {data.results.albummatches.album
                        .slice(0, 5)
                        .map((album, index) => {
                            return (
                                <AlbumImageByName
                                    albumName={album.name}
                                    artistName={album.artist}
                                />
                            );
                        })}
                </ul>
            )}
        </div>
    );
};

export default AlbumsSearch;
