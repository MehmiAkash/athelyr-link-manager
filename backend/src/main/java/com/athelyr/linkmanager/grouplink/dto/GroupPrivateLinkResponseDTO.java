package com.athelyr.linkmanager.grouplink.dto;

import com.athelyr.linkmanager.privatelink.dto.PrivateLinkResponseDTO;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
public class GroupPrivateLinkResponseDTO {
    private PrivateLinkResponseDTO privateLinkResponseDTO;

    private String sharedBy;

    private UUID sharedByUserId;

    private Instant sharedAt;
}
