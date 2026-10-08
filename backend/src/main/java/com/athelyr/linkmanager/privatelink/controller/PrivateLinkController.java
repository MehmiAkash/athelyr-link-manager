package com.athelyr.linkmanager.privatelink.controller;

import com.athelyr.linkmanager.privatelink.dto.PrivateLinkRequestDTO;
import com.athelyr.linkmanager.privatelink.dto.PrivateLinkResponseDTO;
import com.athelyr.linkmanager.privatelink.dto.UpdatePrivateLinkRequestDTO;
import com.athelyr.linkmanager.privatelink.service.PrivateLinkService;
import com.athelyr.linkmanager.config.OffsetPageRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
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

    @GetMapping("/page")
    public ResponseEntity<?> getPrivateLinksPage(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "0") long offset,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Boolean favourite,
            @RequestParam(defaultValue = "") String search
    ) {
        if (offset < 0 || size < 1 || size > 100 || search.length() > 200) {
            return ResponseEntity.badRequest().build();
        }
        Page<PrivateLinkResponseDTO> result = privateLinkService.getPrivateLinkByUser(
                authHeader,
                new OffsetPageRequest(
                        offset,
                        size,
                        Sort.by(Sort.Direction.DESC, "createdAt")
                                .and(Sort.by(Sort.Direction.DESC, "plId"))
                ),
                favourite,
                search
        );
        return ResponseEntity.ok(Map.of(
                "content", result.getContent(),
                "hasNext", offset + result.getNumberOfElements() < result.getTotalElements(),
                "totalElements", result.getTotalElements()
        ));
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
