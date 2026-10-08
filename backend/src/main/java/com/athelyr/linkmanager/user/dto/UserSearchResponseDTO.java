package com.athelyr.linkmanager.user.dto;

import lombok.Data;

@Data
public class UserSearchResponseDTO {

    private String name;

    private String email;

    private String profileImageUrl;

    private String bio;
}
