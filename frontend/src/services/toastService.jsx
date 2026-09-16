import { toast } from "react-toastify";
import {
    FiCheckCircle,
    FiXCircle,
    FiAlertTriangle,
    FiInfo
} from "react-icons/fi";

export function showToast(type, message) {

    const icons = {
        success: <FiCheckCircle className="text-white text-xl" />,
        error: <FiXCircle className="text-white text-xl" />,
        warning: <FiAlertTriangle className="text-white text-xl" />,
        info: <FiInfo className="text-white text-xl" />
    };

    switch (type) {
        case "success":
            toast.success(message, {
                icon: icons.success
            });
            break;

        case "error":
            toast.error(message, {
                icon: icons.error
            });
            break;

        case "warning":
            toast.warning(message, {
                icon: icons.warning
            });
            break;

        case "info":
            toast.info(message, {
                icon: icons.info
            });
            break;

        default:
            toast(message, {
                icon: icons.info
            });
    }
}