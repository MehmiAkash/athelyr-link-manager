package com.athelyr.linkmanager.group.dto;

import lombok.Data;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
public class GroupResponseDTO {
    private UUID groupId;

    private String groupName;

    private String description;

    private Instant createdAt;

    private List<GroupMembersDTO> groupMembersDTOList;
}
