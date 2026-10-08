package com.athelyr.linkmanager.grouplink.dto;

import com.athelyr.linkmanager.constants.LinkType;
import lombok.Data;

import java.util.UUID;

@Data
public class SharedLinkResponseDTO {
    private UUID groupLinkId;

    private LinkType linkType;

    private GroupPrivateLinkResponseDTO groupPrivateLinkResponseDTO;

    private GroupShortLinkResponseDTO groupShortLinkResponseDTO;
}
