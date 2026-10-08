import { useEffect, useState } from "react";
import PopupCard from "./PopupCard";
import ConfirmationPopup from "./ConfirmationPopup";
import ProfileAvatar from "./ProfileAvatar";
import {
    FaCalendarAlt,
    FaChevronDown,
    FaEnvelope,
    FaInfoCircle,
    FaSearch,
    FaTrash,
    FaTimes,
    FaUsers,
} from "react-icons/fa";
import {
    getGroupMembers,
    removeGroupMember,
    updateGroupMemberRole,
} from "../services/groupLinkService";
import { showToast } from "../services/toastService";
import { EMPTY_STATE_MESSAGES } from "../config/emptyStateMessages";

function GroupMembersPopup({
    group,
    onClose,
    currentUserRole = "ADMIN",
}) {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedMemberId, setSelectedMemberId] = useState(null);
    const [openRoleMenu, setOpenRoleMenu] = useState(null);

    const [confirmation, setConfirmation] = useState(null);

    useEffect(() => {
        let isCurrent = true;

        getGroupMembers(group.groupId)
            .then((data) => {
                if (isCurrent) {
                    setMembers(data?.groupMembersDTOList ?? []);
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
    }, [group.groupId]);

    const canManageMembers =
        currentUserRole === "ADMIN" ||
        currentUserRole === "OWNER";
    const canManageRoles = currentUserRole === "OWNER";
    const normalizedSearchQuery = searchQuery.trim().toLocaleLowerCase();
    const filteredMembers = members.filter((member) =>
        [member.name, member.email, member.role]
            .filter(Boolean)
            .some((value) =>
                value.toLocaleLowerCase().includes(normalizedSearchQuery)
            )
    );
    const selectedMember =
        members.find((member) => member.memberId === selectedMemberId) ?? null;

    const handleRoleClick = (member) => {
        if (!canManageRoles) return;

        setOpenRoleMenu(
            openRoleMenu === member.memberId
                ? null
                : member.memberId
        );
    };

    const requestRoleChange = (member, newRole) => {
        setOpenRoleMenu(null);

        if (member.role === newRole) return;

        setConfirmation({
            type: "role",
            member,
            newRole,
        });
    };

    const requestDelete = (member) => {
        setConfirmation({
            type: "delete",
            member,
        });
    };

    const handleConfirm = async () => {
        if (!confirmation) return;

        setIsSaving(true);
        try {
            if (confirmation.type === "role") {
                await updateGroupMemberRole(
                    group.groupId,
                    confirmation.member.email,
                    confirmation.newRole
                );
                setMembers((currentMembers) =>
                    currentMembers.map((member) =>
                        member.memberId === confirmation.member.memberId
                            ? {
                                  ...member,
                                  role: confirmation.newRole,
                              }
                            : member
                    )
                );
                showToast("success", "Member role updated");
            } else {
                await removeGroupMember(
                    group.groupId,
                    confirmation.member.email
                );
                setMembers((currentMembers) =>
                    currentMembers.filter(
                        (member) =>
                            member.memberId !==
                            confirmation.member.memberId
                    )
                );
                setSelectedMemberId((currentId) =>
                    currentId === confirmation.member.memberId
                        ? null
                        : currentId
                );
                showToast("success", "Member removed from group");
            }

            setConfirmation(null);
        } catch (error) {
            showToast("error", error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const getRoleStyles = (role) => {
        if (role === "OWNER") {
            return "border-amber-400/20 bg-amber-400/10 text-amber-300";
        }

        if (role === "ADMIN") {
            return "border-(--accent-500)/25 bg-(--accent-500)/10 text-(--accent-300)";
        }

        return "border-zinc-700 bg-zinc-800/80 text-zinc-300";
    };

    return (
        <>
            <PopupCard
                onClose={isSaving ? undefined : onClose}
                maxWidth="max-w-3xl"
                panelClassName="flex max-h-[90vh] min-h-[min(70vh,40rem)] flex-col !px-4 sm:!px-6"
            >
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-(--accent-500)/20 bg-(--accent-500)/10 text-(--accent-300)">
                            <FaUsers aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-lg font-semibold text-white sm:text-xl">
                                    Group Members
                                </h2>
                                {!loading && (
                                    <span className="rounded-full border border-zinc-700 bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-300">
                                        {members.length}
                                    </span>
                                )}
                            </div>
                            <p className="mt-1 text-xs text-zinc-400 sm:text-sm">
                                {group.groupName
                                    ? `People in ${group.groupName}`
                                    : "Manage this group's members"}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                        aria-label="Close group members"
                        className="
                            flex h-9 w-9 shrink-0
                            rounded-xl
                            items-center
                            justify-center
                            text-zinc-400
                            hover:text-white
                            hover:bg-zinc-800
                            transition-colors
                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-(--accent-400)
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        <FaTimes />
                    </button>
                </div>

                <label className="mb-4 flex h-11 items-center gap-3 rounded-xl border border-zinc-700/80 bg-zinc-900/70 px-3.5 text-zinc-400 transition-colors focus-within:border-(--accent-400)/60 focus-within:ring-2 focus-within:ring-(--accent-500)/15">
                    <FaSearch className="shrink-0 text-sm" aria-hidden="true" />
                    <span className="sr-only">Search group members</span>
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Search by name, email, or role"
                        className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            aria-label="Clear member search"
                            className="rounded-md p-1 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent-400)"
                        >
                            <FaTimes size={12} aria-hidden="true" />
                        </button>
                    )}
                </label>

                <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)]">
                <div
                    className="
                        min-h-0
                        max-h-[35vh]
                        space-y-2
                        overflow-y-auto
                        pr-2
                        lg:max-h-none
                        [&::-webkit-scrollbar]:w-1.5
                        [&::-webkit-scrollbar-track]:rounded-full
                        [&::-webkit-scrollbar-track]:bg-zinc-950
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        [&::-webkit-scrollbar-thumb]:bg-zinc-700
                        [&::-webkit-scrollbar-thumb:hover]:bg-zinc-600
                    "
                    style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "#3f3f46 #09090b",
                    }}
                >
                    {loading ? (
                        <div className="space-y-2" aria-label="Loading members">
                            {Array.from({ length: 4 }, (_, index) => (
                                <div
                                    key={index}
                                    className="flex min-h-20 animate-pulse items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3"
                                >
                                    <div className="h-10 w-10 shrink-0 rounded-full bg-zinc-800" />
                                    <div className="min-w-0 flex-1 space-y-2">
                                        <div className="h-3 w-2/5 rounded bg-zinc-800" />
                                        <div className="h-2.5 w-3/5 rounded bg-zinc-800/80" />
                                    </div>
                                    <div className="h-7 w-16 rounded-lg bg-zinc-800" />
                                </div>
                            ))}
                            <span className="sr-only">Loading members...</span>
                        </div>
                    ) : members.length === 0 ? (
                        <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 px-5 text-center">
                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800/80 text-zinc-400">
                                <FaUsers aria-hidden="true" />
                            </div>
                            <p className="text-sm font-medium text-zinc-200">
                                {EMPTY_STATE_MESSAGES.GROUP_MEMBERS}
                            </p>
                            <p className="mt-1 text-xs text-zinc-500">
                                Members added to this group will appear here.
                            </p>
                        </div>
                    ) : filteredMembers.length === 0 ? (
                        <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 px-5 text-center">
                            <FaSearch className="mb-3 text-zinc-500" aria-hidden="true" />
                            <p className="text-sm font-medium text-zinc-200">
                                No members match “{searchQuery.trim()}”
                            </p>
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="mt-2 rounded-md text-xs font-medium text-(--accent-300) hover:text-(--accent-200) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent-400)"
                            >
                                Clear search
                            </button>
                        </div>
                    ) : filteredMembers.map((member) => (
                        <div
                            key={member.memberId}
                            className={`
                                relative flex min-h-20 flex-col items-center gap-3
                                rounded-2xl border p-3.5 transition-colors sm:flex-row sm:gap-4
                                ${
                                    selectedMemberId === member.memberId
                                        ? "border-(--accent-500)/60 bg-(--accent-500)/10 ring-1 ring-(--accent-500)/20"
                                        : "border-zinc-800/90 bg-zinc-900/55 hover:border-zinc-700 hover:bg-zinc-900/90"
                                }
                            `}
                        >
                            <button
                                type="button"
                                onClick={() => setSelectedMemberId(member.memberId)}
                                aria-pressed={selectedMemberId === member.memberId}
                                aria-label={`View details for ${member.name || "member"}`}
                                className="
                                    flex w-full min-w-0 items-center gap-3 rounded-xl text-left
                                    focus-visible:outline-none focus-visible:ring-2
                                    focus-visible:ring-(--accent-400) sm:flex-1
                                "
                            >
                                <ProfileAvatar
                                    user={member}
                                    className="h-11 w-11 rounded-2xl border-(--accent-500)/20 bg-(--accent-500)/10 text-base text-(--accent-300)"
                                />

                                <span className="min-w-0 flex-1">
                                    <span className="block truncate text-sm font-semibold text-zinc-100">
                                        {member.name || "Unknown member"}
                                    </span>
                                    <span className="mt-0.5 block truncate text-xs text-zinc-400">
                                        {member.email}
                                    </span>
                                    {member.bio && (
                                        <span className="mt-1 block line-clamp-1 text-xs text-zinc-500">
                                            {member.bio}
                                        </span>
                                    )}
                                </span>
                            </button>

                            <div className="flex w-full items-center justify-end gap-2 border-t border-zinc-800/70 pt-2 sm:w-auto sm:border-0 sm:pt-0">
                                <div className="relative">
                                    <button
                                        type="button"
                                        disabled={!canManageRoles}
                                        onClick={() => handleRoleClick(member)}
                                        aria-expanded={openRoleMenu === member.memberId}
                                        aria-label={`Role: ${member.role}${canManageRoles ? ". Change role" : ""}`}
                                        className={`
                                            flex items-center gap-2 rounded-lg border px-3 py-1.5
                                            text-xs font-medium transition-colors
                                            ${getRoleStyles(member.role)}
                                            ${
                                                canManageRoles
                                                    ? "cursor-pointer hover:brightness-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent-400)"
                                                    : "cursor-default"
                                            }
                                            disabled:opacity-100
                                        `}
                                    >
                                        {member.role}
                                        {canManageRoles &&
                                            member.role !== "OWNER" && (
                                                <FaChevronDown size={10} aria-hidden="true" />
                                            )}
                                    </button>

                                    {openRoleMenu === member.memberId &&
                                        canManageRoles &&
                                        member.role !== "OWNER" && (
                                            <div
                                                role="group"
                                                aria-label={`Change ${member.name}'s role`}
                                                className="
                                                    absolute right-full top-1/2 z-20 mr-2
                                                    flex w-max -translate-y-1/2 overflow-hidden
                                                    whitespace-nowrap rounded-xl border border-zinc-700
                                                    bg-zinc-900 shadow-xl shadow-black/30
                                                "
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => requestRoleChange(member, "ADMIN")}
                                                    className="
                                                        shrink-0 border-r border-zinc-700 px-3 py-2
                                                        text-left text-sm text-(--accent-300)
                                                        transition-colors hover:bg-zinc-800
                                                        focus-visible:outline-none focus-visible:ring-2
                                                        focus-visible:ring-inset focus-visible:ring-(--accent-400)
                                                    "
                                                >
                                                    Admin
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => requestRoleChange(member, "MEMBER")}
                                                    className="
                                                        shrink-0 px-3 py-2 text-left text-sm text-zinc-300
                                                        transition-colors hover:bg-zinc-800
                                                        focus-visible:outline-none focus-visible:ring-2
                                                        focus-visible:ring-inset focus-visible:ring-(--accent-400)
                                                    "
                                                >
                                                    Member
                                                </button>
                                            </div>
                                        )}
                                </div>

                                {canManageMembers && member.role !== "OWNER" && (
                                    <button
                                        type="button"
                                        onClick={() => requestDelete(member)}
                                        aria-label={`Remove ${member.name || "member"} from group`}
                                        className="
                                            flex h-9 w-9 shrink-0 items-center justify-center
                                            rounded-lg text-zinc-500 transition-colors
                                            hover:bg-red-400/10 hover:text-red-400
                                            focus-visible:outline-none focus-visible:ring-2
                                            focus-visible:ring-red-400/70
                                        "
                                    >
                                        <FaTrash className="text-xs" aria-hidden="true" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <aside className="min-h-44 rounded-2xl border border-zinc-800 bg-zinc-900/45 p-4 sm:p-5">
                    {selectedMember ? (
                        <>
                            <div className="mb-5 flex items-center gap-3">
                                <ProfileAvatar
                                    user={selectedMember}
                                    className="h-12 w-12 rounded-2xl border-(--accent-500)/20 bg-(--accent-500)/10 text-lg text-(--accent-300)"
                                />
                                <div className="min-w-0">
                                    <h3 className="truncate text-base font-semibold text-white">
                                        {selectedMember.name || "Unknown member"}
                                    </h3>
                                    <span className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium ${getRoleStyles(selectedMember.role)}`}>
                                        {selectedMember.role}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <FaEnvelope className="mt-0.5 shrink-0 text-sm text-(--accent-300)" aria-hidden="true" />
                                    <div className="min-w-0">
                                        <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                                            Email
                                        </p>
                                        <p className="mt-1 break-all text-sm text-zinc-200">
                                            {selectedMember.email || "Not provided"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <FaCalendarAlt className="mt-0.5 shrink-0 text-sm text-(--accent-300)" aria-hidden="true" />
                                    <div>
                                        <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                                            Date of birth
                                        </p>
                                        <p className="mt-1 text-sm text-zinc-200">
                                            {selectedMember.dob
                                                ? new Date(`${selectedMember.dob}T00:00:00`).toLocaleDateString()
                                                : "Not provided"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <FaInfoCircle className="mt-0.5 shrink-0 text-sm text-(--accent-300)" aria-hidden="true" />
                                    <div className="min-w-0">
                                        <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                                            Bio
                                        </p>
                                        <p className="mt-1 whitespace-pre-wrap wrap-break-word text-sm leading-relaxed text-zinc-300">
                                            {selectedMember.bio || EMPTY_STATE_MESSAGES.BIO}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex h-full min-h-36 flex-col items-center justify-center text-center">
                            <FaUsers className="mb-3 text-xl text-zinc-600" aria-hidden="true" />
                            <p className="text-sm font-medium text-zinc-300">
                                Select a member
                            </p>
                            <p className="mt-1 text-xs text-zinc-500">
                                Their email, date of birth, and bio will appear here.
                            </p>
                        </div>
                    )}
                </aside>
                </div>
            </PopupCard>

            {/* Confirmation popup */}
            {confirmation && (
                <ConfirmationPopup
                    onClose={() => setConfirmation(null)}
                    onConfirm={handleConfirm}
                    loading={isSaving}
                    title={
                        confirmation.type === "role"
                            ? "Change Role?"
                            : "Remove Member?"
                    }
                    message={
                        confirmation.type === "role"
                            ? `Change ${confirmation.member.name}'s role to ${confirmation.newRole}?`
                            : `Remove ${confirmation.member.name} from this group?`
                    }
                />
            )}
        </>
    );
}

export default GroupMembersPopup;