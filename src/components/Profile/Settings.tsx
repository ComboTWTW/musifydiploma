import { useEffect, useState } from "react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import { useNavigate, useSearchParams } from "react-router-dom";

import { auth, db } from "../../config/firebase";
import type { UserT } from "../../functions/firebase/getUser";

interface Props {
    userData: UserT;
}

const Settings = ({ userData }: Props) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const profileId = searchParams.get("id"); // 👈 profile being viewed
    const currentUser = auth.currentUser;

    // 🔒 SECURITY CHECK
    const isOwner = currentUser?.uid === profileId;

    const [name, setName] = useState(userData.name);
    const [status, setStatus] = useState(userData.status);

    const [profileVisibility, setProfileVisibility] = useState<
        "public" | "private"
    >(userData.profileVisibility || "public");

    const [saving, setSaving] = useState(false);

    // 🔄 sync when switching users
    useEffect(() => {
        setName(userData.name);
        setStatus(userData.status);
        setProfileVisibility(userData.profileVisibility || "public");
    }, [userData]);

    // 🚫 BLOCK ACCESS IF NOT OWNER
    if (!isOwner) {
        return (
            <div className="text-red-500 font-poppins text-xl">
                You don’t have permission to access these settings.
            </div>
        );
    }

    const saveSettings = async () => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            setSaving(true);

            await updateDoc(doc(db, "Users", user.uid), {
                name,
                usernameLower: name.toLowerCase(),
                status,
                profileVisibility,
            });

            alert("Settings updated successfully.");
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
            alert("You may need to re-authenticate before deleting account.");
        }
    };

    return (
        <div className="flex flex-col gap-8 w-full max-w-[700px] font-poppins">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h2 className="text-4xl text-whiteMain font-semibold">
                    Settings
                </h2>
            </div>

            {/* USERNAME */}
            <div className="flex flex-col gap-2">
                <label className="text-whiteMain">Username</label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-[#2A2A35] text-whiteMain rounded-lg px-4 py-3 outline-none"
                />
            </div>

            {/* STATUS */}
            <div className="flex flex-col gap-2">
                <label className="text-whiteMain">Status</label>
                <textarea
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    rows={4}
                    className="bg-[#2A2A35] text-whiteMain rounded-lg px-4 py-3 outline-none resize-none"
                />
            </div>

            {/* VISIBILITY */}
            <div className="flex flex-col gap-3">
                <label className="text-whiteMain">Profile Visibility</label>

                <div className="flex gap-3">
                    <button
                        onClick={() => setProfileVisibility("public")}
                        className={`px-4 py-2 rounded-lg ${
                            profileVisibility === "public"
                                ? "bg-green-600 text-white"
                                : "bg-[#2A2A35] text-whiteMain"
                        }`}
                    >
                        Public
                    </button>

                    <button
                        onClick={() => setProfileVisibility("private")}
                        className={`px-4 py-2 rounded-lg ${
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
                className="bg-purpleMain text-white rounded-lg px-5 py-3 w-fit hover:opacity-90"
            >
                {saving ? "Saving..." : "Save Changes"}
            </button>

            {/* DELETE */}
            <div className="mt-8 pt-8 border-t border-[#3A3A46]">
                <h3 className="text-red-500 text-2xl mb-4">Danger Zone</h3>

                <button
                    onClick={handleDeleteAccount}
                    className="bg-red-700 hover:bg-red-600 text-white rounded-lg px-5 py-3"
                >
                    Delete Account
                </button>
            </div>
        </div>
    );
};

export default Settings;
