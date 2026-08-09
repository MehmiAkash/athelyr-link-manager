package com.athelyr.linkmanager.shortlink.controller;

import com.athelyr.linkmanager.shortlink.service.ShortLinkService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RequestMapping("/athelyr")
@RestController
public class ShortLinkRedirectController {
    private final ShortLinkService shortLinkService;
    public ShortLinkRedirectController(ShortLinkService shortLinkService){
        this.shortLinkService= shortLinkService;
    }
    @GetMapping("/{shortCode}")
    public ResponseEntity<Void> redirect(@PathVariable String shortCode){
        String url = shortLinkService.redirectToOriginalUrl(shortCode);
        return ResponseEntity
                .status(HttpStatus.FOUND)
                .location(URI.create(url))
                .build();
    }

}
