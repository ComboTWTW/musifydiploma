import { useQuery } from "@tanstack/react-query";
import {
    getTopAlbums,
    type ArtistTopAlbumsT,
} from "../../api/last.fm/artist/getTopAlbums";
import { NavLink } from "react-router-dom";

interface Props {
    mbid: string;
}

const HeroAlbumsGrid = ({ mbid }: Props) => {
    const { data, isLoading, error } = useQuery<ArtistTopAlbumsT>({
        queryKey: ["getTopAlbums", mbid],
        queryFn: () => getTopAlbums(mbid),
        enabled: !!mbid,
    });

    if (error) {
        return <div className="text-red-500">Error</div>;
    }

    const album = data?.topalbums.album[0];

    return (
        <NavLink
            to={`/album?id=&artist=${album?.artist.name}&album=${album?.name}`}
            reloadDocument={true}
        >
            <img
                src={album?.image[3]["#text"]}
                alt={album?.name}
                className="w-full h-full object-cover rounded-md"
            />
        </NavLink>
    );
};

export default HeroAlbumsGrid;
