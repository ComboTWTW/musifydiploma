import { useQuery } from "@tanstack/react-query";
import {
    getTopAlbums,
    type ArtistTopAlbumsT,
} from "../../api/last.fm/artist/getTopAlbums";

interface Props {
    mbid: string;
}

const SimilarArtistsPicture = ({ mbid }: Props) => {
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
        <img
            src={album?.image[3]["#text"]}
            alt={album?.name}
            className="w-full h-full  rounded-md"
        />
    );
};

export default SimilarArtistsPicture;
