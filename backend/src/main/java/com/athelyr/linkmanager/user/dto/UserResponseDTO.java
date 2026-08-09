package com.athelyr.linkmanager.user.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class UserResponseDTO {
    private UUID userId;

    private String name;

    private String email;

    private LocalDate dob;

    private String bio;

    private String profileImageUrl;

}
