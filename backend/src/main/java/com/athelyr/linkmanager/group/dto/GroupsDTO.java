package com.athelyr.linkmanager.group.dto;

import com.athelyr.linkmanager.constants.Role;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
public class GroupsDTO {
    private UUID groupId;

    private String groupName;

    private String description;

    private Instant createdAt;

    private Role role;
}
