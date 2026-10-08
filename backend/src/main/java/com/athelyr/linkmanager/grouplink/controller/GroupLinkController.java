package com.athelyr.linkmanager.grouplink.controller;

import com.athelyr.linkmanager.constants.LinkType;
import com.athelyr.linkmanager.grouplink.dto.SharedLinkRequestDTO;
import com.athelyr.linkmanager.grouplink.dto.SharedLinkResponseDTO;
import com.athelyr.linkmanager.grouplink.dto.ShareLinkRequestDTO;
import com.athelyr.linkmanager.grouplink.service.GroupLinksService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v.0.1/athelyr/linkmanager/grouplink")
public class GroupLinkController {
    private final GroupLinksService groupLinksService;

    public GroupLinkController (GroupLinksService groupLinksService){
        this.groupLinksService = groupLinksService;
    }

    @PostMapping("/search")
    public ResponseEntity<?> getAllGroupLinks(@RequestHeader("Authorization")String authHeader,
                                             @Valid @RequestBody SharedLinkRequestDTO sharedLinkRequestDTO,
                                             @RequestParam(required = false) Integer page,
                                             @RequestParam(required = false) Integer size){
        if (page != null || size != null) {
            int pageNumber = page == null ? 0 : page;
            int pageSize = size == null ? 10 : size;
            if (pageNumber < 0 || pageSize < 1 || pageSize > 100) {
                return ResponseEntity.badRequest().build();
            }
            return ResponseEntity.ok(groupLinksService.getGroupLinksPage(
                    authHeader,
                    sharedLinkRequestDTO,
                    PageRequest.of(
                            pageNumber,
                            pageSize,
                            Sort.by(Sort.Direction.DESC, "sharedAt")
                                    .and(Sort.by(Sort.Direction.DESC, "id"))
                    )
            ));
        }
        return ResponseEntity.ok(groupLinksService.getAllGroupLinks(authHeader,sharedLinkRequestDTO));
    }
    @PostMapping()
    public ResponseEntity<SharedLinkResponseDTO> shareLink(@RequestHeader("Authorization")String authHeader,
                                                           @Valid @RequestBody ShareLinkRequestDTO sharedLinkRequestDTO){
        return ResponseEntity.ok(groupLinksService.shareLink(authHeader,sharedLinkRequestDTO));
    }

    @DeleteMapping("/{groupId}/{linkType}/{groupLinkId}")
    public ResponseEntity<Void> deleteSharedLink(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable UUID groupId,
            @PathVariable LinkType linkType,
            @PathVariable UUID groupLinkId
    ) {
        groupLinksService.deleteSharedLink(authHeader, groupId, linkType, groupLinkId);
        return ResponseEntity.noContent().build();
    }
}
