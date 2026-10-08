package com.athelyr.linkmanager.user.controller;

import com.athelyr.linkmanager.user.dto.UpdateProfileRequestDTO;
import com.athelyr.linkmanager.user.dto.UserResponseDTO;
import com.athelyr.linkmanager.user.dto.UserSearchResponseDTO;
import com.athelyr.linkmanager.user.service.UserService;
import com.athelyr.linkmanager.user.service.ProfileImageService;
import jakarta.validation.Valid;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/v.0.1/athelyr/linkmanager")
public class UserController{
    private final UserService userService;
    private final ProfileImageService profileImageService;

    public UserController(UserService userService, ProfileImageService profileImageService){
        this.userService = userService;
        this.profileImageService = profileImageService;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserResponseDTO> getProfile(@RequestHeader("Authorization") String authHeader){
        return ResponseEntity.ok(userService.getProfile(authHeader));
    }

    @PostMapping(value = "/profile/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserResponseDTO> uploadProfileImage(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("file") MultipartFile file
    ) {
        return ResponseEntity.ok(profileImageService.upload(authHeader, file));
    }

    @GetMapping("/profile/images/{fileName}")
    public ResponseEntity<Resource> getProfileImage(@PathVariable String fileName)
            throws IOException {
        Path imagePath = profileImageService.getImagePath(fileName);
        String contentType = Files.probeContentType(imagePath);
        MediaType mediaType = contentType == null
                ? MediaType.APPLICATION_OCTET_STREAM
                : MediaType.parseMediaType(contentType);
        return ResponseEntity.ok()
                .contentType(mediaType)
                .cacheControl(CacheControl.maxAge(365, TimeUnit.DAYS).cachePublic().immutable())
                .body(new FileSystemResource(imagePath));
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
