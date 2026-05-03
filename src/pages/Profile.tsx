import { auth } from "../config/firebase";

const Profile = () => {
    const user = auth.currentUser;

    return (
        <div className="w-full flex flex-col items-center">
            <div className="w-full flex flex-col items-center mt-20">
                <div className="flex w-full gap-10 items-center">
                    <img
                        src={`${`${user?.photoURL}`.slice(0, -5)}s300-c`}
                        alt="Profile Picture"
                        className="max-w-[155px] rounded-full"
                    />
                    <div className="flex flex-col gap-3">
                        <h2 className="font-poppins text-4xl font-semibold leading-[120%] text-whiteMain">
                            {user?.displayName}
                        </h2>
                        <h3 className="font-poppins   text-whiteMain">«»</h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
