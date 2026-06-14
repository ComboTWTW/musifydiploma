import { useState } from "react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { deleteUser } from "firebase/auth";

import { auth, db } from "../../config/firebase";
import type { UserT } from "../../functions/firebase/getUser";

interface Props {
    userData: UserT;
}

const Settings = ({ userData }: Props) => {
    const [name, setName] = useState(userData.name);
    const [status, setStatus] = useState(userData.status);

    const [profileVisibility, setProfileVisibility] = useState<
        "public" | "private"
    >(userData.profileVisibility || "public");

    const [saving, setSaving] = useState(false);

    const saveSettings = async () => {
        const user = auth.currentUser;

        if (!user) return;

        try {
            setSaving(true);

            await updateDoc(doc(db, "Users", user.uid), {
                name,
                status,
                profileVisibility,
            });

            alert("Settings saved.");
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        const user = auth.currentUser;

        if (!user) return;

        const confirmed = window.confirm(
            "Are you sure you want to permanently delete your account?",
        );

        if (!confirmed) return;

        try {
            await deleteDoc(doc(db, "Users", user.uid));

            await deleteUser(user);

            window.location.href = "/";
        } catch (error) {
            console.error(error);

            alert(
                "Google may require recent authentication before account deletion.",
            );
        }
    };

    return (
        <div className="flex flex-col gap-8 w-full max-w-[700px] font-poppins">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h2 className="font-poppins text-4xl leading-[120%] text-whiteMain font-semibold">
                    Settings
                </h2>
            </div>

            {/* USERNAME */}
            <div className="flex flex-col gap-2">
                <label className="text-whiteMain font-poppins">Username</label>

                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="
                        bg-[#2A2A35]
                        text-whiteMain
                        rounded-lg
                        px-4
                        py-3
                        outline-none
                        font-poppins
                    "
                />
            </div>

            {/* STATUS */}
            <div className="flex flex-col gap-2">
                <label className="text-whiteMain font-poppins">Status</label>

                <textarea
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    rows={4}
                    className="
                        bg-[#2A2A35]
                        text-whiteMain
                        rounded-lg
                        px-4
                        py-3
                        outline-none
                        resize-none
                        font-poppins
                    "
                />
            </div>

            {/* VISIBILITY */}
            <div className="flex flex-col gap-3">
                <label className="text-whiteMain font-poppins">
                    Profile Visibility
                </label>

                <div className="flex gap-3">
                    <button
                        onClick={() => setProfileVisibility("public")}
                        className={`px-4 py-2 rounded-lg font-poppins transition ${
                            profileVisibility === "public"
                                ? "bg-green-600 text-white"
                                : "bg-[#2A2A35] text-whiteMain"
                        }`}
                    >
                        Public
                    </button>

                    <button
                        onClick={() => setProfileVisibility("private")}
                        className={`px-4 py-2 rounded-lg font-poppins transition ${
                            profileVisibility === "private"
                                ? "bg-purpleMain text-white"
                                : "bg-[#2A2A35] text-whiteMain"
                        }`}
                    >
                        Private
                    </button>
                </div>
            </div>

            {/* SAVE */}
            <button
                onClick={saveSettings}
                disabled={saving}
                className="
                    bg-purpleMain
                    text-white
                    rounded-lg
                    px-5
                    py-3
                    w-fit
                    font-poppins
                    hover:opacity-90
                    transition
                "
            >
                {saving ? "Saving..." : "Save Changes"}
            </button>

            {/* DELETE ACCOUNT */}
            <div className="mt-8 pt-8 border-t border-[#3A3A46]">
                <h3 className="text-red-500 font-poppins text-2xl mb-4">
                    Danger Zone
                </h3>

                <button
                    onClick={handleDeleteAccount}
                    className="
                        bg-red-700
                        hover:bg-red-600
                        text-white
                        rounded-lg
                        px-5
                        py-3
                        font-poppins
                    "
                >
                    Delete Account
                </button>
            </div>
        </div>
    );
};

export default Settings;
