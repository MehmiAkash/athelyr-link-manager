import { useState } from "react";

import { FaStar } from "react-icons/fa";

import { createLink, updateLink } from "../services/createLinkService";

import Loader from "./Loader";

import { showToast } from "../services/toastService";

import { useLinkManagement } from "../context/UseLinkManagement";
import {
    VALIDATION_MESSAGES,
    validateUrl,
} from "../config/validationMessages";

function CreateLink({ linktype, editLink }) {

    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState(
        editLink?.title || ""
    );

    const [url, setUrl] = useState(
        editLink?.url || ""
    );

    const [favourite, setFavourite] = useState(
        editLink?.favourite || false
    );
    const [errors, setErrors] = useState({});

    const { addLink , replaceLink } = useLinkManagement();

    const handleSubmit = async (e) => {

        e.preventDefault();

        const validationErrors = {};
        if (!title.trim()) {
            validationErrors.title = VALIDATION_MESSAGES.REQUIRED("Title");
        }
        const urlError = validateUrl(url);
        if (urlError) {
            validationErrors.url = urlError;
        }
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length) {
            return;
        }

        const data = {
            title: title.trim(),
            url: url.trim(),
            favourite,
        };

        setLoading(true);

        try {

            if (editLink) {
                const linkId = editLink.slId || editLink.plId;
                const updatedLink = await  updateLink(data, linkId ,linktype);
                replaceLink(linktype , linkId , updatedLink)
                showToast(
                    "success",
                    "Link updated successfully"
                );

            } else {

                const createdLink =
                    await createLink(data, linktype);

                addLink(
                    linktype,
                    createdLink
                );

                showToast(
                    "success",
                    "Link created successfully"
                );

                setTitle("");
                setUrl("");
                setFavourite(false);
                setErrors({});
            }

        } catch (error) {

            showToast(
                "error",
                error.message
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="
            w-full
            px-4
            py-4
            sm:px-6
            lg:px-8
        ">

            {loading && <Loader />}

            <div className="
                w-full
                mx-auto
                bg-zinc-900/80
                border
                border-zinc-800
                rounded-3xl
                px-5
                py-5
                md:px-5
                md:py-4
                shadow-xl
            ">

                <form onSubmit={handleSubmit} noValidate>

                    <div className="
                        flex
                        flex-col
                        md:flex-row
                        gap-4
                    ">

                        {/* Title */}

                        <div className="flex-1">

                            <label className="
                                block
                                text-xs
                                text-zinc-100
                                mb-1.5
                                ml-3
                            ">
                                Title
                            </label>

                            <input
                                type="text"
                                value={title}
                                onChange={(e) =>
                                    {
                                        setTitle(e.target.value);
                                        if (errors.title) {
                                            setErrors((current) => ({
                                                ...current,
                                                title: "",
                                            }));
                                        }
                                    }
                                }
                                placeholder="Enter title"
                                aria-invalid={Boolean(errors.title)}
                                className="
                                    w-full
                                    h-11
                                    px-5
                                    rounded-full
                                    bg-zinc-950
                                    border
                                    border-zinc-800
                                    text-sm
                                    text-white
                                    placeholder:text-zinc-600
                                    outline-none
                                    focus:border-(--accent-400)
                                    focus:ring-2
                                    focus:ring-(--accent-400)
                                "
                            />
                            <p className="ml-3 min-h-4 text-xs text-red-400/80">
                                {errors.title || " "}
                            </p>

                        </div>

                        {/* URL */}

                        <div className="flex-2">

                            <label className="
                                block
                                text-xs
                                text-zinc-100
                                mb-1.5
                                ml-3
                            ">
                                URL
                            </label>

                            <div className="relative">

                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) =>
                                        {
                                            setUrl(e.target.value);
                                            if (errors.url) {
                                                setErrors((current) => ({
                                                    ...current,
                                                    url: "",
                                                }));
                                            }
                                        }
                                    }
                                    placeholder="https://example.com/..."
                                    aria-invalid={Boolean(errors.url)}
                                    className="
                                        w-full
                                        h-11
                                        pl-5
                                        pr-14
                                        rounded-full
                                        bg-zinc-950
                                        border
                                        border-zinc-800
                                        text-sm
                                        text-white
                                        placeholder:text-zinc-600
                                        outline-none
                                        focus:border-(--accent-400)
                                        focus:ring-2
                                        focus:ring-(--accent-400)
                                    "
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setFavourite(
                                            !favourite
                                        )
                                    }
                                    aria-label="Favourite"
                                    className="
                                        absolute
                                        right-2
                                        top-1/2
                                        -translate-y-1/2
                                        w-8
                                        h-8
                                        rounded-full
                                        flex
                                        items-center
                                        justify-center
                                        hover:bg-zinc-800
                                        transition-all
                                        active:scale-90
                                    "
                                >
                                    <FaStar
                                        className={
                                            favourite
                                                ? "text-yellow-400"
                                                : "text-zinc-600"
                                        }
                                    />
                                </button>

                            </div>
                            <p className="ml-3 min-h-4 text-xs text-red-400/80">
                                {errors.url || " "}
                            </p>

                        </div>

                    </div>

                    {/* Submit */}

                    <div className="
                        flex
                        justify-end
                        mt-4
                    ">

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                w-full
                                md:w-auto
                                h-10
                                px-7
                                rounded-full
                                bg-(--accent-500)
                                hover:bg-(--accent-600)
                                active:scale-95
                                text-md
                                font-medium
                                text-white
                                transition-all
                                disabled:opacity-50
                            "
                        >
                            {editLink
                                ? "Update Link"
                                : "Add Link"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default CreateLink;