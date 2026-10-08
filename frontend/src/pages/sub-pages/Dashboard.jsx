import { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";

import LinkTypeSwitch from "../../components/LinkTypeSwitch";
import CreateLink from "../../components/CreateLink";
import TopUsedLinks from "../../components/TopUsedLinks";
import { getAnalytics } from "../../services/analyticsService";
import { showToast } from "../../services/toastService";

function Dashboard() {
    const location = useLocation();
    const [linkType, setLinkType] = useState(
        location.state?.linkType || "short"
    );
    const editLink = location.state?.editLink || null;
    const [analytics, setAnalytics] = useState(null);
    const [analyticsLoading, setAnalyticsLoading] = useState(true);

    useEffect(() => {
        let isCurrent = true;
        getAnalytics()
            .then((data) => {
                if (isCurrent) {
                    setAnalytics(data);
                }
            })
            .catch((error) => {
                if (isCurrent) {
                    showToast("error", error.message);
                }
            })
            .finally(() => {
                if (isCurrent) {
                    setAnalyticsLoading(false);
                }
            });

        return () => {
            isCurrent = false;
        };
    }, []);

    return (
        <div className="w-full">
            <LinkTypeSwitch
                selected={linkType}
                onChange={setLinkType}
            />
            <CreateLink
                linktype={linkType}
                editLink={editLink}
            />
            <div className="mt-6 grid w-full min-w-0 grid-cols-1 gap-4 px-4 pb-3 sm:px-6 lg:grid-cols-2 lg:px-8">
                <TopUsedLinks
                    title="Top 5 Short Links"
                    links={analytics?.topShortLinks || []}
                    usageLabel="clicks"
                    accentClass="text-(--accent-300)"
                    loading={analyticsLoading}
                />
                <TopUsedLinks
                    title="Top 5 Private Links"
                    links={analytics?.topPrivateLinks || []}
                    usageLabel="copies"
                    accentClass="text-(--accent-600)"
                    loading={analyticsLoading}
                />
            </div>
        </div>
    );
}

export default Dashboard;