package com.athelyr.linkmanager.grouplink.dto;

import com.athelyr.linkmanager.constants.LinkType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class ShareLinkRequestDTO {
    @NotNull
    private UUID groupId;

    @NotNull
    private UUID linkId;

    @NotNull
    private LinkType linkType;
}
