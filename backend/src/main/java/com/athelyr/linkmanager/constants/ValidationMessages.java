package com.athelyr.linkmanager.constants;

public final class ValidationMessages {
    private ValidationMessages() {}

    public static final String REQUIRED = "This field is required";
    public static final String INVALID_EMAIL = "Enter a valid email address";
    public static final String INVALID_URL = "Enter a valid link starting with http:// or https://";
    public static final String INVALID_PASSWORD =
            "Password must be at least 8 characters and include a number and a special character";
    public static final String INVALID_GROUP_NAME = "Group name is required";
}
