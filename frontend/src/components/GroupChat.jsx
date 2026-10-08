import { useCallback, useEffect, useRef, useState } from "react";
import {
    FaArrowLeft,
    FaCopy,
    FaEllipsisV,
    FaLock,
    FaPaperPlane,
    FaRegStar,
    FaShare,
    FaStar,
    FaTrash,
    FaUnlock,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import ConfirmationPopup from "./ConfirmationPopup";
import GroupSearchBar from "./GroupSearchBar";
import ShareLinkPopup from "./ShareLinkPopup";
import REDIRECT_URL from "../config/redirect";
import { useAuth } from "../context/useAuth";
import { useLinkManagement } from "../context/UseLinkManagement";
import { incrementCopyCountPrivateLink } from "../services/getLinksService";
import { EMPTY_STATE_MESSAGES } from "../config/emptyStateMessages";
import {
    deleteGroupSharedLink,
    getGroupSharedLinks,
} from "../services/groupLinkService";
import { showToast } from "../services/toastService";

const GROUP_LINK_PAGE_SIZE = 10;

function normalizeSharedLinks(sharedLinks, linkType) {
    return sharedLinks.map((sharedLink) => {
        const linkData = linkType === "short"
            ? sharedLink.groupShortLinkResponseDTO
            : sharedLink.groupPrivateLinkResponseDTO;

        return {
            groupLinkId: sharedLink.groupLinkId,
            linkType,
            link: linkType === "short"
                ? linkData.shortLinkResponseDTO
                : linkData.privateLinkResponseDTO,
            sharedBy: linkData.sharedBy,
            sharedByUserId: linkData.sharedByUserId,
            sharedAt: linkData.sharedAt,
        };
    });
}

function GroupChat({ group, onBack, onMenu }) {
    const [sharedLinks, setSharedLinks] = useState([]);
    const [loadedKey, setLoadedKey] = useState(null);
    const [loadError, setLoadError] = useState("");
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState({ short: false, private: false });
    const [searchText, setSearchText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [shareTarget, setShareTarget] = useState(null);
    const [revealedLinks, setRevealedLinks] = useState({});
    const [deleting, setDeleting] = useState(false);
    const lastCopiedPrivateLink = useRef(null);
    const messagesContainerRef = useRef(null);
    const olderLinksSentinelRef = useRef(null);
    const nextPageRef = useRef({ short: 1, private: 1 });
    const hasMoreRef = useRef({ short: false, private: false });
    const loadingMoreRef = useRef(false);
    const requestIdRef = useRef(0);
    const shouldScrollToBottomRef = useRef(false);
    const { user } = useAuth();
    const { incrementCopyCount } = useLinkManagement();
    const navigate = useNavigate();
    const queryKey = `${group.groupId}:${searchQuery}`;
    const loading = loadedKey !== queryKey;
    const visibleSharedLinks = loading ? [] : sharedLinks;

    useEffect(() => {
        const requestId = ++requestIdRef.current;
        shouldScrollToBottomRef.current = false;
        hasMoreRef.current = { short: false, private: false };
        nextPageRef.current = { short: 1, private: 1 };

        const loadSharedLinks = async () => {
            try {
                const [shortLinks, privateLinks] = await Promise.all([
                    getGroupSharedLinks(
                        group.groupId,
                        "short",
                        searchQuery,
                        0,
                        GROUP_LINK_PAGE_SIZE
                    ),
                    getGroupSharedLinks(
                        group.groupId,
                        "private",
                        searchQuery,
                        0,
                        GROUP_LINK_PAGE_SIZE
                    ),
                ]);

                const items = [
                    ...normalizeSharedLinks(shortLinks.content ?? [], "short"),
                    ...normalizeSharedLinks(privateLinks.content ?? [], "private"),
                ].sort(
                    (first, second) =>
                        new Date(first.sharedAt) - new Date(second.sharedAt)
                );

                if (requestIdRef.current === requestId) {
                    const more = {
                        short: shortLinks.hasNext,
                        private: privateLinks.hasNext,
                    };
                    nextPageRef.current = { short: 1, private: 1 };
                    hasMoreRef.current = more;
                    shouldScrollToBottomRef.current = true;
                    setLoadError("");
                    setHasMore(more);
                    setSharedLinks(items);
                }
            } catch (error) {
                if (requestIdRef.current === requestId) {
                    setSharedLinks([]);
                    setHasMore({ short: false, private: false });
                    hasMoreRef.current = { short: false, private: false };
                    setLoadError(error.message);
                    showToast("error", error.message);
                }
            } finally {
                if (requestIdRef.current === requestId) {
                    setLoadedKey(queryKey);
                }
            }
        };

        loadSharedLinks();
        return () => {
            requestIdRef.current += 1;
        };
    }, [group.groupId, queryKey, searchQuery]);

    const loadOlderLinks = useCallback(async () => {
        const more = hasMoreRef.current;
        if (
            loading ||
            loadingMoreRef.current ||
            (!more.short && !more.private)
        ) {
            return;
        }

        loadingMoreRef.current = true;
        setLoadingMore(true);
        const requestId = requestIdRef.current;
        const container = messagesContainerRef.current;
        const previousScrollHeight = container?.scrollHeight ?? 0;
        const previousScrollTop = container?.scrollTop ?? 0;

        try {
            const requests = [];
            if (more.short) {
                requests.push(
                    getGroupSharedLinks(
                        group.groupId,
                        "short",
                        searchQuery,
                        nextPageRef.current.short,
                        GROUP_LINK_PAGE_SIZE
                    ).then((result) => ({ linkType: "short", result }))
                );
            }
            if (more.private) {
                requests.push(
                    getGroupSharedLinks(
                        group.groupId,
                        "private",
                        searchQuery,
                        nextPageRef.current.private,
                        GROUP_LINK_PAGE_SIZE
                    ).then((result) => ({ linkType: "private", result }))
                );
            }

            const results = await Promise.all(requests);
            if (requestIdRef.current !== requestId) {
                return;
            }

            const olderLinks = [];
            const updatedMore = { ...hasMoreRef.current };
            for (const { linkType, result } of results) {
                olderLinks.push(
                    ...normalizeSharedLinks(result.content ?? [], linkType)
                );
                updatedMore[linkType] = result.hasNext;
                nextPageRef.current[linkType] += 1;
            }

            const existingIds = new Set(
                sharedLinks.map((item) => item.groupLinkId)
            );
            const uniqueOlderLinks = olderLinks.filter(
                (item) => !existingIds.has(item.groupLinkId)
            );
            hasMoreRef.current = updatedMore;
            setHasMore(updatedMore);
            setSharedLinks((currentLinks) =>
                [...currentLinks, ...uniqueOlderLinks].sort(
                    (first, second) =>
                        new Date(first.sharedAt) - new Date(second.sharedAt)
                )
            );

            requestAnimationFrame(() => {
                const currentContainer = messagesContainerRef.current;
                if (currentContainer && uniqueOlderLinks.length) {
                    currentContainer.scrollTop =
                        currentContainer.scrollHeight -
                        previousScrollHeight +
                        previousScrollTop;
                }
            });
        } catch (error) {
            if (requestIdRef.current === requestId) {
                showToast("error", error.message);
            }
        } finally {
            loadingMoreRef.current = false;
            setLoadingMore(false);
        }
    }, [group.groupId, loading, searchQuery, sharedLinks]);

    useEffect(() => {
        if (
            loading ||
            loadingMore ||
            (!hasMore.short && !hasMore.private) ||
            !olderLinksSentinelRef.current
        ) {
            return undefined;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    loadOlderLinks();
                }
            },
            {
                root: messagesContainerRef.current,
                rootMargin: "120px 0px 0px 0px",
            }
        );
        observer.observe(olderLinksSentinelRef.current);

        return () => observer.disconnect();
    }, [hasMore, loading, loadingMore, loadOlderLinks]);

    useEffect(() => {
        if (shouldScrollToBottomRef.current && messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop =
                messagesContainerRef.current.scrollHeight;
            shouldScrollToBottomRef.current = false;
        }
    }, [sharedLinks]);

    const handleDelete = async () => {
        if (!deleteTarget) {
            return;
        }

        setDeleting(true);
        try {
            await deleteGroupSharedLink(
                group.groupId,
                deleteTarget.linkType,
                deleteTarget.groupLinkId
            );
            setSharedLinks((currentLinks) =>
                currentLinks.filter(
                    (item) => item.groupLinkId !== deleteTarget.groupLinkId
                )
            );
            setDeleteTarget(null);
            showToast("success", "Shared link removed from the group");
        } catch (error) {
            showToast("error", error.message);
        } finally {
            setDeleting(false);
        }
    };

    const getDisplayUrl = ({ link, linkType }) =>
        linkType === "short" && link.shortCode
            ? `${REDIRECT_URL}/${link.shortCode}`
            : link.url;

    const getActiveUrl = (item) =>
        item.linkType === "short" && revealedLinks[item.groupLinkId]
            ? item.link.url
            : getDisplayUrl(item);

    const handleCopy = async (item) => {
        const linkId =
            item.linkType === "short" ? item.link.slId : item.link.plId;
        const url = getActiveUrl(item);

        try {
            await navigator.clipboard.writeText(url);

            if (
                item.linkType === "private" &&
                lastCopiedPrivateLink.current !== linkId
            ) {
                await incrementCopyCountPrivateLink(linkId);
                lastCopiedPrivateLink.current = linkId;
                incrementCopyCount(linkId);
                setSharedLinks((currentLinks) =>
                    currentLinks.map((currentItem) =>
                        currentItem.groupLinkId === item.groupLinkId
                            ? {
                                  ...currentItem,
                                  link: {
                                      ...currentItem.link,
                                      copyCount:
                                          (currentItem.link.copyCount || 0) + 1,
                                  },
                              }
                            : currentItem
                    )
                );
            }
        } catch (error) {
            showToast("error", error.message || "Failed to copy link");
        }
    };

    const formatDate = (date) =>
        new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });

    const formatSharedAt = (date) =>
        new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    const isSharedByCurrentUser = (sharedByUserId) =>
        sharedByUserId === user?.userId;

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8">
            <header className="mb-4 flex items-center gap-2 border-b border-zinc-800 pb-3 sm:gap-3">
                <button
                    type="button"
                    onClick={onBack}
                    aria-label="Back to groups"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
                >
                    <FaArrowLeft />
                </button>
                <div className="max-w-[25%] shrink-0 text-center">
                    <h1 className="truncate text-sm font-semibold text-white sm:text-base">
                        {group.groupName}
                    </h1>
                    <p className="hidden truncate text-xs text-zinc-500 sm:block">
                        {group.description || "Group shared links"}
                    </p>
                </div>
                <div className="min-w-0 flex-1">
                    <GroupSearchBar
                        value={searchText}
                        onChange={setSearchText}
                        onSearch={() => setSearchQuery(searchText.trim())}
                        placeholder="Search links"
                        ariaLabel="Search links in this group"
                    />
                </div>
                <button
                    type="button"
                    onClick={onMenu}
                    aria-label="Group options"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                >
                    <FaEllipsisV />
                </button>
            </header>

            <div className="w-full pb-4">
                <div className="relative h-[calc(100vh-150px)] min-h-105 w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
                    <div
                        ref={messagesContainerRef}
                        className="
                            h-full
                            overflow-y-auto
                            space-y-4
                            px-3
                            py-4
                            pb-20
                            sm:px-5
                            sm:py-5
                            sm:pb-20
                            lg:space-y-5
                            lg:px-8
                            lg:py-6
                            lg:pb-24

                            [&::-webkit-scrollbar]:w-1.5
                            [&::-webkit-scrollbar-track]:bg-transparent
                            [&::-webkit-scrollbar-thumb]:rounded-full
                            [&::-webkit-scrollbar-thumb]:bg-zinc-700
                        "
                    >
                        <div
                            ref={olderLinksSentinelRef}
                            className="h-px"
                            aria-hidden="true"
                        />
                        {loadingMore && (
                            <p className="py-2 text-center text-xs text-zinc-500">
                                Loading older links...
                            </p>
                        )}
                        {loading ? (
                            <p className="py-10 text-center text-sm text-zinc-500">
                                Loading shared links...
                            </p>
                        ) : loadError ? (
                            <p className="py-10 text-center text-sm text-red-400">
                                {loadError}
                            </p>
                        ) : visibleSharedLinks.length ? (
                            visibleSharedLinks.map((item) => {
                                const isMine = isSharedByCurrentUser(
                                    item.sharedByUserId
                                );

                                return (
                                    <div
                                        key={item.groupLinkId}
                                        className={`flex w-full items-center gap-2 sm:gap-3 ${
                                            isMine
                                                ? "justify-end"
                                                : "justify-start"
                                        }`}
                                    >
                                        {isMine && (
                                            <button
                                                type="button"
                                                onClick={() => setShareTarget(item)}
                                                aria-label={`Share ${item.link.title} to another group`}
                                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-(--accent-500)/70 text-(--accent-300) transition hover:bg-(--accent-500)/10 active:scale-95"
                                            >
                                                <FaShare />
                                            </button>
                                        )}

                                        <article
                                            className={`w-[82%] min-w-0 max-w-3xl rounded-2xl border px-3 py-2.5 sm:w-[74%] sm:px-4 sm:py-3 lg:w-[68%] ${
                                                isMine
                                                    ? "border-(--accent-500)/25 bg-(--accent-500)/10"
                                                    : "border-zinc-800 bg-zinc-900"
                                            }`}
                                        >
                                            <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(35px,0.3fr)] gap-x-1 gap-y-2">
                                                <div className="min-w-0">
                                                    <p className="mb-0.5 text-xs text-zinc-300">
                                                        Title
                                                    </p>
                                                    <div className="flex min-w-0 items-center gap-1.5">
                                                        {item.link.favourite ? (
                                                            <FaStar
                                                                size={10}
                                                                className="shrink-0 text-yellow-400"
                                                            />
                                                        ) : (
                                                            <FaRegStar
                                                                size={10}
                                                                className="shrink-0 text-(--accent-400)"
                                                            />
                                                        )}
                                                        <a
                                                            href={getDisplayUrl(item)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="truncate text-sm font-medium text-white hover:text-(--accent-200)"
                                                        >
                                                            {item.link.title}
                                                        </a>
                                                    </div>
                                                </div>

                                                <div className="min-w-10">
                                                    <p className="mb-0.5 text-xs text-zinc-300">
                                                        {item.linkType === "short"
                                                            ? "Clicks"
                                                            : "Copies"}
                                                    </p>
                                                    <p className="whitespace-nowrap text-sm text-zinc-400">
                                                        {item.linkType === "short"
                                                            ? item.link.clickCount
                                                            : item.link.copyCount}
                                                    </p>
                                                </div>

                                                <div className="col-span-2 min-w-0">
                                                    <p className="mb-0.5 text-xs text-zinc-300">
                                                        {item.linkType === "short"
                                                            ? "Short Link"
                                                            : "Private Link"}
                                                    </p>
                                                    <div className="flex min-w-0 items-center gap-1">
                                                        {item.linkType === "short" && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setRevealedLinks(
                                                                        (current) => ({
                                                                            ...current,
                                                                            [item.groupLinkId]:
                                                                                !current[item.groupLinkId],
                                                                        })
                                                                    )
                                                                }
                                                                aria-label={
                                                                    revealedLinks[item.groupLinkId]
                                                                        ? "Show short URL"
                                                                        : "Show original URL"
                                                                }
                                                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-(--accent-300) transition hover:bg-zinc-800 hover:text-white active:scale-90"
                                                            >
                                                                {revealedLinks[item.groupLinkId] ? (
                                                                    <FaUnlock className="text-xs" />
                                                                ) : (
                                                                    <FaLock className="text-xs" />
                                                                )}
                                                            </button>
                                                        )}
                                                        <div
                                                            className="
                                                                min-w-0
                                                                flex-1
                                                                overflow-x-auto
                                                                whitespace-nowrap
                                                                scroll-smooth
                                                                [&::-webkit-scrollbar]:h-0.75
                                                                [&::-webkit-scrollbar-track]:bg-transparent
                                                                [&::-webkit-scrollbar-thumb]:rounded-full
                                                                [&::-webkit-scrollbar-thumb]:bg-black
                                                            "
                                                            style={{
                                                                scrollbarWidth: "thin",
                                                                scrollbarColor: "black transparent",
                                                            }}
                                                        >
                                                            <a
                                                                href={getActiveUrl(item)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                title={getActiveUrl(item)}
                                                                className={`text-sm hover:underline ${
                                                                    item.linkType === "short" &&
                                                                    !revealedLinks[item.groupLinkId]
                                                                        ? "text-(--accent-300)"
                                                                        : "text-zinc-400 hover:text-zinc-300"
                                                                }`}
                                                            >
                                                                {getActiveUrl(item)}
                                                            </a>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleCopy(item)
                                                            }
                                                            aria-label={
                                                                item.linkType === "short" &&
                                                                revealedLinks[item.groupLinkId]
                                                                    ? "Copy original URL"
                                                                    : "Copy link"
                                                            }
                                                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-(--accent-500) transition hover:bg-zinc-800 hover:text-white active:scale-90"
                                                        >
                                                            <FaCopy size={13} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="mb-0.5 text-xs text-zinc-300">
                                                        Created
                                                    </p>
                                                    <p className="whitespace-nowrap text-sm text-zinc-300">
                                                        {formatDate(item.link.createdAt)}
                                                    </p>
                                                </div>

                                                <div className="flex min-w-0 items-end justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setDeleteTarget(item)
                                                    }
                                                    aria-label={`Remove ${item.link.title} from group`}
                                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-(--accent-600) transition hover:bg-zinc-800 hover:text-red-400"
                                                >
                                                    <FaTrash size={13} />
                                                </button>
                                                </div>
                                            </div>
                                            <div className="mt-2 border-t border-zinc-800/80 pt-2 text-xs text-zinc-500">
                                                <span>
                                                    <span className="text-zinc-400">
                                                        Shared by:
                                                    </span>{" "}
                                                    {item.sharedBy}
                                                </span>
                                                <span className="ml-3">
                                                    {formatSharedAt(item.sharedAt)}
                                                </span>
                                            </div>
                                        </article>

                                        {!isMine && (
                                            <button
                                                type="button"
                                                onClick={() => setShareTarget(item)}
                                                aria-label={`Share ${item.link.title} to another group`}
                                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-(--accent-500)/70 text-(--accent-300) transition hover:bg-(--accent-500)/10 active:scale-95"
                                            >
                                                <FaShare />
                                            </button>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <p className="py-10 text-center text-sm text-zinc-500">
                                {sharedLinks.length
                                    ? EMPTY_STATE_MESSAGES.SHARED_LINK_SEARCH
                                    : EMPTY_STATE_MESSAGES.SHARED_LINKS}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/mylinks")}
                        aria-label="Go to My Links to share a link"
                        className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full border border-(--accent-500) bg-(--accent-500) text-white shadow-lg transition hover:bg-(--accent-600) active:scale-95 sm:bottom-5 sm:right-5 sm:h-14 sm:w-14"
                    >
                        <FaPaperPlane className="text-lg" />
                    </button>
                </div>
            </div>

            {deleteTarget && (
                <ConfirmationPopup
                    loading={deleting}
                    onClose={() => setDeleteTarget(null)}
                    onConfirm={handleDelete}
                    title="Remove shared link?"
                    message="This removes the link from this group without deleting your saved link."
                />
            )}

            {shareTarget && (
                <ShareLinkPopup
                    link={shareTarget.link}
                    linkType={shareTarget.linkType}
                    excludeGroupId={group.groupId}
                    onClose={() => setShareTarget(null)}
                />
            )}
        </div>
    );
}

export default GroupChat;
