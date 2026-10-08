package com.athelyr.linkmanager.user.service;

import com.athelyr.linkmanager.user.dto.UpdateProfileRequestDTO;
import com.athelyr.linkmanager.user.dto.UserResponseDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
public class ProfileImageService {
    private static final Logger logger =
            LoggerFactory.getLogger(ProfileImageService.class);
    private static final long MAX_IMAGE_SIZE = 5 * 1024 * 1024;
    private static final Set<String> ALLOWED_CONTENT_TYPES =
            Set.of("image/jpeg", "image/png", "image/gif");

    private final Path imageDirectory;
    private final UserService userService;

    public ProfileImageService(
            @Value("${app.profile-image-dir:uploads/profile-images}") String imageDirectory,
            UserService userService
    ) {
        this.imageDirectory = Path.of(imageDirectory).toAbsolutePath().normalize();
        this.userService = userService;
    }

    public UserResponseDTO upload(String authHeader, MultipartFile file) {
        validateImage(file);

        try {
            Files.createDirectories(imageDirectory);
            byte[] imageBytes = file.getBytes();
            BufferedImage image = ImageIO.read(new ByteArrayInputStream(imageBytes));
            if (image == null) {
                throw new IllegalArgumentException("The uploaded file is not a supported image.");
            }

            String extension = extensionFor(file.getContentType());
            String fileName = UUID.randomUUID() + extension;
            Path destination = imageDirectory.resolve(fileName).normalize();
            if (!destination.startsWith(imageDirectory)) {
                throw new IllegalArgumentException("Invalid image file name.");
            }

            Files.write(destination, imageBytes);
            try {
                UserResponseDTO previousProfile = userService.getProfile(authHeader);
                UpdateProfileRequestDTO update = new UpdateProfileRequestDTO();
                update.setProfileImageUrl(
                        "/profile/images/" + fileName
                );
                UserResponseDTO updatedProfile = userService.updateUser(authHeader, update);
                deletePreviousImage(previousProfile.getProfileImageUrl(), fileName);
                return updatedProfile;
            } catch (RuntimeException exception) {
                Files.deleteIfExists(destination);
                throw exception;
            }
        } catch (IOException exception) {
            throw new IllegalStateException("Unable to save profile image.", exception);
        }
    }

    public Path getImagePath(String fileName) {
        if (fileName == null || !fileName.matches(
                "[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\\.(jpg|png|gif)"
        )) {
            throw new IllegalArgumentException("Invalid profile image name.");
        }

        Path imagePath = imageDirectory.resolve(fileName).normalize();
        if (!imagePath.startsWith(imageDirectory) || !Files.isRegularFile(imagePath)) {
            throw new IllegalArgumentException("Profile image not found.");
        }
        return imagePath;
    }

    private void validateImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Choose a profile image to upload.");
        }
        if (file.getSize() > MAX_IMAGE_SIZE) {
            throw new IllegalArgumentException("Profile images must be 5 MB or smaller.");
        }
        String contentType = file.getContentType();
        if (contentType == null ||
                !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase(Locale.ROOT))) {
            throw new IllegalArgumentException("Use a PNG, JPEG, or GIF image.");
        }
    }

    private String extensionFor(String contentType) {
        return switch (contentType.toLowerCase(Locale.ROOT)) {
            case "image/jpeg" -> ".jpg";
            case "image/png" -> ".png";
            case "image/gif" -> ".gif";
            default -> throw new IllegalArgumentException("Unsupported image type.");
        };
    }

    private void deletePreviousImage(String previousImageUrl, String newFileName) {
        if (previousImageUrl == null || previousImageUrl.isBlank()) {
            return;
        }
        String previousFileName = previousImageUrl.substring(
                previousImageUrl.lastIndexOf('/') + 1
        );
        if (previousFileName.equals(newFileName)) {
            return;
        }
        if (!previousFileName.matches(
                "[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\\.(jpg|png|gif)"
        )) {
            return;
        }
        try {
            Files.deleteIfExists(imageDirectory.resolve(previousFileName));
        } catch (IOException exception) {
            logger.warn("Could not remove previous profile image {}", previousFileName, exception);
        }
    }
}
