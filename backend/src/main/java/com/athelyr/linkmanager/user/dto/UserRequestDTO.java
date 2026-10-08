package com.athelyr.linkmanager.user.dto;

import com.athelyr.linkmanager.constants.ValidationMessages;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;


@Data
public class UserRequestDTO {

    @NotBlank(message = ValidationMessages.REQUIRED)
    private String name;

    @NotBlank(message = ValidationMessages.REQUIRED)
    @Email(message = ValidationMessages.INVALID_EMAIL)
    private String email;

    @NotBlank(message = ValidationMessages.REQUIRED)
    @Pattern(
            regexp = "^(?=.*\\d)(?=.*[^A-Za-z0-9\\s]).{8,}$",
            message = ValidationMessages.INVALID_PASSWORD
    )
    private String password;

}
