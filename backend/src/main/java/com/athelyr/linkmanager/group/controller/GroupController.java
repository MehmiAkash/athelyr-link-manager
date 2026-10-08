package com.athelyr.linkmanager.group.controller;

import com.athelyr.linkmanager.group.dto.*;
import com.athelyr.linkmanager.group.service.GroupService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v.0.1/athelyr/linkmanager/group")
public class GroupController {
    private final GroupService groupService;
    public GroupController(GroupService groupService){
        this.groupService=groupService;
    }
    @PostMapping
    public ResponseEntity<GroupResponseDTO> createGroup(@RequestHeader("Authorization")String authHeader,
                                                        @Valid @RequestBody GroupRequestDTO groupRequestDTO){
        return ResponseEntity.ok(groupService.createGroup(authHeader,groupRequestDTO));
    }
    @GetMapping
    public ResponseEntity<List<GroupsDTO>> getAllGroups(@RequestHeader("Authorization")String authHeader){
        return ResponseEntity.ok(groupService.getAllGroups(authHeader));
    }

    @GetMapping("/search")
    public ResponseEntity<List<GroupsDTO>> searchGroups(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "") String query
    ) {
        return ResponseEntity.ok(groupService.searchGroups(authHeader, query));
    }
    @GetMapping("/{id}/members")
    public ResponseEntity<GroupResponseDTO> getAllUsersByGroup(@RequestHeader("Authorization")String authHeader , @PathVariable UUID id){
        return ResponseEntity.ok(groupService.getAllUsersByGroup(authHeader,id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GroupsDTO> getGroupById(@RequestHeader("Authorization")String authHeader, @PathVariable UUID id){
        return ResponseEntity.ok(groupService.getGroupById(authHeader,id));
    }
    @PostMapping("/{id}/members")
    public ResponseEntity<GroupResponseDTO> addUserInGroup(@RequestHeader("Authorization")String authHeader,@PathVariable UUID id,
                                                           @Valid @RequestBody GroupMemberRequestDTO groupMemberRequestDTO){
        return ResponseEntity.ok(groupService.addUserInGroup(authHeader,id,groupMemberRequestDTO));
    }

    @DeleteMapping("/{id}/leave")
    public void leaveGroup(@RequestHeader("Authorization")String authHeader , @PathVariable UUID id){
        groupService.leaveGroup(authHeader,id);
    }
    @DeleteMapping("/{id}")
    public void deleteGroup(@RequestHeader("Authorization")String authHeader , @PathVariable UUID id){
        groupService.deleteGroup(authHeader,id);
    }
    @DeleteMapping("/{id}/members")
    public ResponseEntity<GroupResponseDTO> removeUserFromGroup(@RequestHeader("Authorization")String authHeader , @PathVariable UUID id,
                                                                @Valid @RequestBody GroupMemberRequestDTO groupMemberRequestDTO){
        return ResponseEntity.ok(groupService.removeUserFromGroup(authHeader,id,groupMemberRequestDTO));
    }
    @PatchMapping("/{id}/members/role")
    public ResponseEntity<GroupResponseDTO> updateUserRole(@RequestHeader("Authorization")String authHeader, @PathVariable UUID id,
                                                           @Valid @RequestBody GroupMemberRequestDTO groupMemberRequestDTO){
        return ResponseEntity.ok(groupService.updateUserRole(authHeader,id,groupMemberRequestDTO));
    }

}
