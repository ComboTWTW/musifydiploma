import MyLists from "./MyLists";
import { type UserT } from "../../functions/firebase/getUser";
import History from "./History";

interface Props {
    userData: UserT;
}

const Overview = ({ userData }: Props) => {
    return (
        <div className="flex flex-col ">
            <History userData={userData} />
            <MyLists userData={userData} />
        </div>
    );
};

export default Overview;
