import { useEffect, useState } from "react";
import { FaSearch, FaTimes, FaUserPlus, FaPlus } from "react-icons/fa";

import Loader from "./Loader";
import ProfileAvatar from "./ProfileAvatar";
import { apiFetch } from "../services/apiFetch";
import API_URL from "../config/api";
import { useAuth } from "../context/useAuth";
import { showToast } from "../services/toastService";
import {
    VALIDATION_MESSAGES,
    validateEmail,
} from "../config/validationMessages";
import { EMPTY_STATE_MESSAGES } from "../config/emptyStateMessages";

function CreateSettingsPopup({
    selectedGroup,
    onClose,
    onGroupCreated,
    onMemberAdded,
    mode = "both",
}) {
    const { token } = useAuth();

    const [activeTab, setActiveTab] = useState(
        mode === "member" ? "member" : "group"
    );

    const [groupName, setGroupName] = useState("");
    const [description, setDescription] = useState("");

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [groupNameError, setGroupNameError] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape" && !loading && !searching) {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [onClose, loading, searching]);

    const handleCreateGroup = async (event) => {
        event.preventDefault();

        if (!groupName.trim()) {
            setGroupNameError(
                VALIDATION_MESSAGES.REQUIRED("Group name")
            );
            return;
        }
        setGroupNameError("");

        setLoading(true);

        try {
            const response = await apiFetch(`${API_URL}/group`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    groupName: groupName.trim(),
                    description: description.trim(),
                }),
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    data?.message || "Failed to create group"
                );
            }

            showToast("success", "Group created successfully");

            onGroupCreated?.(data);
            onClose();
        } catch (error) {
            showToast("error", error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchUsers = async () => {
        const validationError = validateEmail(email);
        if (validationError) {
            setEmailError(validationError);
            return;
        }
        setEmailError("");

        setSearching(true);
        setSelectedUser(null);

        try {
            const response = await apiFetch(
                `${API_URL}/users/search?email=${encodeURIComponent(
                    email.trim()
                )}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    data?.message || "Failed to search users"
                );
            }

            setUsers(Array.isArray(data) ? data : []);

            if (!data || data.length === 0) {
                showToast("info", EMPTY_STATE_MESSAGES.USERS);
            }
        } catch (error) {
            showToast("error", error.message);
        } finally {
            setSearching(false);
        }
    };

    const handleAddMember = async () => {
        if (!selectedGroup?.groupId) {
            showToast("warning", "Select a group first");
            return;
        }

        if (!selectedUser) {
            showToast("warning", "Select a user first");
            return;
        }

        setLoading(true);

        try {
            const response = await apiFetch(
                `${API_URL}/group/${selectedGroup.groupId}/members`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        email: selectedUser.email,
                    }),
                }
            );

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    data?.message || "Failed to add member"
                );
            }

            showToast(
                "success",
                `${selectedUser.name} added to the group`
            );

            onMemberAdded?.(data);
            onClose();
        } catch (error) {
            showToast("error", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="
                fixed
                inset-0
                z-[100]
                flex
                items-center
                justify-center

                bg-black/60
                backdrop-blur-sm

                px-4
            "
            onClick={!loading ? onClose : undefined}
        >
            <div
                className="
                    relative

                    w-full
                    max-w-2xl

                    max-h-[90vh]
                    overflow-y-auto

                    rounded-xl

                    border
                    border-zinc-700/50

                    bg-zinc-700/10
                    backdrop-blur-sm

                    shadow-2xl

                    px-5
                    py-5

                    sm:px-8
                    sm:py-6
                "
                onClick={(event) => event.stopPropagation()}
            >
                {loading && <Loader />}

                {/* CLOSE */}
                <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    aria-label="Close"
                    className="
                        absolute
                        top-4
                        right-4

                        w-8
                        h-8

                        rounded-full

                        flex
                        items-center
                        justify-center

                        text-zinc-500

                        hover:bg-zinc-800
                        hover:text-white

                        transition-all

                        disabled:opacity-50
                    "
                >
                    <FaTimes />
                </button>

                {/* TABS */}
                <div
                    className="
                        flex
                        items-center
                        gap-8

                        border-b
                        border-zinc-700

                        pr-10
                    "
                >
                    {mode !== "member" && (
                        <button
                            type="button"
                            onClick={() => setActiveTab("group")}
                            disabled={loading}
                            className={`
                            relative

                            pb-3

                            text-base
                            lg:text-lg

                            font-semibold

                            transition-all

                            ${
                                activeTab === "group"
                                    ? "text-white"
                                    : "text-zinc-500 hover:text-zinc-300"
                            }
                            `}
                        >
                            Add Group

                            {activeTab === "group" && (
                                <span
                                    className="
                                    absolute
                                    left-0
                                    right-0
                                    bottom-0

                                    h-0.5

                                    rounded-full

                                    bg-(--accent-400)
                                    "
                                />
                            )}
                        </button>
                    )}

                    {mode !== "group" && (
                        <button
                            type="button"
                            onClick={() => setActiveTab("member")}
                            disabled={loading}
                            className={`
                            relative

                            pb-3

                            text-base
                            lg:text-lg

                            font-semibold

                            transition-all

                            ${
                                activeTab === "member"
                                    ? "text-white"
                                    : "text-zinc-500 hover:text-zinc-300"
                            }
                            `}
                        >
                            Add member in group

                            {activeTab === "member" && (
                                <span
                                    className="
                                    absolute
                                    left-0
                                    right-0
                                    bottom-0

                                    h-0.5

                                    rounded-full

                                    bg-(--accent-400)
                                    "
                                />
                            )}
                        </button>
                    )}
                </div>

                {/* CONTENT */}
                <div className="mt-8">
                    {/* ADD GROUP */}
                    {activeTab === "group" && (
                        <form
                            onSubmit={handleCreateGroup}
                            noValidate
                            className="
                                flex
                                flex-col

                                min-h-[400px]
                            "
                        >
                            <div className="w-full max-w-xl mx-auto space-y-5">
                                <div>
                                    <label
                                        className="
                                            block
                                            mb-2

                                            text-sm
                                            font-medium
                                            text-zinc-300
                                        "
                                    >
                                        Group name
                                    </label>

                                    <input
                                        type="text"
                                        value={groupName}
                                        aria-invalid={Boolean(groupNameError)}
                                        required
                                        onChange={(event) => {
                                            setGroupName(
                                                event.target.value
                                            );
                                            setGroupNameError("");
                                        }}
                                        placeholder="Enter group name"
                                        disabled={loading}
                                        className="
                                            w-full
                                            h-11

                                            px-4

                                            rounded-lg

                                            bg-zinc-950
                                            border
                                            border-zinc-700

                                            text-sm
                                            text-white

                                            placeholder:text-zinc-600

                                            outline-none

                                            focus:border-(--accent-400)
                                            focus:ring-1
                                            focus:ring-(--accent-400)

                                            transition-all

                                            disabled:opacity-50
                                        "
                                    />
                                    <p className="min-h-5 text-sm text-red-400/80">
                                        {groupNameError || " "}
                                    </p>
                                </div>

                                <div>
                                    <label
                                        className="
                                            block
                                            mb-2

                                            text-sm
                                            font-medium
                                            text-zinc-300
                                        "
                                    >
                                        Description
                                    </label>

                                    <textarea
                                        value={description}
                                        onChange={(event) =>
                                            setDescription(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter group description"
                                        disabled={loading}
                                        rows={5}
                                        className="
                                            w-full

                                            px-4
                                            py-3

                                            rounded-lg

                                            bg-zinc-950
                                            border
                                            border-zinc-700

                                            text-sm
                                            text-white

                                            placeholder:text-zinc-600

                                            outline-none
                                            resize-none

                                            focus:border-(--accent-400)
                                            focus:ring-1
                                            focus:ring-(--accent-400)

                                            transition-all

                                            disabled:opacity-50
                                        "
                                    />
                                </div>
                            </div>

                            {/* ADD BUTTON */}
                            <div className="mt-auto pt-8 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="
                                        min-w-28

                                        h-10
                                        px-6

                                        rounded-lg

                                        flex
                                        items-center
                                        justify-center
                                        gap-2

                                        bg-(--accent-500)
                                        text-white

                                        font-semibold
                                        text-sm

                                        hover:bg-(--accent-600)

                                        active:scale-95

                                        transition-all

                                        disabled:opacity-50
                                        disabled:cursor-not-allowed
                                    "
                                >
                                    <FaPlus className="text-xs" />
                                    Add
                                </button>
                            </div>
                        </form>
                    )}

                    {/* ADD MEMBER */}
                    {activeTab === "member" && (
                        <div
                            className="
                                flex
                                flex-col

                                min-h-[400px]
                            "
                        >
                            {!selectedGroup ? (
                                <div
                                    className="
                                        flex
                                        flex-1
                                        items-center
                                        justify-center

                                        min-h-[300px]

                                        text-sm
                                        text-zinc-500
                                        text-center
                                    "
                                >
                                    Select a group first to add members.
                                </div>
                            ) : (
                                <>
                                    {/* CURRENT GROUP */}
                                    <div className="mb-5">
                                        <p
                                            className="
                                                text-xs
                                                text-zinc-500
                                                mb-1
                                            "
                                        >
                                            Adding member to
                                        </p>

                                        <p
                                            className="
                                                text-base
                                                font-semibold
                                                text-zinc-200
                                            "
                                        >
                                            {selectedGroup.groupName}
                                        </p>
                                    </div>

                                    {/* SEARCH */}
                                    <div className="flex gap-2">
                                        <input
                                            type="email"
                                            value={email}
                                            aria-invalid={Boolean(emailError)}
                                            required
                                            onChange={(event) => {
                                                setEmail(
                                                    event.target.value
                                                );
                                                setEmailError("");
                                            }}
                                            onKeyDown={(event) => {
                                                if (
                                                    event.key ===
                                                    "Enter"
                                                ) {
                                                    event.preventDefault();
                                                    handleSearchUsers();
                                                }
                                            }}
                                            placeholder="Search user by email"
                                            disabled={
                                                searching || loading
                                            }
                                            className="
                                                flex-1

                                                h-11

                                                px-4

                                                rounded-lg

                                                bg-zinc-950
                                                border
                                                border-zinc-700

                                                text-sm
                                                text-white

                                                placeholder:text-zinc-600

                                                outline-none

                                                focus:border-(--accent-400)
                                                focus:ring-1
                                                focus:ring-(--accent-400)

                                                transition-all
                                            "
                                        />

                                        <button
                                            type="button"
                                            onClick={handleSearchUsers}
                                            disabled={
                                                searching || loading
                                            }
                                            aria-label="Search users"
                                            className="
                                                shrink-0

                                                w-11
                                                h-11

                                                rounded-lg

                                                flex
                                                items-center
                                                justify-center

                                                bg-(--accent-500)
                                                text-white

                                                hover:bg-(--accent-600)

                                                active:scale-95

                                                transition-all

                                                disabled:opacity-50
                                            "
                                        >
                                            <FaSearch />
                                        </button>
                                    </div>
                                    <p className="min-h-5 text-sm text-red-400/80">
                                        {emailError || " "}
                                    </p>

                                    {/* SEARCH RESULTS */}
                                    <div className="mt-5 space-y-2">
                                        {users.map((user) => {
                                            const selected =
                                                selectedUser?.email ===
                                                user.email;

                                            return (
                                                <button
                                                    key={user.email}
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedUser(
                                                            user
                                                        )
                                                    }
                                                    className={`
                                                        w-full

                                                        p-3

                                                        rounded-lg

                                                        border

                                                        flex
                                                        items-center
                                                        justify-between

                                                        text-left

                                                        transition-all

                                                        ${
                                                            selected
                                                                ? `
                                                                    border-(--accent-400)
                                                                    bg-(--accent-400)/10
                                                                `
                                                                : `
                                                                    border-zinc-800
                                                                    bg-zinc-950
                                                                    hover:border-zinc-700
                                                                    hover:bg-zinc-900
                                                                `
                                                        }
                                                    `}
                                                >
                                                    <div className="flex min-w-0 flex-1 items-center gap-3">
                                                        <ProfileAvatar
                                                            user={user}
                                                            className="h-11 w-11 rounded-xl border-zinc-700 bg-zinc-800 text-sm"
                                                        />
                                                        <div className="min-w-0 flex-1">
                                                            <p
                                                                className="
                                                                    text-sm
                                                                    font-semibold
                                                                    text-zinc-200
                                                                "
                                                            >
                                                                {user.name}
                                                            </p>

                                                            <p
                                                                className="
                                                                    mt-0.5
                                                                    text-xs
                                                                    text-zinc-500
                                                                    truncate
                                                                "
                                                            >
                                                                {user.email}
                                                            </p>
                                                            <p className="mt-1 line-clamp-2 text-xs text-zinc-400">
                                                                {user.bio ||
                                                                    EMPTY_STATE_MESSAGES.BIO}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {selected && (
                                                        <FaUserPlus
                                                            className="
                                                                shrink-0
                                                                ml-3
                                                                text-(--accent-400)
                                                            "
                                                        />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* ADD BUTTON */}
                                    <div className="mt-auto pt-8 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={handleAddMember}
                                            disabled={
                                                !selectedUser ||
                                                loading
                                            }
                                            className="
                                                min-w-28

                                                h-10
                                                px-6

                                                rounded-lg

                                                flex
                                                items-center
                                                justify-center
                                                gap-2

                                                bg-(--accent-500)
                                                text-white

                                                font-semibold
                                                text-sm

                                                hover:bg-(--accent-600)

                                                active:scale-95

                                                transition-all

                                                disabled:opacity-50
                                                disabled:cursor-not-allowed
                                            "
                                        >
                                            <FaUserPlus className="text-xs" />
                                            Add
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CreateSettingsPopup;