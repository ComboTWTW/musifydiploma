import MyLists from "./MyLists";
import { type UserT } from "../../functions/firebase/getUser";
import History from "./History";
import Follows from "./Follows";
import Comments from "../Comments/Comments";

interface Props {
    userData: UserT;
}

const Overview = ({ userData }: Props) => {
    return (
        <div className="flex flex-col ">
            <MyLists userData={userData} />
            <History userData={userData} />
            <Follows userId={userData.id} followType="followers" />
            <Follows userId={userData.id} followType="following" />
            <Comments />
        </div>
    );
};

export default Overview;
