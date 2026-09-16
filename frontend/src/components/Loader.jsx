import { ClipLoader } from "react-spinners";

function Loader() {
    return (
        <div className="
            fixed
            inset-0
            z-200
            flex
            items-center
            justify-center
            bg-black/50
            backdrop-blur-sm
        ">
            <ClipLoader
                color="var(--accent-400)"
                size={53}
                speedMultiplier={1.15}
            />
        </div>
    );
}

export default Loader;