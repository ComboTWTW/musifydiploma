import { useQuery } from "@tanstack/react-query";
import {
    getSearchAlbumMbid,
    type SearchAlbumMbidT,
} from "../../api/last.fm/album/searchAlbumMbid";
import {
    getAlbumInfoByMbid,
    type albumInfoByMbidT,
} from "../../api/last.fm/album/getAlbumInfoByMbid";
import { useEffect } from "react";
import AlbumImage from "./AlbumImage";

interface Props {
    albumName: string;
    artistName: string;
}

const AlbumImageByName = ({ albumName, artistName }: Props) => {
    const { data: searchData, refetch: refetchAlbumSearchByName } =
        useQuery<SearchAlbumMbidT>({
            queryKey: ["albumSearch", artistName, albumName],
            queryFn: () => getSearchAlbumMbid(artistName, albumName),
            enabled: !!albumName && !!artistName,
        });
    useEffect(() => {
        refetchAlbumSearchByName();
    }, []);

    return searchData !== undefined && <AlbumImage AlbumByName={searchData} />;
};

export default AlbumImageByName;
