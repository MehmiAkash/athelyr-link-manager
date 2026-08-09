package com.athelyr.linkmanager.grouplink.dto;

import com.athelyr.linkmanager.constants.LinkType;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.UUID;

@Data
public class SharedLinkRequestDTO {
    @NotBlank
    private UUID groupId;


    private UUID linkId;

    @NotBlank
    private LinkType linkType;
}
