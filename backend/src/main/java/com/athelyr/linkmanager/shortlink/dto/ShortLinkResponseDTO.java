package com.athelyr.linkmanager.shortlink.dto;

import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
public class ShortLinkResponseDTO {

    private UUID slId;

    private String title;

    private String url;

    private String shortCode;

    private boolean favourite;

    private long clickCount;

    private Instant createdAt;

    private Instant updatedAt;

    private Instant lastClickedAt;
}
