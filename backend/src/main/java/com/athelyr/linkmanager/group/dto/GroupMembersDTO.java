package com.athelyr.linkmanager.group.dto;

import com.athelyr.linkmanager.constants.Role;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class GroupMembersDTO {
    private UUID memberId;

    private String name;

    private String email;

    private String profileImageUrl;

    private LocalDate dob;

    private String bio;

    private Role role;
}
