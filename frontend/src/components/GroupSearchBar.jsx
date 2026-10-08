import { FaSearch } from "react-icons/fa";

function GroupSearchBar({
    value,
    onChange,
    onSearch,
    placeholder,
    ariaLabel,
}) {
    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                onSearch();
            }}
            role="search"
            className="flex h-10 min-w-0 w-full items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 text-zinc-400 focus-within:border-(--accent-400) sm:h-11 sm:px-4"
        >
            <input
                type="search"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                aria-label={ariaLabel}
                className="min-w-0 flex-1 bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
            />
            <button
                type="submit"
                aria-label="Search"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
            >
                <FaSearch className="text-sm" />
            </button>
        </form>
    );
}

export default GroupSearchBar;
