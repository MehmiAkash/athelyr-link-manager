package com.athelyr.linkmanager.shortlink.dto;

import com.athelyr.linkmanager.constants.ValidationMessages;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.validator.constraints.URL;


@Data
public class ShortLinkRequestDTO {
    @NotBlank(message = ValidationMessages.REQUIRED)
    private String title;

    @URL(message = ValidationMessages.INVALID_URL)
    @NotBlank(message = ValidationMessages.REQUIRED)
    private String url;

    private boolean favourite;

}
