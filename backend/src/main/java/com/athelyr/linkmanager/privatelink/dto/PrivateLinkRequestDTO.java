package com.athelyr.linkmanager.privatelink.dto;

import com.athelyr.linkmanager.constants.ValidationMessages;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

@Data
public class PrivateLinkRequestDTO {
    @NotBlank(message = ValidationMessages.REQUIRED)
    private String title;

    @NotBlank(message = ValidationMessages.REQUIRED)
    @URL(message = ValidationMessages.INVALID_URL)
    private String url;

    private boolean favourite;

}
