export const VALIDATION_MESSAGES = {
    REQUIRED: (field) => `${field} is required.`,
    INVALID_EMAIL: "Enter a valid email address.",
    INVALID_URL: "Enter a valid link starting with http:// or https://.",
    INVALID_PASSWORD:
        "Password must be at least 8 characters and include a number and a special character.",
    PASSWORD_MISMATCH: "Passwords do not match.",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern = /^(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,}$/;

export function validateEmail(email) {
    if (!email.trim()) {
        return VALIDATION_MESSAGES.REQUIRED("Email");
    }

    return emailPattern.test(email.trim())
        ? ""
        : VALIDATION_MESSAGES.INVALID_EMAIL;
}

export function validatePassword(password) {
    return passwordPattern.test(password)
        ? ""
        : VALIDATION_MESSAGES.INVALID_PASSWORD;
}

export function validateUrl(url) {
    if (!url.trim()) {
        return VALIDATION_MESSAGES.REQUIRED("Link");
    }

    try {
        const parsedUrl = new URL(url.trim());
        return ["http:", "https:"].includes(parsedUrl.protocol)
            ? ""
            : VALIDATION_MESSAGES.INVALID_URL;
    } catch {
        return VALIDATION_MESSAGES.INVALID_URL;
    }
}
