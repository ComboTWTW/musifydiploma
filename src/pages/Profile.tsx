import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { auth } from "../config/firebase";

const Profile = () => {
    const user = auth.currentUser;

    const handleLogout = async () => {
        try {
            await signOut(auth);
            window.location.href = "/";
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <div className="w-full flex flex-col items-center">
            <div className="w-full flex flex-col items-center mt-20">
                <div className="flex w-full gap-10">
                    <img
                        src={`${`${user?.photoURL}`.slice(0, -5)}s300-c`}
                        alt="Profile Picture"
                        className="max-w-[155px] rounded-full"
                    />

                    <div className="flex flex-col gap-3">
                        <h2 className="font-poppins text-4xl font-semibold leading-[120%] text-whiteMain">
                            {user?.displayName}
                        </h2>

                        <h3 className="font-poppins text-whiteMain">«»</h3>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="border-red-700 max-w-[175px] border bg-transparent cursor-pointer rounded-[10px] text-whiteMain font-inter font-light py-3 px-9"
                >
                    Log out
                </button>
            </div>
        </div>
    );
};

export default Profile;
