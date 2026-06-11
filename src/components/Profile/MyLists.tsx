import { NavLink } from "react-router-dom";
import type { UserT } from "../../functions/firebase/getUser";

interface Props {
    userData: UserT;
}

const MyLists = ({ userData }: Props) => {
    return (
        <div className="w-full flex flex-col gap-5">
            <h2 className="font-poppins text-4xl leading-[120%] text-whiteMain font-semibold">
                My Lists
            </h2>

            <ul className="flex gap-8 flex-wrap">
                {userData.lists.map((list) => {
                    const previewItems = [...list.items];

                    while (previewItems.length < 4) {
                        previewItems.push(null as never);
                    }

                    return (
                        <li key={list.id} className="flex flex-col gap-3">
                            <NavLink
                                to={`/profile?list=${encodeURIComponent(
                                    list.name,
                                )}`}
                                className="flex flex-col gap-3"
                            >
                                {/* 2x2 GRID */}
                                <div className="grid grid-cols-2 w-[220px] h-[220px] overflow-hidden">
                                    {previewItems
                                        .slice(0, 4)
                                        .map((item, index) => (
                                            <div
                                                key={index}
                                                className="w-full h-full bg-[#3A3A46]"
                                            >
                                                {item && (
                                                    <img
                                                        src={item.imageUrl}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover hover:scale-105 transition"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                </div>

                                {/* LIST NAME */}
                                <h3 className="font-poppins text-xl text-whiteMain leading-[120%]">
                                    {list.name}
                                </h3>
                            </NavLink>
                        </li>
                    );
                })}
            </ul>

            <NavLink
                to="/"
                className="mt-5 font-poppins font-medium text-xl underline-offset-4 underline text-whiteMain text-end"
            >
                View and Manage All Lists... {`>`}
            </NavLink>
        </div>
    );
};

export default MyLists;
