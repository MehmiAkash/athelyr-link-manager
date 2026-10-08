import { useEffect, useState } from "react";
import LogoutPopup from "../../components/LogoutPopup";
import ProfileDetails from "../../components/ProfileDetails";
import ProfileImageUpload from "../../components/ProfileImageUpload";
import { useAuth } from "../../context/useAuth";
import { getProfile } from "../../services/profileService";
import { showToast } from "../../services/toastService";

function ProfilePage() {
    const { user, updateUser } = useAuth();
    const [profile, setProfile] = useState(user);
    const [loading, setLoading] = useState(!user);
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);

    useEffect(() => {
        let isCurrent = true;
        getProfile()
            .then((data) => {
                if (isCurrent) {
                    setProfile(data);
                    updateUser(data);
                }
            })
            .catch((error) => {
                if (isCurrent) {
                    showToast("error", error.message);
                }
            })
            .finally(() => {
                if (isCurrent) {
                    setLoading(false);
                }
            });

        return () => {
            isCurrent = false;
        };
    }, [updateUser]);

    const handleProfileUpdated = (updatedProfile) => {
        setProfile(updatedProfile);
        updateUser(updatedProfile);
    };

    return (
        <main className="w-full min-w-0 px-4 pb-8 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-16">
            {loading ? (
                <p className="rounded-2xl border border-zinc-800 bg-zinc-900/70 py-10 text-center text-sm text-zinc-500">
                    Loading profile...
                </p>
            ) : (
                <div className="grid min-w-0 gap-4 lg:min-h-[calc(100vh-8rem)] lg:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.5fr)] xl:gap-6">
                    <section className="flex min-w-0 flex-col items-center justify-between gap-6 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 sm:p-6 lg:p-8">
                        <div className="flex flex-col items-center gap-5">
                            <ProfileImageUpload
                                user={profile}
                                onUploaded={handleProfileUpdated}
                            />
                            <div className="min-w-0 text-center">
                                <h2 className="break-words text-2xl font-semibold text-white">
                                    {profile?.name || "Your profile"}
                                </h2>
                                <p className="mt-1 break-all text-base text-zinc-300">
                                    {profile?.email}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowLogoutPopup(true)}
                            className="w-full border-t border-zinc-800 pt-4 text-center text-base font-medium text-red-700 transition hover:text-red-500"
                        >
                            Logout
                        </button>
                    </section>
                    <ProfileDetails
                        user={profile}
                        onUpdated={handleProfileUpdated}
                    />
                </div>
            )}
            {showLogoutPopup && (
                <LogoutPopup onClose={() => setShowLogoutPopup(false)} />
            )}
        </main>
    );
}

export default ProfilePage;
