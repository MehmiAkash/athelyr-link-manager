package com.athelyr.linkmanager.shortlink.controller;

import com.athelyr.linkmanager.shortlink.dto.ShortLinkRequestDTO;
import com.athelyr.linkmanager.shortlink.dto.ShortLinkResponseDTO;
import com.athelyr.linkmanager.shortlink.dto.UpdateShortLinkRequestDTO;
import com.athelyr.linkmanager.shortlink.service.ShortLinkService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v.0.1/athelyr/linkmanager/short-link")
public class ShortLinkController {
    private final ShortLinkService shortLinkService;

    public ShortLinkController(ShortLinkService shortLinkService){
        this.shortLinkService= shortLinkService;
    }

    @GetMapping
    public ResponseEntity<List<ShortLinkResponseDTO>> getShortLinkByUser(@RequestHeader("Authorization")String authHeader){
        return ResponseEntity.ok(shortLinkService.getShortLinksByUser(authHeader));
    }

    @PostMapping
    public ResponseEntity<ShortLinkResponseDTO> addShortLink(@RequestHeader("Authorization")String authHeader ,
                                                             @Valid @RequestBody ShortLinkRequestDTO shortLinkRequestDTO){
        return ResponseEntity.ok(shortLinkService.createShortLink(authHeader,shortLinkRequestDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShortLinkResponseDTO> updateShortLink(@RequestHeader("Authorization")String authHeader , @PathVariable UUID id,
                                                                @Valid @RequestBody UpdateShortLinkRequestDTO updateShortLinkRequestDTO){
        return ResponseEntity.ok(shortLinkService.updateShortLink(authHeader, id,updateShortLinkRequestDTO));
    }


    @DeleteMapping("/{id}")
    public void deleteShortLink(@RequestHeader("Authorization")String authHeader,@PathVariable UUID id){
        shortLinkService.deleteShortLink(authHeader,id);
    }

}
