import { EMPTY_STATE_MESSAGES } from "../config/emptyStateMessages";

const chartColors = {
    short: "var(--accent-300)",
    private: "var(--accent-600)",
};

function AnalyticsUsageChart({ links }) {
    const width = 600;
    const height = 270;
    const padding = { top: 22, right: 24, bottom: 38, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const maxValue = Math.max(1, ...links.map((link) => link.usageCount));
    const points = links.map((link, index) => {
        const x =
            padding.left +
            (links.length === 1
                ? chartWidth / 2
                : (index / (links.length - 1)) * chartWidth);
        const y =
            padding.top +
            chartHeight -
            (link.usageCount / maxValue) * chartHeight;
        return { x, y, link };
    });

    return (
        <section className="min-w-0 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="truncate text-base font-semibold text-white sm:text-lg">
                    Top 10 link usage
                </h2>
                <span className="shrink-0 text-sm text-zinc-400">
                    Clicks and copies
                </span>
            </div>
            {links.length ? (
                <>
                    <div className="mb-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-zinc-300">
                        <span className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-(--accent-300)" />
                            Short link clicks
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-(--accent-600)" />
                            Private link copies
                        </span>
                    </div>
                    <svg
                        viewBox={`0 0 ${width} ${height}`}
                        role="img"
                        aria-label="Top ten links ranked by clicks and copies"
                        className="mx-auto block h-auto w-full max-w-4xl"
                    >
                        {[0, 1, 2, 3, 4].map((step) => {
                            const y = padding.top + (step / 4) * chartHeight;
                            const value = Math.round(maxValue * (1 - step / 4));
                            return (
                                <g key={step}>
                                    <line
                                        x1={padding.left}
                                        x2={width - padding.right}
                                        y1={y}
                                        y2={y}
                                        stroke="#27272a"
                                        strokeDasharray="4 5"
                                    />
                                    <text
                                        x={padding.left - 7}
                                        y={y + 4}
                                        textAnchor="end"
                                        fill="#71717a"
                                        fontSize="16"
                                    >
                                        {value}
                                    </text>
                                </g>
                            );
                        })}
                        {points.length > 1 && (
                            <polyline
                                points={points
                                    .map(({ x, y }) => `${x},${y}`)
                                    .join(" ")}
                                fill="none"
                                stroke="#71717a"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        )}
                        {points.map(({ x, y, link }, index) => (
                            <g key={`${link.linkType}-${link.linkId}`}>
                                <circle
                                    cx={x}
                                    cy={y}
                                    r="5"
                                    fill={
                                        link.linkType === "SHORT"
                                            ? chartColors.short
                                            : chartColors.private
                                    }
                                    stroke="#18181b"
                                    strokeWidth="2"
                                />
                                <text
                                    x={x}
                                    y={height - 5}
                                    textAnchor="middle"
                                    fill="#a1a1aa"
                                    fontSize="16"
                                >
                                    {index + 1}
                                </text>
                            </g>
                        ))}
                    </svg>
                    <ol className="mt-2 grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                        {links.map((link, index) => (
                            <li
                                key={`${link.linkType}-${link.linkId}`}
                                className="flex min-w-0 items-center justify-between gap-3 border-b border-zinc-800/70 py-3 text-sm sm:text-base"
                            >
                                <span className="min-w-0 truncate text-zinc-300">
                                    <span className="mr-2 text-zinc-600">
                                        {index + 1}.
                                    </span>
                                    <span className="mr-1 text-zinc-500">
                                        {link.linkType === "SHORT"
                                            ? "Short"
                                            : "Private"}
                                        :
                                    </span>
                                    {link.title || "Untitled link"}
                                </span>
                                <span className="shrink-0 text-base font-semibold text-white sm:text-lg">
                                    {link.usageCount}
                                </span>
                            </li>
                        ))}
                    </ol>
                </>
            ) : (
                <p className="py-8 text-center text-sm text-zinc-500">
                    {EMPTY_STATE_MESSAGES.LINK_USAGE}
                </p>
            )}
        </section>
    );
}

export default AnalyticsUsageChart;
