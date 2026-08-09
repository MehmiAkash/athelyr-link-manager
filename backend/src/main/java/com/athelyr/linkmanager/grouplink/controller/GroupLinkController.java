package com.athelyr.linkmanager.grouplink.controller;

import com.athelyr.linkmanager.grouplink.dto.SharedLinkRequestDTO;
import com.athelyr.linkmanager.grouplink.dto.SharedLinkResponseDTO;
import com.athelyr.linkmanager.grouplink.service.GroupLinksService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v.0.1/athelyr/linkmanager/grouplink")
public class GroupLinkController {
    private final GroupLinksService groupLinksService;

    public GroupLinkController (GroupLinksService groupLinksService){
        this.groupLinksService = groupLinksService;
    }

    @PostMapping("/search")
    public ResponseEntity<List<SharedLinkResponseDTO>> getAllGroupLinks(@RequestHeader("Authorization")String authHeader,
                                                                        @Valid @RequestBody SharedLinkRequestDTO sharedLinkRequestDTO){
        return ResponseEntity.ok(groupLinksService.getAllGroupLinks(authHeader,sharedLinkRequestDTO));
    }
    @PostMapping()
    public ResponseEntity<SharedLinkResponseDTO> shareLink(@RequestHeader("Authorization")String authHeader,
                                                           @Valid @RequestBody SharedLinkRequestDTO sharedLinkRequestDTO){
        return ResponseEntity.ok(groupLinksService.shareLink(authHeader,sharedLinkRequestDTO));
    }
}
