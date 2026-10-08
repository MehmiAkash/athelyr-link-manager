package com.athelyr.linkmanager.analytics.service;

import com.athelyr.linkmanager.analytics.dto.AnalyticsResponseDTO;

public interface AnalyticsService {
    AnalyticsResponseDTO getUserAnalytics(String authHeader);
}
