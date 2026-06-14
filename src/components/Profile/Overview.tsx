import MyLists from "./MyLists";
import { type UserT } from "../../functions/firebase/getUser";
import History from "./History";

interface Props {
    userData: UserT;
}

const Overview = ({ userData }: Props) => {
    return (
        <div className="flex flex-col ">
            <MyLists userData={userData} />
            <History userData={userData} />
        </div>
    );
};

export default Overview;
