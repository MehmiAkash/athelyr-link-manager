import {
    FaArrowRight,
    FaChartLine,
    FaCheck,
    FaLink,
    FaLock,
    FaUsers,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "../context/useAuth";

function AccountAction({ to, className, children, ...props }) {
    return (
        <Link to={to} className={className} {...props}>
            {children}
        </Link>
    );
}

const features = [
    {
        icon: FaLink,
        number: "01",
        title: "Links, made simple",
        description:
            "Turn long URLs into clean short links, then keep everything easy to find in one place.",
        tone: "text-sky-300 bg-sky-300/10",
    },
    {
        icon: FaLock,
        number: "02",
        title: "Private by design",
        description:
            "Keep personal links in your private collection and share selected links with the right group.",
        tone: "text-violet-300 bg-violet-300/10",
    },
    {
        icon: FaUsers,
        number: "03",
        title: "Better together",
        description:
            "Create groups, bring members together, and organize shared links around the people who need them.",
        tone: "text-amber-300 bg-amber-300/10",
    },
    {
        icon: FaChartLine,
        number: "04",
        title: "See what gets used",
        description:
            "Get a clearer picture of link activity with built-in usage analytics and performance insights.",
        tone: "text-emerald-300 bg-emerald-300/10",
    },
];

function WorkspacePreview() {
    return (
        <div className="relative mx-auto w-full max-w-[580px]">
            <div className="absolute -inset-8 rounded-[2.5rem] bg-sky-400/10 blur-3xl" />
            <div className="absolute -right-4 -top-8 h-24 w-24 rounded-full border border-white/10" />
            <div className="absolute -bottom-8 -left-6 h-16 w-16 rounded-full border border-white/10" />

            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#111214]/95 shadow-2xl shadow-black/50">
                <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.07] text-sky-300">
                            <FaLink size={14} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">Your workspace</p>
                            <p className="mt-0.5 text-[11px] text-zinc-500">Everything connected</p>
                        </div>
                    </div>
                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-2.5 py-1 text-[10px] font-medium text-emerald-300">
                        All systems organized
                    </span>
                </div>

                <div className="grid grid-cols-3 gap-3 p-4 sm:gap-4 sm:p-6">
                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3 sm:p-4">
                        <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-sky-300/10 text-sky-300">
                            <FaLink size={12} />
                        </div>
                        <p className="text-[10px] text-zinc-500 sm:text-xs">Short links</p>
                        <p className="mt-1 text-xl font-semibold text-white sm:text-2xl">Links</p>
                    </div>
                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3 sm:p-4">
                        <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-violet-300/10 text-violet-300">
                            <FaLock size={12} />
                        </div>
                        <p className="text-[10px] text-zinc-500 sm:text-xs">Private space</p>
                        <p className="mt-1 text-xl font-semibold text-white sm:text-2xl">Yours</p>
                    </div>
                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3 sm:p-4">
                        <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-300/10 text-emerald-300">
                            <FaChartLine size={12} />
                        </div>
                        <p className="text-[10px] text-zinc-500 sm:text-xs">Insights</p>
                        <p className="mt-1 text-xl font-semibold text-white sm:text-2xl">Clear</p>
                    </div>
                </div>

                <div className="mx-4 mb-4 rounded-xl border border-white/[0.07] bg-white/[0.025] p-4 sm:mx-6 sm:mb-6 sm:p-5">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-white">Link activity</p>
                            <p className="mt-1 text-xs text-zinc-500">A quick look at your workspace</p>
                        </div>
                        <FaChartLine className="text-zinc-500" size={14} />
                    </div>
                    <div className="flex h-28 items-end gap-2 border-b border-l border-white/[0.07] px-2 sm:gap-3">
                        {[34, 52, 41, 68, 48, 78, 61, 90, 68, 100, 72, 86].map(
                            (height, index) => (
                                <div
                                    key={`${height}-${index}`}
                                    className={`flex-1 rounded-t-sm ${
                                        index === 9
                                            ? "bg-sky-300"
                                            : "bg-sky-300/25"
                                    }`}
                                    style={{ height: `${height}%` }}
                                />
                            )
                        )}
                    </div>
                    <div className="mt-2 flex justify-between pl-2 text-[10px] text-zinc-600">
                        <span>Organized links</span>
                        <span>Useful insights</span>
                    </div>
                </div>
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.03]" />
            </div>

            <div className="absolute -bottom-5 left-3 flex items-center gap-2 rounded-xl border border-white/10 bg-[#1b1c1f] px-3 py-2.5 shadow-xl sm:-left-8 sm:px-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-300/10 text-emerald-300">
                    <FaCheck size={11} />
                </span>
                <div>
                    <p className="text-[11px] font-medium text-white">Everything in its place</p>
                    <p className="mt-0.5 text-[10px] text-zinc-500">Links · Groups · Insights</p>
                </div>
            </div>
        </div>
    );
}

function LandingPage() {
    const { token } = useAuth();
    const isAuthenticated = Boolean(token);

    return (
        <main className="min-h-screen overflow-hidden bg-[#090a0c] text-white">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(56,189,248,0.09),transparent_45%)]" />
            <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
                <Link to="/Home" aria-label="Athelyr Link Manager home" className="scale-[0.78] origin-left sm:scale-90">
                    <Logo />
                </Link>
                <nav className="flex items-center gap-2 sm:gap-3" aria-label="Main navigation">
                    <a
                        href="#features"
                        className="hidden rounded-full px-4 py-2 text-sm text-zinc-400 transition hover:text-white sm:inline-flex"
                    >
                        Features
                    </a>
                    {isAuthenticated ? (
                        <AccountAction
                            to="/dashboard"
                            className="rounded-full border border-white/15 bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-sky-100 sm:px-5"
                        >
                            Dashboard
                        </AccountAction>
                    ) : (
                        <>
                            <AccountAction
                                to="/login"
                                className="rounded-full px-4 py-2 text-sm font-medium text-zinc-300 transition hover:text-white sm:px-5"
                            >
                                Log in
                            </AccountAction>
                            <AccountAction
                                to="/register"
                                className="rounded-full border border-white/15 bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-sky-100 sm:px-5"
                            >
                                Get started
                            </AccountAction>
                        </>
                    )}
                </nav>
            </header>

            <section className="relative mx-auto grid min-h-[620px] w-full max-w-7xl items-center gap-14 px-5 pb-24 pt-12 sm:px-8 sm:pt-16 lg:min-h-[690px] lg:grid-cols-[0.95fr_1.05fr] lg:gap-12 lg:px-10 lg:pb-28 lg:pt-10">
                <div className="relative z-10 max-w-2xl">
                    <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-zinc-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-sky-300 shadow-[0_0_10px_rgba(125,211,252,0.8)]" />
                        One home for every link
                    </div>
                    <h1 className="max-w-2xl text-5xl font-semibold leading-[1.06] tracking-[-0.055em] sm:text-6xl lg:text-[4.4rem]">
                        Your links,
                        <br />
                        <span className="bg-gradient-to-r from-white via-zinc-200 to-sky-200 bg-clip-text text-transparent">
                            finally in sync.
                        </span>
                    </h1>
                    <p className="mt-6 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
                        Create short links, keep private ones close, and share
                        with your people. A calmer way to organize and understand
                        every link you use.
                    </p>

                    <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                        {isAuthenticated ? (
                            <AccountAction
                                to="/dashboard"
                                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-sky-300 px-6 text-sm font-semibold text-zinc-950 shadow-lg shadow-sky-950/30 transition hover:-translate-y-0.5 hover:bg-sky-200"
                            >
                                Open your dashboard
                                <FaArrowRight className="transition-transform group-hover:translate-x-0.5" size={12} />
                            </AccountAction>
                        ) : (
                            <>
                                <AccountAction
                                    to="/register"
                                    className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-sky-300 px-6 text-sm font-semibold text-zinc-950 shadow-lg shadow-sky-950/30 transition hover:-translate-y-0.5 hover:bg-sky-200"
                                >
                                    Create your account
                                    <FaArrowRight className="transition-transform group-hover:translate-x-0.5" size={12} />
                                </AccountAction>
                                <AccountAction
                                    to="/login"
                                    className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.035] px-6 text-sm font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.07]"
                                >
                                    Log in
                                </AccountAction>
                            </>
                        )}
                    </div>
                    <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-500">
                        <span className="inline-flex items-center gap-2">
                            <FaCheck className="text-emerald-300" size={10} />
                            Your own private links
                        </span>
                        <span className="inline-flex items-center gap-2">
                            <FaCheck className="text-emerald-300" size={10} />
                            Shared group spaces
                        </span>
                    </div>
                </div>

                <div className="relative z-10 py-4 sm:py-8 lg:py-0">
                    <WorkspacePreview />
                </div>
            </section>

            <section id="features" className="relative border-t border-white/[0.07] bg-white/[0.015]">
                <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
                    <div className="mb-12 flex flex-col justify-between gap-5 sm:mb-14 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
                                Made to work together
                            </p>
                            <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
                                Everything your links need.
                            </h2>
                        </div>
                        <p className="max-w-md text-sm leading-6 text-zinc-400 sm:text-base">
                            Less hunting through tabs and messages. More time
                            putting your links to work.
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {features.map(({ icon: Icon, number, title, description, tone }) => (
                            <article
                                key={number}
                                className="group rounded-2xl border border-white/[0.08] bg-[#101113] p-5 transition duration-300 hover:-translate-y-1 hover:border-white/[0.16] hover:bg-[#141518] sm:p-6"
                            >
                                <div className="flex items-center justify-between">
                                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
                                        <Icon size={15} />
                                    </span>
                                    <span className="font-mono text-xs text-zinc-700">{number}</span>
                                </div>
                                <h3 className="mt-8 text-base font-semibold text-white">
                                    {title}
                                </h3>
                                <p className="mt-2 text-sm leading-6 text-zinc-500">
                                    {description}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#171a1e] to-[#101113] px-6 py-10 text-center sm:px-12 sm:py-14">
                    <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-96 -translate-x-1/2 rounded-full bg-sky-300/[0.08] blur-3xl" />
                    <div className="relative">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
                            Start with a little more clarity
                        </p>
                        <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
                            Bring all your links into focus.
                        </h2>
                        <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-zinc-400 sm:text-base">
                            Set up your workspace and make every link easier to
                            manage, share, and understand.
                        </p>
                        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                            {isAuthenticated ? (
                                <AccountAction
                                    to="/dashboard"
                                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-zinc-950 transition hover:bg-sky-100"
                                >
                                    Open your dashboard
                                    <FaArrowRight size={11} />
                                </AccountAction>
                            ) : (
                                <>
                                    <AccountAction
                                        to="/register"
                                        className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-zinc-950 transition hover:bg-sky-100"
                                    >
                                        Get started
                                        <FaArrowRight size={11} />
                                    </AccountAction>
                                    <AccountAction
                                        to="/login"
                                        className="inline-flex h-11 items-center justify-center rounded-full border border-white/15 px-6 text-sm font-medium text-zinc-200 transition hover:bg-white/[0.06]"
                                    >
                                        I already have an account
                                    </AccountAction>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <footer className="border-t border-white/[0.07] px-5 py-6 sm:px-8 lg:px-10">
                <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 text-xs text-zinc-600 sm:flex-row">
                    <span>© {new Date().getFullYear()} Athelyr Link Manager</span>
                    <span>Keep your links connected.</span>
                </div>
            </footer>
        </main>
    );
}

export default LandingPage;
