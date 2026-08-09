package com.athelyr.linkmanager.user.service;

import com.athelyr.linkmanager.user.dto.*;
import com.athelyr.linkmanager.user.entity.User;

import java.util.List;

public interface UserService {
    AuthResponseDTO createUser(UserRequestDTO userRequestDTO);
    UserResponseDTO updateUser(String authHeader,UpdateProfileRequestDTO updateProfileRequestDTO);
    User getUserByEmail(String email);
    User getUserByAuth(String authHeader);
    UserResponseDTO getProfile(String authHeader);
    AuthResponseDTO login(LoginRequestDTO loginRequestDTO);
    List<UserSearchResponseDTO> searchUsers(String authHeader, String email);

}
