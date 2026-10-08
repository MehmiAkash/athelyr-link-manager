package com.athelyr.linkmanager.privatelink.dto;

import com.athelyr.linkmanager.constants.ValidationMessages;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

@Data
public class UpdatePrivateLinkRequestDTO {
    private String title;

    @URL(message = ValidationMessages.INVALID_URL)
    private String url;

    private boolean favourite;
}
