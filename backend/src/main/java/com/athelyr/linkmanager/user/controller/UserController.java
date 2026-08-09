package com.athelyr.linkmanager.user.controller;

import com.athelyr.linkmanager.user.dto.UpdateProfileRequestDTO;
import com.athelyr.linkmanager.user.dto.UserResponseDTO;
import com.athelyr.linkmanager.user.dto.UserSearchResponseDTO;
import com.athelyr.linkmanager.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v.0.1/athelyr/linkmanager")
public class UserController{
    private final UserService userService;

    public UserController(UserService userService){
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserResponseDTO> getProfile(@RequestHeader("Authorization") String authHeader){
        return ResponseEntity.ok(userService.getProfile(authHeader));
    }

    @PutMapping("/update-profile")
    public ResponseEntity<UserResponseDTO> updateProfile(@RequestHeader("Authorization") String authHeader,
                                                         @Valid @RequestBody UpdateProfileRequestDTO updateProfileRequestDTO){
        return ResponseEntity.ok(userService.updateUser(authHeader,updateProfileRequestDTO));
    }
    @GetMapping("/users/search")
    public ResponseEntity<List<UserSearchResponseDTO>> searchUsers(@RequestHeader("Authorization") String authHeader,@RequestParam String email){
        return ResponseEntity.ok(userService.searchUsers(authHeader,email));
    }

}
