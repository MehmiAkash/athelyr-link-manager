package com.athelyr.linkmanager.privatelink.controller;

import com.athelyr.linkmanager.privatelink.dto.PrivateLinkRequestDTO;
import com.athelyr.linkmanager.privatelink.dto.PrivateLinkResponseDTO;
import com.athelyr.linkmanager.privatelink.dto.UpdatePrivateLinkRequestDTO;
import com.athelyr.linkmanager.privatelink.service.PrivateLinkService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v.0.1/athelyr/linkmanager/private-link")
public class PrivateLinkController {
    private final PrivateLinkService privateLinkService;

    public PrivateLinkController(PrivateLinkService privateLinkService){
        this.privateLinkService = privateLinkService;
    }

    @GetMapping
    public ResponseEntity<List<PrivateLinkResponseDTO>> getPrivateLinkByUser(@RequestHeader("Authorization")String authHeader ){
        return ResponseEntity.ok(privateLinkService.getPrivateLinkByUser(authHeader));
        }

    @PostMapping
    public ResponseEntity<PrivateLinkResponseDTO> addPrivateLink(@RequestHeader("Authorization")String authHeader ,
                                                                 @Valid @RequestBody PrivateLinkRequestDTO privateLinkRequestDTO){
        return ResponseEntity.ok(privateLinkService.createPrivateLink(authHeader,privateLinkRequestDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PrivateLinkResponseDTO> updatePrivateLink(@RequestHeader("Authorization")String authHeader , @PathVariable UUID id ,
                                                                    @Valid @RequestBody UpdatePrivateLinkRequestDTO updatePrivateLinkRequestDTO){
        return ResponseEntity.ok(privateLinkService.updatePrivateLink(authHeader,id,updatePrivateLinkRequestDTO));
    }

    @PatchMapping("/{id}/copy")
    public void updateCopyCount(@RequestHeader("Authorization")String authHeader , @PathVariable UUID id){
        privateLinkService.updateCopyCount(authHeader,id);
    }

    @DeleteMapping("/{id}")
    public void deletePrivateLink(@RequestHeader("Authorization")String authHeader , @PathVariable UUID id){
        privateLinkService.deletePrivateLink(authHeader,id);
    }

}
