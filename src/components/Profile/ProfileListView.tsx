import { useSearchParams } from "react-router-dom";
import type { UserT } from "../../functions/firebase/getUser";

interface Props {
    userData: UserT;
}

const ProfileListView = ({ userData }: Props) => {
    const [searchParams] = useSearchParams();

    const listName = searchParams.get("list");

    const selectedList = userData.lists.find((list) => list.name === listName);

    if (!selectedList) {
        return (
            <div className="text-whiteMain font-poppins">List not found</div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-poppins text-4xl font-semibold text-whiteMain">
                        {selectedList.name}
                    </h2>

                    <p className="font-poppins text-[#A0A0B0] mt-1">
                        {selectedList.items.length} items
                    </p>
                </div>
            </div>

            {/* ITEMS */}
            <ul className="flex flex-col gap-3">
                {selectedList.items.map((item, index) => (
                    <li
                        key={item.id}
                        className="flex items-center gap-4 bg-[#1E1E26] hover:bg-[#252532] transition rounded-xl p-3"
                    >
                        {/* INDEX */}
                        <span className="w-[25px] text-[#8B5CF6] font-poppins">
                            {index + 1}
                        </span>

                        {/* IMAGE */}
                        <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-[70px] h-[70px] object-cover rounded-lg"
                        />

                        {/* INFO */}
                        <div className="flex flex-col">
                            <h3 className="font-poppins text-whiteMain text-lg font-medium">
                                {item.title}
                            </h3>

                            <p className="font-poppins text-[#A0A0B0] text-sm capitalize">
                                {item.title}
                            </p>
                        </div>

                        {/* DATE */}
                        <div className="ml-auto">
                            <p className="font-poppins text-sm text-[#808090]">
                                {item.createdAt?.seconds
                                    ? new Date(
                                          item.createdAt.seconds * 1000,
                                      ).toLocaleDateString()
                                    : "Recently"}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProfileListView;
