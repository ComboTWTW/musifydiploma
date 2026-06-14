import React, { useState } from "react";
import { profileSideBarLinks } from "../../constants/constValues";
import { NavLink, useSearchParams } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";

interface Props {
    sideBarLink: string;
    setSideBarLink: React.Dispatch<React.SetStateAction<string>>;
}

const ProfileSidebar = ({ sideBarLink, setSideBarLink }: Props) => {
    const [searchParams] = useSearchParams();
    const sectionParam = searchParams.get("section");

    const handleLogout = async () => {
        try {
            await signOut(auth);
            window.location.href = "/";
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <div className="">
            <ul className="flex flex-col gap-10">
                {profileSideBarLinks.map((link, index) => {
                    return (
                        <NavLink
                            key={link.linkTo}
                            reloadDocument
                            to={`${link.linkTo === "favorites" ? `/profile?section=listView&id=${auth.currentUser?.uid}&listName=Favorites&show=artists` : `/profile?section=${link.linkTo}&id=${auth.currentUser?.uid}`}`}
                            className={`capitalize text-3xl font-poppins font-semibold hover:text-purpleMain ${link.linkTo === sectionParam ? "text-purpleMain underline-offset-8 underline " : "text-white"}`}
                            onClick={() => setSideBarLink(() => link.linkTo)}
                        >
                            <li>{link.title}</li>
                        </NavLink>
                    );
                })}
            </ul>
            <button
                onClick={handleLogout}
                className="border-red-700 max-w-[175px] mt-20 border bg-transparent cursor-pointer rounded-[10px] text-whiteMain font-inter font-light py-3 px-9"
            >
                Log out
            </button>
        </div>
    );
};

export default ProfileSidebar;
