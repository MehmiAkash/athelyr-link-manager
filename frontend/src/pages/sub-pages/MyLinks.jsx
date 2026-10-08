import { useCallback, useEffect, useRef, useState } from "react";

import LinkTypeSwitch from "../../components/LinkTypeSwitch";
import LinkTable from "../../components/LinkTable";
import LinkSearchBar from "../../components/LinkSearchBar";

import { getLinksPage } from "../../services/getLinksService";
import { showToast } from "../../services/toastService";
import { useLinks } from "../../context/uselink";
import { saveLinks } from "../../context/linkStorage";

const INITIAL_LINK_PAGE_SIZE = 25;
const NEXT_LINK_PAGE_SIZE = 10;

function MyLinks() {
    const [linkType, setLinkType] = useState("short");
    const [loadedKey, setLoadedKey] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [favoritesOnly, setFavoritesOnly] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [hasMore, setHasMore] = useState(false);
    const [loadError, setLoadError] = useState("");
    const nextOffset = useRef(INITIAL_LINK_PAGE_SIZE);
    const loadingMoreRef = useRef(false);
    const requestId = useRef(0);

    const {
        linksList,
        setLinksList,
        setLinksLoaded
    } = useLinks();
    const queryKey = `${linkType}:${favoritesOnly}:${searchQuery}`;
    const loading = loadedKey !== queryKey || refreshing;

    useEffect(() => {
        const currentRequest = ++requestId.current;
        nextOffset.current = INITIAL_LINK_PAGE_SIZE;

        getLinksPage(linkType, 0, INITIAL_LINK_PAGE_SIZE, favoritesOnly, searchQuery)
            .then((result) => {
                if (requestId.current !== currentRequest) {
                    return;
                }
                const data = result.content ?? [];
                setLinksList((previousLinks) => {
                    const updatedLinks = { ...previousLinks, [linkType]: data };
                    if (!favoritesOnly && !searchQuery) {
                        saveLinks(updatedLinks);
                    }
                    return updatedLinks;
                });
                nextOffset.current = INITIAL_LINK_PAGE_SIZE;
                setHasMore(result.hasNext);
                setLinksLoaded(true);
                setLoadError("");
                setLoadedKey(queryKey);
            })
            .catch((error) => {
                if (requestId.current === currentRequest) {
                    setLinksList((previousLinks) => {
                        const updatedLinks = { ...previousLinks, [linkType]: [] };
                        if (!favoritesOnly && !searchQuery) {
                            saveLinks(updatedLinks);
                        }
                        return updatedLinks;
                    });
                    setLoadError(error.message);
                    setLoadedKey(queryKey);
                    showToast("error", error.message);
                }
            });

        return () => {
            requestId.current += 1;
        };
    }, [favoritesOnly, linkType, queryKey, searchQuery, setLinksList, setLinksLoaded]);

    const loadMoreLinks = useCallback(async () => {
        if (!hasMore || loadingMoreRef.current || loading) {
            return;
        }

        loadingMoreRef.current = true;
        setLoadingMore(true);
        const offset = nextOffset.current;
        const currentRequest = requestId.current;
        try {
            const result = await getLinksPage(
                linkType,
                offset,
                NEXT_LINK_PAGE_SIZE,
                favoritesOnly,
                searchQuery
            );
            if (requestId.current !== currentRequest) {
                return;
            }
            const data = result.content ?? [];
            setLinksList((previousLinks) => {
                const existingIds = new Set(
                    previousLinks[linkType].map((link) => link.slId || link.plId)
                );
                const updatedLinks = {
                    ...previousLinks,
                    [linkType]: [
                        ...previousLinks[linkType],
                        ...data.filter(
                            (link) => !existingIds.has(link.slId || link.plId)
                        ),
                    ],
                };
                if (!favoritesOnly && !searchQuery) {
                    saveLinks(updatedLinks);
                }
                return updatedLinks;
            });
            nextOffset.current = offset + data.length;
            setHasMore(result.hasNext);
        } catch (error) {
            if (requestId.current === currentRequest) {
                showToast("error", error.message);
            }
        } finally {
            loadingMoreRef.current = false;
            setLoadingMore(false);
        }
    }, [favoritesOnly, hasMore, linkType, loading, searchQuery, setLinksList]);

    const handleLinkTypeChange = (type) => {
        setRefreshing(false);
        setLinkType(type);
    };

    const handleRefresh = () => {
        setRefreshing(true);
        nextOffset.current = INITIAL_LINK_PAGE_SIZE;
        const currentRequest = ++requestId.current;
        getLinksPage(linkType, 0, INITIAL_LINK_PAGE_SIZE, favoritesOnly, searchQuery)
            .then((result) => {
                if (requestId.current !== currentRequest) {
                    return;
                }
                const data = result.content ?? [];
                setLinksList((previousLinks) => {
                    const updatedLinks = { ...previousLinks, [linkType]: data };
                    if (!favoritesOnly && !searchQuery) {
                        saveLinks(updatedLinks);
                    }
                    return updatedLinks;
                });
                nextOffset.current = INITIAL_LINK_PAGE_SIZE;
                setHasMore(result.hasNext);
                setLoadError("");
                setLoadedKey(queryKey);
            })
            .catch((error) => {
                if (requestId.current === currentRequest) {
                    setLoadError(error.message);
                    showToast("error", error.message);
                }
            })
            .finally(() => {
                if (requestId.current === currentRequest) {
                    setRefreshing(false);
                }
            });
    };

    return (
        <div className="w-full">
            <LinkTypeSwitch
                selected={linkType}
                onChange={handleLinkTypeChange}
            />

            <LinkSearchBar
                onSearch={(search) => {
                    setRefreshing(false);
                    setSearchQuery(search);
                }}
                onRefresh={handleRefresh}
                loading={loading}
                favoritesOnly={favoritesOnly}
                onFavoritesToggle={() => {
                    setRefreshing(false);
                    setFavoritesOnly((current) => !current)
                }}
            />

            <LinkTable
                linktype={linkType}
                shortLinks={
                    favoritesOnly
                        ? linksList.short.filter((link) => link.favourite)
                        : linksList.short
                }
                privateLinks={
                    favoritesOnly
                        ? linksList.private.filter((link) => link.favourite)
                        : linksList.private
                }
                loading={loading}
                favoritesOnly={favoritesOnly}
                searchQuery={searchQuery}
                loadError={loadError}
                hasMore={hasMore}
                loadingMore={loadingMore}
                onLoadMore={loadMoreLinks}
            />
        </div>
    );
}

export default MyLinks;