import { useState } from "react";

import { FaEdit, FaShareAlt, FaTrash } from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import { deleteLink } from "../services/getLinksService";

import { showToast } from "../services/toastService";

import ConfirmationPopup from "./ConfirmationPopup";

import { useLinkManagement } from "../context/UseLinkManagement";
import ShareLinkPopup from "./ShareLinkPopup";

function LinkActions({ linkType, link }) {

    const [loading, setLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showSharePopup, setShowSharePopup] = useState(false);

    const { removeLink } = useLinkManagement();

    const navigate = useNavigate();

    const handleDelete = async () => {

        const linkId = link.slId || link.plId;

        setLoading(true);

        try {

            await deleteLink(linkType, linkId);

            removeLink(linkType, linkId);

            showToast(
                "success",
                "Link deleted successfully"
            );

            setShowConfirmation(false);

        } catch (error) {

            showToast(
                "error",
                error.message
            );

        } finally {

            setLoading(false);
        }
    };

    const handleEdit = () => {

        navigate("/dashboard", {
            state: {
                editLink: link,
                linkType: linkType,
            },
        });
    };

    return (
        <>
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

                    {/* Share */}
                    <button
                        type="button"
                        onClick={() => setShowSharePopup(true)}
                        aria-label="Share link with a group"
                        className="
                            shrink-0
                            w-9
                            h-9
                            rounded-full
                            flex
                            items-center
                            justify-center
                            text-(--accent-400)
                            hover:text-white
                            hover:bg-zinc-800
                            transition-all
                            active:scale-90
                        "
                    >
                        <FaShareAlt size={14} />
                    </button>

                    {/* Edit */}
                    <button
                        type="button"
                        onClick={handleEdit}
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
                            setShowConfirmation(true)
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

            {showConfirmation && (
                <ConfirmationPopup
                    loading={loading}
                    onClose={() =>
                        setShowConfirmation(false)
                    }
                    onConfirm={handleDelete}
                />
            )}

            {showSharePopup && (
                <ShareLinkPopup
                    link={link}
                    linkType={linkType}
                    onClose={() => setShowSharePopup(false)}
                />
            )}
        </>
    );
}

export default LinkActions;