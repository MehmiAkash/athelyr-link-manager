package com.athelyr.linkmanager.privatelink.dto;

import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
public class PrivateLinkResponseDTO {

    private UUID plId;

    private String title;

    private String url;

    private boolean favourite;

    private long copyCount;

    private Instant createdAt;

    private Instant updatedAt;

    private Instant lastCopiedAt;
}
