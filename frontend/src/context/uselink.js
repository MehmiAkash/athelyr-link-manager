import { useContext } from "react";
import LinkContext from "./LinkContext";

export function useLinks() {
    return useContext(LinkContext);
}