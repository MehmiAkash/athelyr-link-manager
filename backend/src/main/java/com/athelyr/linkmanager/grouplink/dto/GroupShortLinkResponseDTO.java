package com.athelyr.linkmanager.grouplink.dto;


import com.athelyr.linkmanager.shortlink.dto.ShortLinkResponseDTO;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
public class GroupShortLinkResponseDTO {

    private ShortLinkResponseDTO shortLinkResponseDTO;

    private String sharedBy;

    private UUID sharedByUserId;

    private Instant sharedAt;
}
