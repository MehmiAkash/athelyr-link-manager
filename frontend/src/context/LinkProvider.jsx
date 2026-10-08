import { useEffect, useState } from "react";

import LinkContext from "./LinkContext";

import { getStoredLinks } from "../context/linkStorage";

export function LinkProvider({ children }) {
    const [linksList, setLinksList] = useState(() => {
        return getStoredLinks();
    });
    const [linksLoaded, setLinksLoaded] = useState(false);

    useEffect(() => {
        const clearCachedLinks = () => {
            setLinksList({ short: [], private: [] });
            setLinksLoaded(false);
            localStorage.removeItem("links");
        };

        window.addEventListener("app:logout", clearCachedLinks);
        return () => window.removeEventListener("app:logout", clearCachedLinks);
    }, []);
    return (
        <LinkContext.Provider
            value={{
                linksList,
                setLinksList,
                linksLoaded,
                setLinksLoaded
            }}
        >
            {children}
        </LinkContext.Provider>
    );
}