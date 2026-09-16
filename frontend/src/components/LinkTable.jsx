import {
    FaCopy,
    FaEdit,
    FaTrash,
    FaStar,
} from "react-icons/fa";


function LinkTable({ linktype, showFavourite = false }) {

    const shortLinks = [
        {
            slId: "1",
            title: "Google jhgadhjghafgaihkhfbkjhabjhdagkhfgbakhjbfgkjhafghkjagfihjbakhfbakhdfbvhjbfv",
            url: "https://google.com",
            shortCode: "abc123",
            favourite: true,
            clickCount: 99999999999999,
            createdAt: "2026-09-12T20:36:06.952Z",
        },
        {
            slId: "2",
            title: "GitHub",
            url: "https://github.com",
            shortCode: "git456",
            favourite: false,
            clickCount: 7,
            createdAt: "2026-09-11T18:20:06.952Z",
        },
    ];

    const privateLinks = [
        {
            plId: "1",
            title: "My Private Page",
            url: "https://example.com/private",
            favourite: true,
            copyCount: 8,
            createdAt: "2026-09-12T20:38:45.776Z",
        },
        {
            plId: "2",
            title: "Important Document",
            url: "https://example.com/documentadsadadasdasdsdad",
            favourite: false,
            copyCount: 3,
            createdAt: "2026-09-11T16:20:45.776Z",
        },
    ];

    const links = linktype === "short"
        ? shortLinks
        : privateLinks;


    const getUrl = (link) => {

        if (linktype === "short") {
            return `${window.location.origin}/${link.shortCode}`;
        }

        return link.url;
    };


    const handleCopy = async (link) => {

        const url = getUrl(link);

        try {

            await navigator.clipboard.writeText(url);

            console.log("Copied:", url);

        } catch (error) {

            console.error("Copy failed:", error);

        }
    };


    const handleEdit = (link) => {
        console.log("Edit:", link);
    };


    const handleDelete = (link) => {
        console.log("Delete:", link);
    };


    const formatDate = (date) => {

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });

    };


    /*
     * Desktop columns:
     * Title       -> minimum 120px
     * Link        -> minimum 150px
     * Clicks      -> minimum 70px
     * Created     -> minimum 85px
     * Actions     -> minimum 75px
     */
    const gridCols =
        "grid-cols-[1fr_0.3fr] lg:grid-cols-[minmax(120px,0.9fr)_minmax(150px,1.1fr)_minmax(70px,0.25fr)_minmax(85px,0.45fr)_minmax(75px,0.5fr)]";


    // Reusable horizontal scroll style
    const scrollClasses = `
        min-w-0
        max-w-full
        overflow-x-auto
        whitespace-nowrap
        scroll-smooth
        [&::-webkit-scrollbar]:h-0.75
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-black
        [&::-webkit-scrollbar-thumb]:rounded-full
    `;


    // Reusable desktop column separator
    const columnBorderClass = `
        lg:border-r
        lg:border-zinc-800/70
        lg:pr-4
    `;


    // Reusable scrollbar configuration
    const scrollbarStyle = {
        scrollbarWidth: "thin",
        scrollbarColor: "black transparent",
    };


    return (

        <div className="w-full px-6 py-4 lg:px-4 lg:py-4">

            {/* Links */}

            <div className="
                w-full
                min-w-0
                bg-zinc-900/80
                border border-zinc-800
                rounded-3xl
                overflow-hidden
                shadow-xl
            ">

                {/* Header */}

                <div className={`
                    hidden
                    lg:grid
                    ${gridCols}
                    gap-4
                    items-center
                    px-6
                    py-4
                    bg-zinc-950/70
                    text-xs
                    text-(--accent-400)
                    uppercase
                    tracking-wider
                    sticky
                    top-0
                    z-10
                `}>

                    {/* Title */}

                    <div className={`
                        min-w-0
                        flex
                        items-center
                        gap-2
                        ${columnBorderClass}
                    `}>

                        <span>Title</span>

                        {showFavourite && (
                            <FaStar
                                size={12}
                                className="text-yellow-400"
                            />
                        )}

                    </div>


                    {/* Link */}

                    <div className={`
                        min-w-0
                        ${columnBorderClass}
                    `}>

                        {linktype === "short"
                            ? "Short Link"
                            : "Private Link"
                        }

                    </div>


                    {/* Clicks / Copies */}

                    <div className={`
                        min-w-0
                        ${columnBorderClass}
                    `}>

                        {linktype === "short"
                            ? "Clicks"
                            : "Copies"
                        }

                    </div>


                    {/* Created */}

                    <div className={`
                        min-w-0
                        ${columnBorderClass}
                    `}>

                        Created

                    </div>


                    {/* Actions */}

                    <div></div>

                </div>


                {/* Rows */}

                <div className="max-h-[65vh] overflow-y-auto divide-y divide-zinc-800">

                    {links.map((link) => {

                        const displayUrl = getUrl(link);

                        return (

                            <div
                                key={link.slId || link.plId}
                                className={`
                                    grid
                                    ${gridCols}
                                    gap-x-4
                                    gap-y-2
                                    lg:gap-4
                                    items-center
                                    px-4
                                    py-3
                                    lg:px-6
                                    lg:py-4
                                    hover:bg-zinc-800/30
                                    transition-colors
                                `}
                            >

                                {/* Title */}

                                <div className={`
                                    min-w-0
                                    order-1
                                    lg:order-0
                                    ${columnBorderClass}
                                `}>

                                    {/* Mobile / Tablet Title */}

                                    <div className="
                                        flex
                                        items-center
                                        gap-2
                                        lg:hidden
                                        text-xs
                                        text-zinc-300
                                        mb-0.5
                                    ">

                                        <span>Title</span>

                                        {showFavourite && (
                                            <FaStar
                                                size={10}
                                                className="text-yellow-400"
                                            />
                                        )}

                                    </div>


                                    {/* Title Scroll */}

                                    <div
                                        className={scrollClasses}
                                        style={scrollbarStyle}
                                    >

                                        <span className="
                                            text-sm
                                            text-white
                                            font-medium
                                        ">
                                            {link.title}
                                        </span>

                                    </div>

                                </div>


                                {/* URL */}

                                <div className={`
                                    min-w-0
                                    col-span-2
                                    order-3
                                    lg:order-0
                                    lg:col-span-1
                                    ${columnBorderClass}
                                `}>

                                    <p className="
                                        lg:hidden
                                        text-xs
                                        text-zinc-300
                                        mb-0.5
                                    ">
                                        {linktype === "short"
                                            ? "Short Link"
                                            : "Private Link"
                                        }
                                    </p>


                                    {/* URL + Copy Button */}

                                    <div className="
                                        flex
                                        items-center
                                        gap-2
                                        min-w-0
                                    ">

                                        {/* URL Scroll */}

                                        <div
                                            className={`
                                                flex-1
                                                ${scrollClasses}
                                            `}
                                            style={scrollbarStyle}
                                        >

                                            {linktype === "short" ? (

                                                <a
                                                    href={displayUrl}
                                                    className="
                                                        text-sm
                                                        text-(--accent-300)
                                                        hover:text-(--accent-200)
                                                        hover:underline
                                                        whitespace-nowrap
                                                    "
                                                    title={displayUrl}
                                                >
                                                    {displayUrl}
                                                </a>

                                            ) : (

                                                <span
                                                    className="
                                                        text-sm
                                                        text-zinc-400
                                                        whitespace-nowrap
                                                    "
                                                    title={displayUrl}
                                                >
                                                    {displayUrl}
                                                </span>

                                            )}

                                        </div>


                                        {/* Copy Button - Fixed */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleCopy(link)
                                            }
                                            aria-label="Copy link"
                                            className="
                                                shrink-0
                                                w-8
                                                h-8
                                                rounded-full
                                                flex
                                                items-center
                                                justify-center
                                                text-zinc-400
                                                hover:text-white
                                                hover:bg-zinc-800
                                                transition-all
                                                active:scale-90
                                            "
                                        >
                                            <FaCopy size={13} />
                                        </button>

                                    </div>

                                </div>


                                {/* Clicks / Copies */}

                                <div className={`
                                    order-2
                                    lg:order-0
                                    min-w-0
                                    ${columnBorderClass}
                                `}>

                                    <p className="
                                        lg:hidden
                                        text-xs
                                        text-zinc-300
                                        mb-0.5
                                    ">
                                        {linktype === "short"
                                            ? "Clicks"
                                            : "Copies"
                                        }
                                    </p>


                                    {/* Clicks / Copies Scroll */}

                                    <div
                                        className={scrollClasses}
                                        style={scrollbarStyle}
                                    >

                                        <p className="
                                            text-sm
                                            text-zinc-400
                                            whitespace-nowrap
                                        ">
                                            {linktype === "short"
                                                ? link.clickCount
                                                : link.copyCount
                                            }
                                        </p>

                                    </div>

                                </div>


                                {/* Created */}

                                <div className={`
                                    order-4
                                    lg:order-0
                                    min-w-0
                                    ${columnBorderClass}
                                `}>

                                    <p className="
                                        lg:hidden
                                        text-xs
                                        text-zinc-300
                                        mb-0.5
                                    ">
                                        Created
                                    </p>


                                    {/* Created Scroll */}

                                    <div
                                        className={scrollClasses}
                                        style={scrollbarStyle}
                                    >

                                        <p className="
                                            text-sm
                                            text-zinc-300
                                            whitespace-nowrap
                                        ">
                                            {formatDate(link.createdAt)}
                                        </p>

                                    </div>

                                </div>


                                {/* Actions - NO SCROLL */}

                                <div className="
                                    order-5
                                    lg:order-0
                                    min-w-0
                                ">

                                    <div className="
                                        flex
                                        justify-end
                                        items-center
                                        gap-1
                                        lg:-mr-1
                                    ">

                                        {/* Edit */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEdit(link)
                                            }
                                            aria-label="Edit link"
                                            className="
                                                shrink-0
                                                w-9
                                                h-9
                                                rounded-full
                                                flex
                                                items-center
                                                justify-center
                                                text-(--accent-500)
                                                hover:text-white
                                                hover:bg-zinc-800
                                                transition-all
                                                active:scale-90
                                            "
                                        >
                                            <FaEdit size={14} />
                                        </button>


                                        {/* Delete */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(link)
                                            }
                                            aria-label="Delete link"
                                            className="
                                                shrink-0
                                                w-9
                                                h-9
                                                rounded-full
                                                flex
                                                items-center
                                                justify-center
                                                text-(--accent-600)
                                                hover:text-white
                                                hover:bg-zinc-800
                                                transition-all
                                                active:scale-90
                                            "
                                        >
                                            <FaTrash size={13} />
                                        </button>

                                    </div>

                                </div>

                            </div>

                        );

                    })}

                </div>

            </div>

        </div>
    );
}

export default LinkTable;