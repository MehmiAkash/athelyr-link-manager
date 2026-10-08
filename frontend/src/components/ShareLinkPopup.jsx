import { useEffect, useMemo, useState } from "react";
import { FaCheck, FaSearch, FaShareAlt, FaTimes } from "react-icons/fa";

import PopupCard from "./PopupCard";
import { useGroups } from "../context/useGroups";
import { shareLinkWithGroup } from "../services/groupLinkService";
import { showToast } from "../services/toastService";
import { EMPTY_STATE_MESSAGES } from "../config/emptyStateMessages";

function ShareLinkPopup({
    link,
    linkType,
    onClose,
    excludeGroupId,
}) {
    const [searchText, setSearchText] = useState("");
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [sharing, setSharing] = useState(false);
    const [loadFailed, setLoadFailed] = useState(false);
    const { groups, groupsLoaded, ensureGroupsLoaded } = useGroups();
    const loading = !groupsLoaded && groups.length === 0 && !loadFailed;

    useEffect(() => {
        if (groupsLoaded) {
            return;
        }

        ensureGroupsLoaded().catch((error) => {
            setLoadFailed(true);
            showToast("error", error.message);
        });
    }, [ensureGroupsLoaded, groupsLoaded]);
    const filteredGroups = useMemo(() => {
        const query = searchText.trim().toLowerCase();
        return groups.filter(
            (group) =>
                group.groupId !== excludeGroupId &&
                group.groupName.toLowerCase().includes(query)
        );
    }, [excludeGroupId, groups, searchText]);

    const handleShare = async () => {
        if (!selectedGroup) {
            showToast("warning", "Select a group first");
            return;
        }

        const linkId = linkType === "short" ? link.slId : link.plId;
        if (!linkId) {
            showToast("error", "Could not find the link to share");
            return;
        }

        setSharing(true);
        try {
            await shareLinkWithGroup(selectedGroup.groupId, linkType, linkId);
            showToast("success", `Link shared with ${selectedGroup.groupName}`);
            onClose();
        } catch (error) {
            showToast("error", error.message);
        } finally {
            setSharing(false);
        }
    };

    return (
        <PopupCard onClose={sharing ? undefined : onClose} maxWidth="max-w-lg">
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-white">
                        Share link
                    </h2>
                    <p className="mt-1 max-w-xs truncate text-sm text-zinc-500">
                        {link.title}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    disabled={sharing}
                    aria-label="Close"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-800 hover:text-white disabled:opacity-50"
                >
                    <FaTimes />
                </button>
            </div>

            <label className="mb-4 flex h-11 items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-950 px-4 text-zinc-400 focus-within:border-(--accent-400)">
                <FaSearch className="shrink-0 text-sm" />
                <input
                    type="search"
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    placeholder="Search groups"
                    aria-label="Search groups to share with"
                    className="min-w-0 flex-1 bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
                />
            </label>

            <div className="max-h-64 min-h-24 overflow-y-auto rounded-xl border border-zinc-800">
                {loading ? (
                    <p className="px-4 py-8 text-center text-sm text-zinc-500">
                        Loading groups...
                    </p>
                ) : filteredGroups.length ? (
                    filteredGroups.map((group) => {
                        const isSelected =
                            selectedGroup?.groupId === group.groupId;
                        return (
                            <button
                                key={group.groupId}
                                type="button"
                                onClick={() => setSelectedGroup(group)}
                                className={`flex w-full items-center gap-3 border-b border-zinc-800 px-4 py-3 text-left last:border-b-0 ${
                                    isSelected
                                        ? "bg-(--accent-500)/15"
                                        : "hover:bg-zinc-900"
                                }`}
                            >
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-(--accent-500)/15 font-semibold text-(--accent-200)">
                                    {group.groupName.charAt(0).toUpperCase()}
                                </span>
                                <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-100">
                                    {group.groupName}
                                </span>
                                {isSelected && (
                                    <FaCheck className="shrink-0 text-(--accent-300)" />
                                )}
                            </button>
                        );
                    })
                ) : (
                    <p className="px-4 py-8 text-center text-sm text-zinc-500">
                        {groups.some((group) => group.groupId !== excludeGroupId)
                            ? EMPTY_STATE_MESSAGES.GROUP_SEARCH
                            : EMPTY_STATE_MESSAGES.GROUPS_TO_SHARE}
                    </p>
                )}
            </div>

            <button
                type="button"
                onClick={handleShare}
                disabled={!selectedGroup || sharing || loading}
                className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-(--accent-500) font-semibold text-white transition hover:bg-(--accent-600) disabled:cursor-not-allowed disabled:opacity-50"
            >
                <FaShareAlt />
                {sharing ? "Sharing..." : "Share link"}
            </button>
        </PopupCard>
    );
}

export default ShareLinkPopup;
