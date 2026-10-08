import { useCallback, useEffect, useRef, useState } from "react";

import GroupContext from "./GroupContext";
import { getStoredGroups, saveGroups } from "./groupStorage";
import { getGroups } from "../services/groupLinkService";

export function GroupProvider({ children }) {
    const [groups, setGroups] = useState(() => getStoredGroups());
    const [groupsLoaded, setGroupsLoaded] = useState(false);
    const loadPromise = useRef(null);
    const requestGeneration = useRef(0);

    useEffect(() => {
        const clearCachedGroups = () => {
            requestGeneration.current += 1;
            loadPromise.current = null;
            setGroups([]);
            setGroupsLoaded(false);
            localStorage.removeItem("groups");
        };

        window.addEventListener("app:logout", clearCachedGroups);
        return () => window.removeEventListener("app:logout", clearCachedGroups);
    }, []);

    const updateGroups = useCallback((updater) => {
        setGroups((currentGroups) => {
            const nextGroups =
                typeof updater === "function" ? updater(currentGroups) : updater;
            saveGroups(nextGroups);
            return nextGroups;
        });
    }, []);

    const ensureGroupsLoaded = useCallback(() => {
        if (groupsLoaded) {
            return Promise.resolve();
        }

        if (loadPromise.current) {
            return loadPromise.current;
        }

        const generation = requestGeneration.current;
        loadPromise.current = getGroups()
            .then((loadedGroups) => {
                const normalizedGroups = Array.isArray(loadedGroups)
                    ? loadedGroups
                    : [];
                if (requestGeneration.current === generation) {
                    updateGroups(normalizedGroups);
                    setGroupsLoaded(true);
                }
                return normalizedGroups;
            })
            .finally(() => {
                loadPromise.current = null;
            });

        return loadPromise.current;
    }, [groupsLoaded, updateGroups]);

    const refreshGroups = useCallback(async () => {
        const generation = requestGeneration.current;
        const loadedGroups = await getGroups();
        const normalizedGroups = Array.isArray(loadedGroups)
            ? loadedGroups
            : [];
        if (requestGeneration.current !== generation) {
            return [];
        }
        updateGroups(normalizedGroups);
        setGroupsLoaded(true);
        return normalizedGroups;
    }, [updateGroups]);

    return (
        <GroupContext.Provider
            value={{
                groups,
                groupsLoaded,
                updateGroups,
                ensureGroupsLoaded,
                refreshGroups,
            }}
        >
            {children}
        </GroupContext.Provider>
    );
}
