import { useState } from "react";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";

import { updateProfile } from "../services/profileService";
import { showToast } from "../services/toastService";

function ProfileDetails({ user, onUpdated }) {
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        name: user?.name || "",
        dob: user?.dob || "",
        bio: user?.bio || "",
    });

    const updateField = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const handleCancel = () => {
        setForm({
            name: user?.name || "",
            dob: user?.dob || "",
            bio: user?.bio || "",
        });
        setEditing(false);
    };

    const handleSave = async (event) => {
        event.preventDefault();
        if (!form.name.trim()) {
            showToast("error", "Name is required.");
            return;
        }

        setSaving(true);
        try {
            const updatedProfile = await updateProfile({
                name: form.name.trim(),
                dob: form.dob || null,
                bio: form.bio.trim(),
            });
            onUpdated(updatedProfile);
            setEditing(false);
            showToast("success", "Profile updated");
        } catch (error) {
            showToast("error", error.message);
        } finally {
            setSaving(false);
        }
    };

    const fieldClass =
        "mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-base text-white outline-none focus:border-(--accent-400)";

    return (
        <section className="flex min-w-0 flex-col rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-semibold text-white">
                        Personal information
                    </h2>
                    <p className="mt-1 text-base text-zinc-400">
                        Manage the information on your account.
                    </p>
                </div>
                {!editing && (
                    <button
                        type="button"
                        onClick={() => setEditing(true)}
                        className="flex shrink-0 items-center gap-2 rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-200 transition hover:bg-zinc-800"
                    >
                        <FaEdit />
                        Edit
                    </button>
                )}
            </div>

            <form onSubmit={handleSave} className="flex min-h-0 flex-1 flex-col space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="flex flex-1 flex-col text-base text-zinc-300">
                        Full name
                        <input
                            type="text"
                            value={editing ? form.name : user?.name || ""}
                            readOnly={!editing}
                            onChange={(event) =>
                                updateField("name", event.target.value)
                            }
                            className={fieldClass}
                        />
                    </label>
                    <label className="block text-base text-zinc-300">
                        Email
                        <input
                            type="email"
                            value={user?.email || ""}
                            readOnly
                            className={`${fieldClass} cursor-not-allowed text-zinc-500`}
                        />
                    </label>
                    <label className="block text-base text-zinc-300">
                        Date of birth
                        <input
                            type="date"
                            value={editing ? form.dob : user?.dob || ""}
                            readOnly={!editing}
                            onChange={(event) =>
                                updateField("dob", event.target.value)
                            }
                            className={fieldClass}
                        />
                    </label>
                </div>
                <label className="flex min-h-0 flex-1 flex-col text-base text-zinc-300">
                    Bio
                    <textarea
                        rows="4"
                        value={editing ? form.bio : user?.bio || ""}
                        readOnly={!editing}
                        onChange={(event) =>
                            updateField("bio", event.target.value)
                        }
                        placeholder="Add a short bio"
                        className={`${fieldClass} min-h-32 flex-1 resize-y`}
                    />
                </label>
                {editing && (
                    <div className="flex flex-wrap justify-end gap-2 pt-1">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={saving}
                            className="flex items-center gap-2 rounded-full px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800 disabled:opacity-50"
                        >
                            <FaTimes />
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 rounded-full bg-(--accent-500) px-5 py-2 text-sm font-medium text-white transition hover:bg-(--accent-600) disabled:opacity-50"
                        >
                            <FaSave />
                            {saving ? "Saving..." : "Save changes"}
                        </button>
                    </div>
                )}
            </form>
        </section>
    );
}

export default ProfileDetails;
