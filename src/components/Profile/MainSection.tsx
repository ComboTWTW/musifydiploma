import MyLists from "./MyLists";
import { type UserT } from "../../functions/firebase/getUser";
import Overview from "./Overview";
import { useSearchParams } from "react-router-dom";
import History from "./History";
import ListView from "./ListView";

interface Props {
    userData: UserT;
}

const MainSection = ({ userData }: Props) => {
    const [searchParams] = useSearchParams();
    const sectionParam = searchParams.get("section");

    return (
        <div className="flex flex-col w-full">
            {(sectionParam === null || sectionParam === "overview") && (
                <Overview userData={userData} />
            )}
            {sectionParam === "myLists" && <MyLists userData={userData} />}
            {sectionParam === "history" && <History userData={userData} />}
            {sectionParam === "listView" && <ListView userData={userData} />}
        </div>
    );
};

export default MainSection;
