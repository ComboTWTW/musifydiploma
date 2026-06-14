import MyLists from "./MyLists";
import { type UserT } from "../../functions/firebase/getUser";
import Overview from "./Overview";
import { useSearchParams } from "react-router-dom";
import History from "./History";

interface Props {
    userData: UserT;
}

const MainSection = ({ userData }: Props) => {
    const [searchParams] = useSearchParams();
    const sectionParam = searchParams.get("section");
    console.log(sectionParam);
    return (
        <div className="flex flex-col w-full">
            {(sectionParam === null || sectionParam === "overview") && (
                <Overview userData={userData} />
            )}
            {sectionParam === "myLists" && <MyLists userData={userData} />}
            {sectionParam === "history" && <History userData={userData} />}
        </div>
    );
};

export default MainSection;
