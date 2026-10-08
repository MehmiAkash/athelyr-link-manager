package com.athelyr.linkmanager.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponseDTO {
    private List<LinkUsageDTO> topShortLinks;
    private List<LinkUsageDTO> topPrivateLinks;
    private List<LinkUsageDTO> topLinks;
    private long totalShortLinkUsage;
    private long totalPrivateLinkUsage;
}
