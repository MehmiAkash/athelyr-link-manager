package com.athelyr.linkmanager.shortlink.dto;

import lombok.Data;
import org.hibernate.validator.constraints.URL;

@Data
public class UpdateShortLinkRequestDTO {
    private String title;

    @URL
    private String url;

    private boolean favourite;

    private boolean updateShortCode;
}
