import { useState } from "react";
import { FaSearch, FaSyncAlt, FaStar } from "react-icons/fa";

function LinkSearchBar({
    onSearch,
    onRefresh,
    loading = false,
    favoritesOnly = false,
    onFavoritesToggle,
}) {
    const [search, setSearch] = useState("");

    const handleSearch = (event) => {
        event.preventDefault();
        onSearch?.(search.trim());
    };

    return (
        <div className="w-full px-4 py-4 sm:px-6 lg:px-8">
            <form className="w-full mx-auto flex gap-2 sm:gap-3" onSubmit={handleSearch}>

                {/* Search Input */}
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={search}
                        maxLength={200}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search links..."
                        className="
                            w-full
                            h-10
                            sm:h-11
                            px-4
                            sm:px-5
                            rounded-full
                            bg-zinc-950
                            border border-zinc-800
                            text-sm
                            text-white
                            placeholder:text-zinc-600
                            outline-none
                            focus:border-(--accent-400)
                            focus:ring-2
                            focus:ring-(--accent-400)
                            transition-all
                        "
                    />
                </div>

                {/* Search Button */}
                <button
                    type="submit"
                    aria-label="Search"
                    className="
                        h-9 w-9
                        sm:h-11 sm:w-11
                        shrink-0
                        rounded-full
                        flex
                        items-center
                        justify-center
                        bg-(--accent-500)
                        hover:bg-(--accent-600)
                        text-white
                        transition-all
                        active:scale-90
                    " 
                >
                    <FaSearch className="text-xs sm:text-sm" />
                </button>

                {/* Favourite Toggle */}
                <button
                    type="button"
                    onClick={onFavoritesToggle}
                    aria-label={favoritesOnly ? "Show all links" : "Show favorite links"}
                    aria-pressed={favoritesOnly}
                    className={`
                        h-9 w-9
                        sm:h-11 sm:w-11
                        shrink-0
                        rounded-full
                        flex
                        items-center
                        justify-center
                        border
                        transition-all
                        active:scale-90
                        ${
                            favoritesOnly
                                ? "border-amber-400 bg-amber-400/10"
                                : "border-(--accent-400) bg-transparent"
                        }
                    `}
                >
                    <FaStar
                        className={`text-md sm:text-md ${
                            favoritesOnly
                                ? "text-amber-400 fill-amber-400"
                                : "text-(--accent-400) fill-transparent stroke-(--accent-400) stroke-25"
                        }`}
                    />
                </button>

                {/* Refresh Button */}
                <button
                    type="button"
                    onClick={onRefresh}
                    disabled={loading}
                    aria-label="Refresh links"
                    className="
                        h-9 w-9
                        sm:h-11 sm:w-11
                        shrink-0
                        rounded-full
                        flex
                        items-center
                        justify-center
                        bg-(--accent-500)
                        hover:bg-(--accent-600)
                        text-white
                        transition-all
                        active:scale-90
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                    "
                >
                    <FaSyncAlt
                        className={`text-xs sm:text-sm ${
                            loading ? "animate-spin" : ""
                        }`}
                    />
                </button>

            </form>
        </div>
    );
}

export default LinkSearchBar;