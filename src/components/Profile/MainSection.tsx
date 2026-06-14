import MyLists from "./MyLists";
import { type UserT } from "../../functions/firebase/getUser";
import Overview from "./Overview";
import { useSearchParams } from "react-router-dom";
import History from "./History";
import ListView from "./ListView";
import Settings from "./Settings";

interface Props {
    userData: UserT;
    isOwnProfile: boolean;
}

const MainSection = ({ userData, isOwnProfile }: Props) => {
    const [searchParams] = useSearchParams();
    const sectionParam = searchParams.get("section");

    return (
        <div className="flex flex-col w-full">
            {(sectionParam === null || sectionParam === "overview") && (
                <Overview userData={userData} />
            )}

            {sectionParam === "myLists" && (
                <MyLists userData={userData} isOwnProfile={isOwnProfile} />
            )}

            {sectionParam === "history" && <History userData={userData} />}

            {sectionParam === "listView" && <ListView userData={userData} />}

            {sectionParam === "settings" && <Settings userData={userData} />}
        </div>
    );
};

export default MainSection;
