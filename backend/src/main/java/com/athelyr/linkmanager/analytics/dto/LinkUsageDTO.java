package com.athelyr.linkmanager.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LinkUsageDTO {
    private UUID linkId;
    private String title;
    private String url;
    private String shortCode;
    private String linkType;
    private long usageCount;
}
