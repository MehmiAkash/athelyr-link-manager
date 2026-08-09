package com.athelyr.linkmanager.user.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateProfileRequestDTO {
    private String name;

    private LocalDate dob;

    private String bio;

    private String profileImageUrl;
}
