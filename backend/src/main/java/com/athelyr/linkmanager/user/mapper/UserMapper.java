package com.athelyr.linkmanager.user.mapper;

import com.athelyr.linkmanager.user.dto.UserResponseDTO;
import com.athelyr.linkmanager.user.dto.UserSearchResponseDTO;
import com.athelyr.linkmanager.user.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public UserResponseDTO mapToResponse(User user) {
        UserResponseDTO response = new UserResponseDTO();
        response.setUserId(user.getUserId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setDob(user.getDob());
        response.setBio(user.getBio());
        response.setProfileImageUrl(user.getProfileImageUrl());

        return response;
    }
    public UserSearchResponseDTO mapToSearchResponse(User user){
        UserSearchResponseDTO response = new UserSearchResponseDTO();
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        return response;
    }
}
