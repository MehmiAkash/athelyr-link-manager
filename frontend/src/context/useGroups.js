import { useContext } from "react";

import GroupContext from "./GroupContext";

export function useGroups() {
    const context = useContext(GroupContext);

    if (!context) {
        throw new Error("useGroups must be used within a GroupProvider");
    }

    return context;
}
