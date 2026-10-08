import { FaSyncAlt } from "react-icons/fa";

const chartColors = {
    short: "var(--accent-300)",
    private: "var(--accent-600)",
};

function AnalyticsUsageDonut({
    shortUsage,
    privateUsage,
    refreshing,
    onRefresh,
}) {
    const total = shortUsage + privateUsage;
    const shortPercentage = total ? (shortUsage / total) * 100 : 0;
    const privatePercentage = total ? (privateUsage / total) * 100 : 0;
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const shortLength = (shortPercentage / 100) * circumference;

    return (
        <section className="grid min-w-0 grid-cols-1 gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 sm:grid-cols-[minmax(180px,0.7fr)_minmax(0,1.3fr)] sm:items-center sm:p-5 xl:grid-cols-[200px_minmax(0,1fr)]">
            <div className="relative mx-auto h-36 w-36 shrink-0 sm:h-40 sm:w-40">
                <svg
                    viewBox="0 0 140 140"
                    role="img"
                    aria-label={`Usage share: ${shortPercentage.toFixed(1)} percent short links, ${privatePercentage.toFixed(1)} percent private links`}
                    className="h-full w-full -rotate-90"
                >
                    <circle
                        cx="70"
                        cy="70"
                        r={radius}
                        fill="none"
                        stroke="#27272a"
                        strokeWidth="16"
                    />
                    {total > 0 && (
                        <>
                            <circle
                                cx="70"
                                cy="70"
                                r={radius}
                                fill="none"
                                stroke={chartColors.short}
                                strokeWidth="16"
                                strokeDasharray={`${shortLength} ${circumference - shortLength}`}
                            />
                            <circle
                                cx="70"
                                cy="70"
                                r={radius}
                                fill="none"
                                stroke={chartColors.private}
                                strokeWidth="16"
                                strokeDasharray={`${circumference - shortLength} ${shortLength}`}
                                strokeDashoffset={-shortLength}
                            />
                        </>
                    )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-white sm:text-4xl">
                        {total}
                    </span>
                    <span className="text-sm text-zinc-400">total uses</span>
                </div>
            </div>

            <div className="min-w-0">
                <div className="mb-3 flex items-center justify-between gap-2">
                    <h2 className="text-lg font-semibold text-white">
                        Usage by link type
                    </h2>
                    <button
                        type="button"
                        onClick={onRefresh}
                        disabled={refreshing}
                        aria-label="Refresh analytics"
                        title="Refresh analytics"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--accent-500) text-white transition hover:bg-(--accent-600) disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <FaSyncAlt
                            className={refreshing ? "animate-spin" : ""}
                        />
                    </button>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div className="flex items-center justify-between gap-3 rounded-xl bg-zinc-950/70 px-3 py-3 text-base">
                        <span className="flex items-center gap-2 text-zinc-300">
                            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-(--accent-300)" />
                            Short link clicks
                        </span>
                        <span className="shrink-0 font-semibold text-white">
                            {shortPercentage.toFixed(1)}%
                        </span>
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-xl bg-zinc-950/70 px-3 py-3 text-base">
                        <span className="flex items-center gap-2 text-zinc-300">
                            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-(--accent-600)" />
                            Private link copies
                        </span>
                        <span className="shrink-0 font-semibold text-white">
                            {privatePercentage.toFixed(1)}%
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AnalyticsUsageDonut;
