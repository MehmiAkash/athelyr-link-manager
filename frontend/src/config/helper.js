import ENDPOINTS from "./endpoints";

export function linkTypeMap(linkType) {
    const endpointMap = {
        short: ENDPOINTS.SHORTLINK,
        private: ENDPOINTS.PRIVATELINK,
    }
    return endpointMap[linkType];
}