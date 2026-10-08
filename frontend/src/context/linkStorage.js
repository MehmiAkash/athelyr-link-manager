const LINKS_KEY = "links";

export function getStoredLinks() {

    const storedLinks = localStorage.getItem(LINKS_KEY);

    return storedLinks
        ? JSON.parse(storedLinks)
        : {
            short: [],
            private: []
        };
}

export function saveLinks(linksList) {
    localStorage.setItem(
        LINKS_KEY,
        JSON.stringify(linksList)
    );
}