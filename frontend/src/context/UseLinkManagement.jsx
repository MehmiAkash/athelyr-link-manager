import { useLinks } from "./uselink";
import { saveLinks } from "./linkStorage";

export function useLinkManagement() {
    const { setLinksList } = useLinks();

    const addLink = (linkType, link) => {
        setLinksList((previousLinks) => {
            const updatedLinks = {
                ...previousLinks,
                [linkType]: [
                    link,
                    ...previousLinks[linkType]
                ]
            };

            saveLinks(updatedLinks);

            return updatedLinks;
        });
    };

    const replaceLink = (linkType, linkId, updatedLink) => {
        setLinksList((previousLinks) => {
            const updatedLinks = {
                ...previousLinks,

                [linkType]: previousLinks[linkType].map(
                    (link) => {
                        const id =
                            link.slId || link.plId;
                        return id === linkId
                            ? updatedLink
                            : link;
                    }
                ),
            };

            saveLinks(updatedLinks);
            return updatedLinks;
        });
    };

    const removeLink = (linkType, linkId) => {
        setLinksList((previousLinks) => {
            const updatedLinks = {
                ...previousLinks,
                [linkType]: previousLinks[linkType].filter(
                    (link) => {
                        const id = link.slId || link.plId;
                        return id !== linkId;
                    }
                )
            };

            saveLinks(updatedLinks);
            return updatedLinks;
        });
    };
    const incrementClickCount = (linkId) => {
        setLinksList((previousLinks) => {
            const updatedLinks = {
                ...previousLinks,
                short: previousLinks.short.map((link) => {
                    const id = link.slId || link.plId;
                    return id === linkId
                        ? {
                            ...link,
                            clickCount: (link.clickCount || 0) + 1,
                        }
                        : link;
                }),
            };
            saveLinks(updatedLinks);
            return updatedLinks;
        });
    };
    const incrementCopyCount = (linkId) => {
        setLinksList((previousLinks) => {
            const updatedLinks = {
                ...previousLinks,
                private: previousLinks.private.map((link) => {
                    const id =
                        link.slId || link.plId;
                    return id === linkId
                        ? {
                            ...link,
                            copyCount: (link.copyCount || 0) + 1,
                        }
                        : link;
                }),
            };
            saveLinks(updatedLinks);
            return updatedLinks;
        });
    };
    return {
        addLink,
        replaceLink,
        removeLink,
        incrementClickCount,
        incrementCopyCount 
    };
}