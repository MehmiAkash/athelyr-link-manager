import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { registerUser } from "../services/authService";
import { useAuth } from "../context/useAuth";
import { showToast } from "../services/toastService";
import { useNavigate } from "react-router-dom";
import {
  VALIDATION_MESSAGES,
  validateEmail,
  validatePassword,
} from "../config/validationMessages";

function Register({ setLoading, onSwitch }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = {};

    if (!name.trim()) {
      validationErrors.name = VALIDATION_MESSAGES.REQUIRED("Name");
    }
    const emailError = validateEmail(email);
    if (emailError) {
      validationErrors.email = emailError;
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      validationErrors.password = passwordError;
    }
    if (!confirmPassword) {
      validationErrors.confirmPassword =
        VALIDATION_MESSAGES.REQUIRED("Confirm password");
    } else if (password !== confirmPassword) {
      validationErrors.confirmPassword = VALIDATION_MESSAGES.PASSWORD_MISMATCH;
    }

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) {
      return;
    }

    setLoading(true);
    try {
      const data = await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
        confirmPassword,
      });
      login(data);
      navigate("/dashboard");
      showToast("success", "Registered successfully");
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const clearError = (field) => {
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-(--accent-300) text-3xl md:text-5xl">Register</h1>
      <form onSubmit={handleSubmit} noValidate className="space-y-4 pt-5">
        <div className="flex flex-col gap-2 px-2 md:flex-row md:items-center md:gap-6 md:p-2">
          <label className="w-62 text-xl text-white md:text-2xl">NAME</label>
          <div className="w-full">
            <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                clearError("name");
              }}
              aria-invalid={Boolean(errors.name)}
              className="w-full rounded-lg border border-white px-2 text-xl text-white md:w-auto md:px-4 md:text-2xl"
            />
            <p className="min-h-5 text-sm text-red-400/80">{errors.name || " "}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 px-2 md:flex-row md:items-center md:gap-6 md:p-2">
          <label className="w-62 text-xl text-white md:text-2xl">EMAIL</label>
          <div className="w-full">
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                clearError("email");
              }}
              aria-invalid={Boolean(errors.email)}
              className="w-full rounded-lg border border-white px-2 text-xl text-white md:w-auto md:px-4 md:text-2xl"
            />
            <p className="min-h-5 text-sm text-red-400/80">{errors.email || " "}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 px-2 md:flex-row md:items-center md:gap-6 md:p-2">
          <label className="w-62 text-xl text-white md:text-2xl">PASSWORD</label>
          <div className="w-full">
            <div className="relative block w-full md:inline-block md:w-auto">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                clearError("password");
              }}
              aria-invalid={Boolean(errors.password)}
              className="w-full rounded-lg border border-white px-2 pr-10 text-xl text-white md:w-auto md:px-4 md:text-2xl"
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition hover:text-(--accent-300)"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            </div>
            <p className="mt-1 text-xs text-zinc-400">
              At least 8 characters, including a number and a special character.
            </p>
            <p className="min-h-5 text-sm text-red-400/80">{errors.password || " "}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 px-2 md:flex-row md:items-center md:gap-6 md:p-2">
          <label className="w-62 text-xl text-white md:text-2xl">
            CONFIRM PASSWORD
          </label>
          <div className="w-full">
            <div className="relative block w-full md:inline-block md:w-auto">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                clearError("confirmPassword");
              }}
              aria-invalid={Boolean(errors.confirmPassword)}
              className="w-full rounded-lg border border-white px-2 pr-10 text-xl text-white md:w-auto md:px-4 md:text-2xl"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((visible) => !visible)}
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              aria-pressed={showConfirmPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition hover:text-(--accent-300)"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            </div>
            <p className="min-h-5 text-sm text-red-400/80">
              {errors.confirmPassword || " "}
            </p>
          </div>
        </div>
        <div className="flex justify-center px-2 py-2 text-white md:justify-end md:py-4">
          <button
            type="submit"
            className="w-full rounded-lg border border-white text-xl text-white shadow-md transition duration-200 hover:bg-zinc-900 hover:text-(--accent-400) md:w-auto md:px-6 md:text-2xl"
          >
            PROCEED ➜
          </button>
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onSwitch}
            className="text-md text-(--accent-100) transition-colors duration-200 hover:text-(--accent-400) md:text-xl"
          >
            Already have an account? Sign in
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
