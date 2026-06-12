import { useEffect } from "react";
import {
    getAlbumInfoByMbid,
    type albumInfoByMbidT,
} from "../../api/last.fm/album/getAlbumInfoByMbid";
import { useQuery } from "@tanstack/react-query";
import type { SearchAlbumMbidT } from "../../api/last.fm/album/searchAlbumMbid";
import { NavLink } from "react-router-dom";
interface Props {
    AlbumByName: SearchAlbumMbidT;
}
const AlbumImage = ({ AlbumByName }: Props) => {
    const mbid = AlbumByName.album.mbid;

    console.log("Current MBID:", mbid);

    const { data: albumData } = useQuery<albumInfoByMbidT>({
        queryKey: ["albumInfo", mbid],
        queryFn: () => getAlbumInfoByMbid(mbid),
        enabled: !!mbid,
    });

    useEffect(() => {
        if (albumData) {
            console.log("Album info:", albumData);
        }
    }, [albumData]);

    return (
        <NavLink
            reloadDocument
            to={`/album?id=${mbid}&name=${albumData?.album.name}`}
            className={`flex flex-col gap-3 ${mbid === "" && "hidden"}`}
        >
            <div className=" flex flex-col gap-2">
                <img
                    src={albumData?.album.image[3]["#text"]}
                    alt={albumData?.album.name}
                    className="w-full h-full  rounded-md"
                />
                <p>{albumData?.album.artist}</p>
                <p>{albumData?.album.name}</p>
            </div>
        </NavLink>
    );
};

export default AlbumImage;
