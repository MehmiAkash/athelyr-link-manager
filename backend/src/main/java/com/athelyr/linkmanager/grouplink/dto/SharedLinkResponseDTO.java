package com.athelyr.linkmanager.grouplink.dto;

import com.athelyr.linkmanager.constants.LinkType;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SharedLinkResponseDTO {
    @NotBlank
    private LinkType linkType;

    private GroupPrivateLinkResponseDTO groupPrivateLinkResponseDTO;

    private GroupShortLinkResponseDTO groupShortLinkResponseDTO;
}
