import { useEffect, useState } from "react";

import AnalyticsUsageChart from "../../components/AnalyticsUsageChart";
import AnalyticsUsageDonut from "../../components/AnalyticsUsageDonut";
import { getAnalytics } from "../../services/analyticsService";
import { showToast } from "../../services/toastService";

function Analytics() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const refreshAnalytics = async () => {
        setRefreshing(true);
        try {
            setAnalytics(await getAnalytics());
        } catch (error) {
            showToast("error", error.message);
        } finally {
            setRefreshing(false);
        }
    };

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
                    setLoading(false);
                }
            });

        return () => {
            isCurrent = false;
        };
    }, []);

    return (
        <main className="w-full min-w-0 px-4 pb-8 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-16">
            {loading && !analytics ? (
                <p className="rounded-2xl border border-zinc-800 bg-zinc-900/70 py-10 text-center text-sm text-zinc-500">
                    Loading analytics...
                </p>
            ) : (
                <div className="space-y-4">
                    <AnalyticsUsageDonut
                        shortUsage={analytics?.totalShortLinkUsage || 0}
                        privateUsage={analytics?.totalPrivateLinkUsage || 0}
                        refreshing={refreshing}
                        onRefresh={refreshAnalytics}
                    />
                    <AnalyticsUsageChart links={analytics?.topLinks || []} />
                </div>
            )}
        </main>
    );
}

export default Analytics;
