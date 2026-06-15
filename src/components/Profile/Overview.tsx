import MyLists from "./MyLists";
import { type UserT } from "../../functions/firebase/getUser";
import History from "./History";
import Follows from "./Follows";
import Comments from "../Comments/Comments";

interface Props {
    userData: UserT;
    isOwnProfile: boolean;
}

const Overview = ({ userData, isOwnProfile }: Props) => {
    return (
        <div className="flex flex-col ">
            <MyLists isOwnProfile={isOwnProfile} userData={userData} />
            <History userData={userData} />
            <Follows userId={userData.id} followType="followers" />
            <Follows userId={userData.id} followType="following" />
            <Comments />
        </div>
    );
};

export default Overview;
