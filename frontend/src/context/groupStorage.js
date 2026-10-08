const GROUPS_KEY = "groups";

export function getStoredGroups() {
    const storedGroups = localStorage.getItem(GROUPS_KEY);

    return storedGroups ? JSON.parse(storedGroups) : [];
}

export function saveGroups(groups) {
    localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
}
