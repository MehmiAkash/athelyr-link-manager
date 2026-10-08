package com.athelyr.linkmanager.group.service;

import com.athelyr.linkmanager.group.dto.*;

import java.util.List;
import java.util.UUID;

public interface GroupService {
    GroupResponseDTO createGroup(String authHeader,GroupRequestDTO groupRequestDTO);
    GroupResponseDTO addUserInGroup(String authHeader, UUID groupId, GroupMemberRequestDTO groupMemberRequestDTO);
    void leaveGroup(String authHeader, UUID groupId);
    GroupResponseDTO removeUserFromGroup(String authHeader,UUID groupId,GroupMemberRequestDTO groupMemberRequestDTO );
    GroupResponseDTO updateUserRole(String authHeader , UUID groupId, GroupMemberRequestDTO groupMemberRequestDTO);
    List<GroupsDTO> getAllGroups(String authHeader );
    List<GroupsDTO> searchGroups(String authHeader, String query);
    GroupResponseDTO getAllUsersByGroup(String authHeader ,UUID groupId);
    void  deleteGroup(String authHeader,UUID groupId);
    GroupsDTO getGroupById(String authHeader,UUID GroupId);
}



