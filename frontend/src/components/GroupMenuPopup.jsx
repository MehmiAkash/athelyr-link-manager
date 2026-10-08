import { useState } from "react";
import {
    FaUsers,
    FaUserPlus,
    FaSignOutAlt,
    FaTrash,
    FaTimes,
} from "react-icons/fa";

import PopupCard from "./PopupCard";
import ConfirmationPopup from "./ConfirmationPopup";
import { deleteGroup, leaveGroup } from "../services/groupLinkService";
import { showToast } from "../services/toastService";

function GroupMenuPopup({
    onClose,
    onShowMembers,
    onAddMember,
    group,
    onGroupRemoved,
    currentUserRole,
    roleLoading = false,
}) {
    const [confirmation, setConfirmation] = useState(null);
    const [loading, setLoading] = useState(false);

    const canDelete = currentUserRole === "OWNER";
    const canLeave = currentUserRole === "ADMIN" || currentUserRole === "MEMBER";
    const canManageMembers =
        currentUserRole === "OWNER" || currentUserRole === "ADMIN";

    const handleLeave = () => {
        setConfirmation("leave");
    };

    const handleDelete = () => {
        setConfirmation("delete");
    };

    const handleConfirm = async () => {
        if (!confirmation || !group?.groupId) {
            return;
        }

        if (
            (confirmation === "leave" && !canLeave) ||
            (confirmation === "delete" && !canDelete)
        ) {
            return;
        }

        setLoading(true);
        try {
            if (confirmation === "leave") {
                await leaveGroup(group.groupId);
                showToast("success", "You left the group");
            } else if (canDelete) {
                await deleteGroup(group.groupId);
                showToast("success", "Group deleted successfully");
            } else {
                return;
            }

            onGroupRemoved?.(group.groupId);
            setConfirmation(null);
            onClose?.();
        } catch (error) {
            showToast("error", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <PopupCard
                onClose={onClose}
                maxWidth="max-w-sm"
            >
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-white text-xl font-semibold">
                        Group Options
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            w-8
                            h-8
                            rounded-full
                            flex
                            items-center
                            justify-center
                            text-zinc-400
                            hover:text-white
                            hover:bg-zinc-800
                            transition
                        "
                    >
                        <FaTimes />
                    </button>
                </div>

                <div className="space-y-2">
                    {canManageMembers && (
                        <button
                            type="button"
                            onClick={onAddMember}
                            className="
                                w-full
                                flex
                                items-center
                                gap-4
                                px-4
                                py-3
                                rounded-xl
                                text-left
                                text-zinc-300
                                hover:bg-zinc-800
                                hover:text-white
                                transition
                            "
                        >
                            <FaUserPlus className="text-(--accent-300)" />
                            <span>Add member</span>
                        </button>
                    )}

                    {/* SHOW MEMBERS */}
                    <button
                        type="button"
                        onClick={onShowMembers}
                        className="
                            w-full
                            flex
                            items-center
                            gap-4
                            px-4
                            py-3
                            rounded-xl
                            text-left
                            text-zinc-300
                            hover:bg-zinc-800
                            hover:text-white
                            transition
                        "
                    >
                        <FaUsers className="text-(--accent-300)" />

                        <span>
                            Show Members
                        </span>
                    </button>

                    {canDelete ? (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="
                                w-full
                                flex
                                items-center
                                gap-4
                                px-4
                                py-3
                                rounded-xl
                                text-left
                                text-red-400
                                hover:bg-red-400/10
                                transition
                            "
                        >
                            <FaTrash />
                            <span>Delete Group</span>
                        </button>
                    ) : canLeave ? (
                        <button
                            type="button"
                            onClick={handleLeave}
                            className="
                                w-full
                                flex
                                items-center
                                gap-4
                                px-4
                                py-3
                                rounded-xl
                                text-left
                                text-zinc-300
                                hover:bg-zinc-800
                                hover:text-white
                                transition
                            "
                        >
                            <FaSignOutAlt className="text-zinc-400" />
                            <span>Leave Group</span>
                        </button>
                    ) : roleLoading ? (
                        <p
                            role="status"
                            className="px-4 py-3 text-sm text-zinc-400"
                        >
                            Checking group permissions...
                        </p>
                    ) : null}
                </div>
            </PopupCard>

            {/* CONFIRMATION */}
            {confirmation === "leave" && (
                <ConfirmationPopup
                    loading={loading}
                    onClose={() => setConfirmation(null)}
                    onConfirm={handleConfirm}
                    title="Leave Group?"
                    message="Are you sure you want to leave this group?"
                />
            )}

            {confirmation === "delete" && (
                <ConfirmationPopup
                    loading={loading}
                    onClose={() => setConfirmation(null)}
                    onConfirm={handleConfirm}
                    title="Delete Group?"
                    message="Are you sure you want to permanently delete this group?"
                />
            )}
        </>
    );
}

export default GroupMenuPopup;