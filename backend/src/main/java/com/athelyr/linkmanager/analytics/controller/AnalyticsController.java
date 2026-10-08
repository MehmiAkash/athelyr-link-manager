package com.athelyr.linkmanager.analytics.controller;

import com.athelyr.linkmanager.analytics.dto.AnalyticsResponseDTO;
import com.athelyr.linkmanager.analytics.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v.0.1/athelyr/linkmanager/analytics")
public class AnalyticsController {
    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping
    public ResponseEntity<AnalyticsResponseDTO> getAnalytics(
            @RequestHeader("Authorization") String authHeader
    ) {
        return ResponseEntity.ok(analyticsService.getUserAnalytics(authHeader));
    }
}
