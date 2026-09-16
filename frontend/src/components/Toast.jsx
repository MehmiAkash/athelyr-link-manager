import { ToastContainer } from "react-toastify";

function Toast() {
    return (
        <ToastContainer
            position="top-right"
            autoClose={3000}
        />
    );
}

export default Toast;