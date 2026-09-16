import Login from "./Login";
import Register from "./Register";

function Card({ setLoading, isLogin }) {

    return (
        <div className="bg-zinc-700/10 backdrop-blur-sm py-3 px-10 md:py-6 rounded-xl">

            {isLogin ? (
                <Login
                    setLoading={setLoading}
                    onSwitch={() => window.location.href = "/register"}
                />
            ) : (
                <Register
                    setLoading={setLoading}
                    onSwitch={() => window.location.href = "/login"}
                />
            )}

        </div>
    );
}

export default Card;