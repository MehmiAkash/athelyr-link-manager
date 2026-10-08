import { useRef, useState } from "react";
import { FaCopy, FaLock, FaUnlock } from "react-icons/fa";

import REDIRECT_URL from "../config/redirect";
import { useLinkManagement } from "../context/UseLinkManagement";
import { incrementCopyCountPrivateLink } from "../services/getLinksService";
import { showToast } from "../services/toastService";
import { EMPTY_STATE_MESSAGES } from "../config/emptyStateMessages";

function TopUsedLinks({ title, links, usageLabel, accentClass, loading }) {
    const [revealedLinks, setRevealedLinks] = useState({});
    const [copyingLinkId, setCopyingLinkId] = useState(null);
    const lastCopiedPrivateLink = useRef(null);
    const { incrementClickCount, incrementCopyCount } = useLinkManagement();

    const getDisplayUrl = (link) =>
        link.linkType === "SHORT" && link.shortCode
            ? `${REDIRECT_URL}/${link.shortCode}`
            : link.url;

    const getActiveUrl = (link) =>
        link.linkType === "SHORT" && revealedLinks[link.linkId]
            ? link.url
            : getDisplayUrl(link);

    const handleCopy = async (link) => {
        const linkId = link.linkId;
        const url = getActiveUrl(link);

        try {
            await navigator.clipboard.writeText(url);
            if (link.linkType === "PRIVATE") {
                if (lastCopiedPrivateLink.current === linkId) {
                    return;
                }

                lastCopiedPrivateLink.current = linkId;
                setCopyingLinkId(linkId);
                try {
                    await incrementCopyCountPrivateLink(linkId);
                    incrementCopyCount(linkId);
                } finally {
                    setCopyingLinkId(null);
                }
            }
            showToast("success", "Link copied");
        } catch (error) {
            showToast("error", error.message || "Failed to copy link");
        }
    };

    return (
        <section className="min-w-0 w-full self-start overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/80">
            <h2
                className={`border-b border-zinc-800 px-4 py-3 text-lg font-semibold ${accentClass}`}
            >
                {title}
            </h2>
            {loading ? (
                <p className="px-4 py-8 text-center text-sm text-zinc-500">
                    Loading usage...
                </p>
            ) : links.length ? (
                <ol className="divide-y divide-zinc-800/80">
                    {links.slice(0, 5).map((link, index) => {
                        const isShort = link.linkType === "SHORT";
                        const isRevealed = Boolean(revealedLinks[link.linkId]);
                        const activeUrl = getActiveUrl(link);

                        return (
                            <li
                                key={link.linkId}
                                className="min-w-0 px-3 py-2.5 transition-colors hover:bg-zinc-800/30 sm:px-4"
                            >
                                <div className="flex min-w-0 items-center gap-2">
                                    <span                                     className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-sm font-semibold text-zinc-200">
                                        {index + 1}
                                    </span>
                                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-white">
                                        {link.title || "Untitled link"}
                                    </span>
                                    <span className="shrink-0 text-right">
                                        <span className="text-base font-semibold text-white sm:text-lg">
                                            {link.usageCount}
                                        </span>
                                        <span className="ml-1 text-xs text-zinc-400 sm:text-sm">
                                            {usageLabel}
                                        </span>
                                    </span>
                                </div>

                                <div className="mt-1.5 flex min-w-0 items-center gap-1 pl-8">
                                    {isShort && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setRevealedLinks((current) => ({
                                                    ...current,
                                                    [link.linkId]: !current[
                                                        link.linkId
                                                    ],
                                                }))
                                            }
                                            aria-label={
                                                isRevealed
                                                    ? "Show short link"
                                                    : "Show original URL"
                                            }
                                            title={
                                                isRevealed
                                                    ? "Show short link"
                                                    : "Show original URL"
                                            }
                                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-(--accent-400) transition hover:bg-zinc-800 hover:text-white"
                                        >
                                            {isRevealed ? (
                                                <FaUnlock size={12} />
                                            ) : (
                                                <FaLock size={12} />
                                            )}
                                        </button>
                                    )}
                                    <a
                                        href={activeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => {
                                            if (isShort && !isRevealed) {
                                                incrementClickCount(link.linkId);
                                            }
                                        }}
                                        className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap text-sm text-(--accent-300) hover:underline [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-700"
                                        title={activeUrl}
                                    >
                                        {activeUrl}
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(link)}
                                        disabled={copyingLinkId === link.linkId}
                                        aria-label={`Copy ${link.title || "link"}`}
                                        title="Copy link"
                                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-(--accent-400) transition hover:bg-zinc-800 hover:text-white disabled:cursor-wait disabled:opacity-50"
                                    >
                                        <FaCopy size={12} />
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                </ol>
            ) : (
                <p className="px-4 py-8 text-center text-sm text-zinc-500">
                    {EMPTY_STATE_MESSAGES.USAGE(usageLabel)}
                </p>
            )}
        </section>
    );
}

export default TopUsedLinks;
