import { useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import type { UserT } from "../../functions/firebase/getUser";

interface Props {
    userData: UserT;
}

const MyLists = ({ userData }: Props) => {
    const [searchParams] = useSearchParams();
    const sectionParam = searchParams.get("section");

    const [showInput, setShowInput] = useState(false);
    const [listName, setListName] = useState("");

    const createList = async () => {
        const user = auth.currentUser;
        if (!user || !listName.trim()) return;

        const userRef = doc(db, "Users", user.uid);
        const snap = await getDoc(userRef);

        if (!snap.exists()) return;

        const data = snap.data();
        const existingLists = data.lists || [];

        const newList = {
            id: crypto.randomUUID(),
            name: listName.trim(),
            visibility: "private",
            items: [],
        };

        const updated = [...existingLists, newList];

        await updateDoc(userRef, {
            lists: updated,
        });

        setListName("");
        setShowInput(false);
    };

    return (
        <div className="flex flex-col gap-5">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h2 className="font-poppins text-4xl leading-[120%] text-whiteMain font-semibold">
                    My Lists
                </h2>

                {/* CREATE BUTTON */}
                {showInput ? (
                    <div
                        className={`flex items-center gap-2 ${sectionParam !== "myLists" && "hidden"}`}
                    >
                        <input
                            value={listName}
                            onChange={(e) => setListName(e.target.value)}
                            placeholder="List name..."
                            className="bg-[#2A2A35] text-whiteMain px-3 py-2 rounded-lg outline-none"
                        />

                        <button
                            onClick={createList}
                            className="bg-purpleMain text-white px-3 py-2 rounded-lg"
                        >
                            Create
                        </button>

                        <button
                            onClick={() => {
                                setShowInput(false);
                                setListName("");
                            }}
                            className="text-red-500 px-2"
                        >
                            ✕
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowInput(true)}
                        className={`border border-purpleMain text-purpleMain px-4 py-2 rounded-lg ${sectionParam !== "myLists" && "hidden"}`}
                    >
                        + Create List
                    </button>
                )}
            </div>

            {/* LISTS */}
            <ul className="flex gap-8 flex-wrap">
                {userData.lists
                    .slice(
                        0,
                        sectionParam === "overview" ? 4 : userData.lists.length,
                    )
                    .map((list) => {
                        const previewItems = [...list.items];

                        while (previewItems.length < 4) {
                            previewItems.push(null as any);
                        }

                        return (
                            <li key={list.id} className="flex flex-col gap-3">
                                <NavLink
                                    to={`/profile?section=listView&listName=${encodeURIComponent(
                                        list.name,
                                    )}&show=artists`}
                                    className="flex flex-col gap-3"
                                    reloadDocument
                                >
                                    {/* GRID */}
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
                                                            className="w-full h-full object-cover"
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                    </div>

                                    {/* NAME */}
                                    <h3 className="font-poppins text-xl text-whiteMain">
                                        {list.name}
                                    </h3>
                                </NavLink>
                            </li>
                        );
                    })}
            </ul>

            {/* FOOTER LINK */}
            <NavLink
                to={`/profile?section=myLists`}
                className={`mt-5 font-poppins font-medium text-xl underline-offset-4 underline text-whiteMain text-end ${
                    sectionParam === "myLists" && "hidden"
                }`}
            >
                View All Lists... {`>`}
            </NavLink>
        </div>
    );
};

export default MyLists;
