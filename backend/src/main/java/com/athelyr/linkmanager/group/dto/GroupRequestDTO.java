package com.athelyr.linkmanager.group.dto;

import com.athelyr.linkmanager.constants.ValidationMessages;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GroupRequestDTO {
    @NotBlank(message = ValidationMessages.INVALID_GROUP_NAME)
    private String groupName;

    private String description;

}
