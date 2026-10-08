import { useEffect, useRef, useState } from "react";

import {
    FaCopy,
    FaStar,
    FaRegStar,
    FaLock,
    FaUnlock,
} from "react-icons/fa";
import { useLinkManagement } from "../context/UseLinkManagement";
import REDIRECT_URL from "../config/redirect";
import Loader from "./Loader";
import LinkActions from "./LinkActions";
import { incrementCopyCountPrivateLink } from "../services/getLinksService";
import { EMPTY_STATE_MESSAGES } from "../config/emptyStateMessages";

function LinkTable({
    linktype,
    shortLinks,
    privateLinks,
    loading,
    favoritesOnly = false,
    searchQuery = "",
    loadError = "",
    hasMore = false,
    loadingMore = false,
    onLoadMore,
}) {
    const {  incrementClickCount , incrementCopyCount } = useLinkManagement();
    const lastCopiedPrivateLink = useRef(null);
    const rowsRef = useRef(null);
    const loadMoreRef = useRef(null);
    const links = loading
        ? []
        : linktype === "short"
        ? shortLinks
        : privateLinks;

    const [revealedLinks, setRevealedLinks] = useState({});

    const getUrl = (link) => {
        if (linktype === "short") {
            return `${REDIRECT_URL}/${link.shortCode}`;
        }

        return link.url;
    };

    const handleCopy = async (link) => {
        const linkId = link.slId || link.plId;
        let url;
        if (linktype === "short" && revealedLinks[linkId]) {
            url = link.url;
        } else {
            url = getUrl(link);
        }
        try {
            await navigator.clipboard.writeText(url);
            if (linktype === "private") {
                // Ignore consecutive clicks
                // on the same private link.
                if (lastCopiedPrivateLink.current === linkId) {
                    return;
                }
                // Remember this link as the last copied link.
                lastCopiedPrivateLink.current = linkId;
                await incrementCopyCountPrivateLink(linkId);
                incrementCopyCount(linkId);
            }
            console.log("Copied:", url);
        } catch (error) {
            console.error("Copy failed:", error);
        }
    };


    const toggleOriginalUrl = (linkId) => {
        setRevealedLinks((prev) => ({
            ...prev,
            [linkId]: !prev[linkId],
        }));
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    /*
     * Desktop columns:
     * Title       -> minimum 120px
     * Link        -> minimum 150px
     * Clicks      -> minimum 70px
     * Created     -> minimum 85px
     * Actions     -> minimum 75px
     */
    const gridCols =
        "grid-cols-[1fr_0.3fr] lg:grid-cols-[minmax(120px,0.7fr)_minmax(150px,1.1fr)_minmax(70px,0.25fr)_minmax(85px,0.45fr)_minmax(75px,0.5fr)]";

    const scrollClasses = `
        min-w-20
        max-w-full
        overflow-x-auto
        whitespace-nowrap
        scroll-smooth
        [&::-webkit-scrollbar]:h-0.75
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-black
        [&::-webkit-scrollbar-thumb]:rounded-full
    `;

    const columnBorderClass = `
        lg:border-r
        lg:border-zinc-800/70
        lg:pr-4
    `;

    const scrollbarStyle = {
        scrollbarWidth: "thin",
        scrollbarColor: "black transparent",
    };

    useEffect(() => {
        if (!hasMore || loading || loadingMore || links.length === 0) {
            return undefined;
        }

        const sentinel = loadMoreRef.current;
        if (!sentinel) {
            return undefined;
        }

        const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    onLoadMore?.();
                }
            },
            {
                root: isDesktop ? rowsRef.current : null,
                rootMargin: "160px",
            }
        );
        observer.observe(sentinel);

        return () => observer.disconnect();
    }, [hasMore, loading, loadingMore, links.length, onLoadMore]);

    return (
        <div className="w-full px-4 pb-6 sm:px-6 lg:px-8">

            {loading && links.length === 0 && <Loader/>}

            {/* Links */}

            <div
                className="
                    w-full
                    min-w-0
                    bg-zinc-900/80
                    border border-zinc-800
                    rounded-3xl
                    overflow-hidden
                    shadow-xl
                    lg:max-h-[80vh]
                "
            >

                {/* Header */}

                {links.length > 0 && <div
                    className={`
                        hidden
                        lg:grid
                        ${gridCols}
                        gap-4
                        items-center
                        px-6
                        py-4
                        bg-zinc-950/70
                        text-xs
                        text-(--accent-400)
                        uppercase
                        tracking-wider
                        sticky
                        top-0
                        z-10
                    `}
                >

                    {/* Title */}

                    <div
                        className={`
                            min-w-0
                            ${columnBorderClass}
                        `}
                    >
                        <span>Title</span>
                    </div>

                    {/* Link */}

                    <div
                        className={`
                            min-w-0
                            ${columnBorderClass}
                        `}
                    >
                        {linktype === "short"
                            ? "Short Link"
                            : "Private Link"
                        }
                    </div>

                    {/* Clicks / Copies */}

                    <div
                        className={`
                            min-w-0
                            ${columnBorderClass}
                        `}
                    >
                        {linktype === "short"
                            ? "Clicks"
                            : "Copies"
                        }
                    </div>

                    {/* Created */}

                    <div
                        className={`
                            min-w-0
                            ${columnBorderClass}
                        `}
                    >
                        Created
                    </div>

                    {/* Actions */}

                    <div></div>

                </div>}


                {/* Rows */}

                <div
                    ref={rowsRef}
                    className="
                    divide-y
                    divide-zinc-800
                    lg:max-h-[calc(80vh-65px)]
                    lg:overflow-y-auto
                    lg:[&::-webkit-scrollbar]:w-1.5
                    lg:[&::-webkit-scrollbar-track]:bg-zinc-950
                    lg:[&::-webkit-scrollbar-thumb]:bg-zinc-700
                    lg:[&::-webkit-scrollbar-thumb]:rounded-full
                    pb-4
                ">

                    {!loading && links.length === 0 ? (
                        <p className="px-4 py-12 text-center text-sm text-zinc-400 sm:py-16">
                            {loadError
                                ? loadError
                                : searchQuery
                                ? EMPTY_STATE_MESSAGES.LINK_SEARCH
                                : favoritesOnly
                                ? EMPTY_STATE_MESSAGES.FAVORITES
                                : linktype === "short"
                                ? EMPTY_STATE_MESSAGES.SHORT_LINKS
                                : EMPTY_STATE_MESSAGES.PRIVATE_LINKS}
                        </p>
                    ) : links.map((link) => {

                        const displayUrl = getUrl(link);

                        const linkId = link.slId || link.plId;

                        const isRevealed = revealedLinks[linkId];

                        /*
                         * Short links:
                         *
                         * Locked   -> short URL
                         * Unlocked -> original URL
                         */
                        const activeUrl =
                            linktype === "short" && isRevealed
                                ? link.url
                                : displayUrl;

                        return (
                            <div
                                key={linkId}
                                className={`
                                    grid
                                    ${gridCols}
                                    gap-x-4
                                    gap-y-2
                                    lg:gap-4
                                    items-center
                                    px-4
                                    py-3
                                    lg:px-6
                                    lg:py-4
                                    hover:bg-zinc-800/30
                                    transition-colors
                                `}
                            >

                                {/* Title */}

                                <div
                                    className={`
                                        min-w-0
                                        order-1
                                        lg:order-0
                                        ${columnBorderClass}
                                    `}
                                >

                                    {/* Mobile / Tablet Title */}

                                    <div className="
                                        lg:hidden
                                        text-xs
                                        text-zinc-300
                                        mb-0.5
                                    ">
                                        Title
                                    </div>


                                    {/* Title + Favourite */}

                                    <div
                                        className={`
                                            ${scrollClasses}
                                        `}
                                        style={scrollbarStyle}
                                    >

                                        <div className="
                                            flex
                                            items-center
                                            gap-1.5
                                            min-w-0
                                        ">

                                            {/* Favourite Status */}

                                            {link.favourite ? (
                                                <FaStar
                                                    size={10}
                                                    className="
                                                        shrink-0
                                                        text-yellow-400
                                                    "
                                                />
                                            ) : (
                                                <FaRegStar
                                                    size={10}
                                                    className="
                                                        shrink-0
                                                        text-(--accent-400)
                                                    "
                                                />
                                            )}

                                            {/* Title */}

                                            <span className="
                                                text-sm
                                                text-white
                                                font-medium
                                            ">
                                                {link.title}
                                            </span>

                                        </div>

                                    </div>

                                </div>


                                {/* URL */}

                                <div
                                    className={`
                                        min-w-0
                                        col-span-2
                                        order-3
                                        lg:order-0
                                        lg:col-span-1
                                        ${columnBorderClass}
                                    `}
                                >

                                    <p className="
                                        lg:hidden
                                        text-xs
                                        text-zinc-300
                                        mb-0.5
                                    ">
                                        {linktype === "short"
                                            ? "Short Link"
                                            : "Private Link"
                                        }
                                    </p>


                                    {/* URL + Copy Button */}

                                    <div className="
                                        flex
                                        items-center
                                        gap-2
                                        min-w-0
                                    ">

                                        {/* Lock / Unlock Button - Short Links Only */}

                                        {linktype === "short" && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    toggleOriginalUrl(linkId)
                                                }
                                                aria-label={
                                                    isRevealed
                                                        ? "Show short URL"
                                                        : "Show original URL"
                                                }
                                                className="
                                                    shrink-0
                                                    w-8
                                                    h-8
                                                    rounded-full
                                                    flex
                                                    items-center
                                                    justify-center
                                                    text-(--accent-500)
                                                    hover:text-white
                                                    hover:bg-zinc-800
                                                    transition-all
                                                    active:scale-90
                                                "
                                            >
                                                {isRevealed ? (
                                                    <FaUnlock size={13} />
                                                ) : (
                                                    <FaLock size={13} />
                                                )}
                                            </button>
                                        )}


                                        {/* URL Scroll */}

                                        <div
                                            className={`
                                                flex-1
                                                ${scrollClasses}
                                            `}
                                            style={scrollbarStyle}
                                        >

                                            {linktype === "short" ? (

                                                <a
                                                    href={activeUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={() => {
                                                            if (linktype === "short" && !isRevealed) {
                                                                incrementClickCount(linkId);
                                                            }
                                                        }}
                                                    className={`
                                                        text-sm
                                                        whitespace-nowrap
                                                        hover:underline
                                                        ${
                                                            isRevealed
                                                                ? "text-zinc-400 hover:text-zinc-300"
                                                                : "text-(--accent-300) hover:text-(--accent-200)"
                                                        }
                                                    `}
                                                    title={activeUrl}
                                                >
                                                    {activeUrl}
                                                </a>

                                            ) : (

                                                <a
                                                    href={activeUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="
                                                        text-sm
                                                        text-zinc-400
                                                        hover:text-zinc-300
                                                        hover:underline
                                                        whitespace-nowrap
                                                    "
                                                    title={activeUrl}
                                                >
                                                    {activeUrl}
                                                </a>

                                            )}

                                        </div>


                                        {/* Copy Button */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleCopy(link)
                                            }
                                            aria-label={
                                                linktype === "short" && isRevealed
                                                    ? "Copy original URL"
                                                    : "Copy link"
                                            }
                                            className="
                                                shrink-0
                                                w-8
                                                h-8
                                                rounded-full
                                                flex
                                                items-center
                                                justify-center
                                                text-(--accent-500)
                                                hover:text-white
                                                hover:bg-zinc-800
                                                transition-all
                                                active:scale-90
                                            "
                                        >
                                            <FaCopy size={13} />
                                        </button>

                                    </div>

                                </div>


                                {/* Clicks / Copies */}

                                <div
                                    className={`
                                        order-2
                                        lg:order-0
                                        min-w-0
                                        ${columnBorderClass}
                                    `}
                                >

                                    <p className="
                                        lg:hidden
                                        text-xs
                                        text-zinc-300
                                        mb-0.5
                                    ">
                                        {linktype === "short"
                                            ? "Clicks"
                                            : "Copies"
                                        }
                                    </p>


                                    <div
                                        className={scrollClasses}
                                        style={scrollbarStyle}
                                    >

                                        <p className="
                                            text-sm
                                            text-zinc-400
                                            whitespace-nowrap
                                        ">
                                            {linktype === "short"
                                                ? link.clickCount
                                                : link.copyCount
                                            }
                                        </p>

                                    </div>

                                </div>


                                {/* Created */}

                                <div
                                    className={`
                                        order-4
                                        lg:order-0
                                        min-w-0
                                        ${columnBorderClass}
                                    `}
                                >

                                    <p className="
                                        lg:hidden
                                        text-xs
                                        text-zinc-300
                                        mb-0.5
                                    ">
                                        Created
                                    </p>


                                    <div
                                        className={scrollClasses}
                                        style={scrollbarStyle}
                                    >

                                        <p className="
                                            text-sm
                                            text-zinc-300
                                            whitespace-nowrap
                                        ">
                                            {formatDate(link.createdAt)}
                                        </p>

                                    </div>

                                </div>


                                {/* Actions */}

                                <LinkActions
                                    linkType={linktype}
                                    link={link}
                                />
                                

                            </div>
                        );
                    })}
                    {hasMore && links.length > 0 && (
                        <div
                            ref={loadMoreRef}
                            className="py-3 text-center text-xs text-zinc-500"
                            aria-live="polite"
                        >
                            {loadingMore ? "Loading more links..." : ""}
                        </div>
                    )}

                </div>

            </div>
        </div>
    );
}

export default LinkTable;