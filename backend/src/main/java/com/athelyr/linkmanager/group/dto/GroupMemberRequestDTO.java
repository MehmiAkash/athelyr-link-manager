package com.athelyr.linkmanager.group.dto;
import com.athelyr.linkmanager.constants.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GroupMemberRequestDTO {

    @NotBlank
    @Email
    private String email;

    private Role role;
}
