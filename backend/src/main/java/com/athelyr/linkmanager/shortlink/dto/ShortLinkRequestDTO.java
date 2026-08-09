package com.athelyr.linkmanager.shortlink.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.validator.constraints.URL;


@Data
public class ShortLinkRequestDTO {
    @NotBlank
    private String title;

    @URL
    @NotBlank
    private String url;

    private boolean favourite;

}
