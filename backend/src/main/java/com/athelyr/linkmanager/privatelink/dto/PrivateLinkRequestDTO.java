package com.athelyr.linkmanager.privatelink.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

@Data
public class PrivateLinkRequestDTO {
    @NotBlank
    private String title;

    @NotBlank
    @URL
    private String url;

    private boolean favourite;

}

