package com.athelyr.linkmanager.grouplink.dto;

import com.athelyr.linkmanager.privatelink.dto.PrivateLinkResponseDTO;
import lombok.Data;

import java.time.Instant;

@Data
public class GroupPrivateLinkResponseDTO {
    private PrivateLinkResponseDTO privateLinkResponseDTO;

    private String sharedBy;

    private Instant sharedAt;
}
