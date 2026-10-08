import { useState } from "react";
import { FaEllipsisV, FaPlus, FaSyncAlt } from "react-icons/fa";

import GroupSearchBar from "./GroupSearchBar";
import { searchGroups } from "../services/groupLinkService";
import { showToast } from "../services/toastService";
import { EMPTY_STATE_MESSAGES } from "../config/emptyStateMessages";

function GroupList({
    groups,
    loading,
    refreshing,
    onCreateGroup,
    onSelectGroup,
    onGroupMenu,
    onRefresh,
}) {
    const [searchText, setSearchText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState(null);
    const [searching, setSearching] = useState(false);

    const handleSearch = async () => {
        const query = searchText.trim();
        setSearchQuery(query);
        setSearchResults(null);
        if (!query) {
            return;
        }

        setSearching(true);
        try {
            const result = await searchGroups(query);
            setSearchResults(Array.isArray(result) ? result : []);
        } catch (error) {
            showToast("error", error.message);
        } finally {
            setSearching(false);
        }
    };

    const handleRefresh = () => {
        setSearchQuery("");
        setSearchText("");
        setSearchResults(null);
        onRefresh();
    };

    const visibleGroups = (searchResults ?? groups).filter((resultGroup) =>
        groups.some((group) => group.groupId === resultGroup.groupId)
    );

    return (
        <section className="w-full px-4 sm:px-6 lg:px-8">
            <div className="mb-4 flex items-center gap-2 sm:gap-3">
                <button
                    type="button"
                    onClick={onCreateGroup}
                    aria-label="Create group"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-(--accent-500) text-white transition hover:bg-(--accent-600) active:scale-95"
                >
                    <FaPlus />
                </button>
                <div className="min-w-0 flex-1">
                    <GroupSearchBar
                        value={searchText}
                        onChange={setSearchText}
                        onSearch={handleSearch}
                        placeholder="Search groups"
                        ariaLabel="Search groups"
                    />
                </div>
                <button
                    type="button"
                    onClick={handleRefresh}
                    disabled={refreshing || searching}
                    aria-label="Refresh groups"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-(--accent-500) text-white transition hover:bg-(--accent-600) active:scale-90 disabled:cursor-not-allowed disabled:opacity-50 sm:h-11 sm:w-11"
                >
                    <FaSyncAlt
                        className={refreshing ? "animate-spin" : ""}
                    />
                </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
                <div
                    className="
                        max-h-[calc(100vh-220px)]
                        min-h-55
                        overflow-y-auto
                        [&::-webkit-scrollbar]:w-1.5
                        [&::-webkit-scrollbar-track]:bg-zinc-950
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        [&::-webkit-scrollbar-thumb]:bg-zinc-700
                    "
                    style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "#3f3f46 #09090b",
                    }}
                >
                    {loading || searching ? (
                        <p className="px-4 py-10 text-center text-sm text-zinc-500">
                            Loading groups...
                        </p>
                    ) : visibleGroups.length ? (
                        visibleGroups.map((group) => (
                            <div
                                key={group.groupId}
                                className="flex items-center gap-2 border-b border-zinc-800/80 px-3 py-2 last:border-b-0 sm:px-4"
                            >
                                <button
                                    type="button"
                                    onClick={() => onSelectGroup(group)}
                                    className="flex min-w-0 flex-1 items-center gap-3 rounded-xl py-2 text-left transition hover:bg-zinc-900"
                                >
                                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-(--accent-500)/15 text-sm font-semibold text-(--accent-200)">
                                        {group.groupName.charAt(0).toUpperCase()}
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate text-sm font-semibold text-zinc-100">
                                            {group.groupName}
                                        </span>
                                        <span className="mt-1 block line-clamp-2 text-xs text-zinc-500">
                                            {group.description ||
                                                "Tap to open shared links"}
                                        </span>
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onGroupMenu(group)}
                                    aria-label={`Options for ${group.groupName}`}
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-100"
                                >
                                    <FaEllipsisV />
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="px-4 py-10 text-center text-sm text-zinc-500">
                            {searchQuery
                                ? EMPTY_STATE_MESSAGES.GROUP_SEARCH
                                : EMPTY_STATE_MESSAGES.GROUPS}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}

export default GroupList;
