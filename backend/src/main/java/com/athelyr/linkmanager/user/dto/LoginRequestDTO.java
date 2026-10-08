package com.athelyr.linkmanager.user.dto;

import com.athelyr.linkmanager.constants.ValidationMessages;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data

public class LoginRequestDTO {
    @NotBlank(message = ValidationMessages.REQUIRED)
    @Email(message = ValidationMessages.INVALID_EMAIL)
    private String email;

    @NotBlank(message = ValidationMessages.REQUIRED)
    private String password;
}
