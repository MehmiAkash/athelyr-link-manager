package com.athelyr.linkmanager.user.service;

import com.athelyr.linkmanager.config.JwtService;
import com.athelyr.linkmanager.constants.ExceptionConstants;
import com.athelyr.linkmanager.exception.custom.BadRequestException;
import com.athelyr.linkmanager.exception.custom.ResourceAlreadyExistsException;
import com.athelyr.linkmanager.exception.custom.ResourceNotFoundException;
import com.athelyr.linkmanager.exception.custom.UnauthorizedException;
import com.athelyr.linkmanager.user.mapper.UserMapper;
import com.athelyr.linkmanager.user.dto.*;
import com.athelyr.linkmanager.user.entity.User;
import com.athelyr.linkmanager.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class UserServiceImpl implements UserService{
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserMapper userMapper;


    public UserServiceImpl(UserRepository userRepository , PasswordEncoder passwordEncoder, JwtService jwtService , UserMapper userMapper){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.userMapper = userMapper;
    }

    @Override
    public AuthResponseDTO createUser(UserRequestDTO userRequestDTO) {
        if(userRepository.existsByEmail(userRequestDTO.getEmail())){
            throw new ResourceAlreadyExistsException(ExceptionConstants.USER_ALREADY_EXISTS);
        }
        Instant now = Instant.now();
        User newUser = User.builder()
                .name(userRequestDTO.getName())
                .email(userRequestDTO.getEmail())
                .password(passwordEncoder.encode(userRequestDTO.getPassword()))
                .createdAt(now)
                .build();
        User savedUser = userRepository.save(newUser);
        String token = jwtService.generateToken(savedUser.getEmail());

        return new AuthResponseDTO(token , userMapper.mapToResponse(savedUser));

    }

    @Override
    public UserResponseDTO updateUser(String authHeader,UpdateProfileRequestDTO updateProfileRequestDTO) {
        User user = getUserByAuth(authHeader);
        if(updateProfileRequestDTO.getName()!=null && !updateProfileRequestDTO.getName().isBlank()) {
            user.setName(updateProfileRequestDTO.getName());
        }
        if(updateProfileRequestDTO.getBio()!=null && !updateProfileRequestDTO.getBio().isBlank()) {
            user.setBio(updateProfileRequestDTO.getBio());
        }
        if(updateProfileRequestDTO.getDob()!=null ) {
            user.setDob(updateProfileRequestDTO.getDob());
        }
        if (updateProfileRequestDTO.getProfileImageUrl()!=null && !updateProfileRequestDTO.getProfileImageUrl().isBlank()) {
            user.setProfileImageUrl(updateProfileRequestDTO.getProfileImageUrl());
        }
        User savedUser =  userRepository.save(user);

        return userMapper.mapToResponse(savedUser);
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(()-> new ResourceNotFoundException(ExceptionConstants.USER_NOT_FOUND));
    }

    @Override
    public User getUserByAuth(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException(ExceptionConstants.INVALID_CREDENTIALS);
        }

        String token = authHeader.substring(7);
        String email =jwtService.extractEmail(token);

        return getUserByEmail(email);
    }

    @Override
    public UserResponseDTO getProfile(String authHeader) {
        User user = getUserByAuth(authHeader);
        return userMapper.mapToResponse(user);
    }

    @Override
    public AuthResponseDTO login(LoginRequestDTO loginRequestDTO) {
        User user = getUserByEmail(loginRequestDTO.getEmail());
        if(!passwordEncoder.matches(loginRequestDTO.getPassword(),user.getPassword())){
            throw new UnauthorizedException(ExceptionConstants.INVALID_CREDENTIALS);
        }
        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponseDTO(token,userMapper.mapToResponse(user));
    }

    @Override
    public List<UserSearchResponseDTO> searchUsers(String authHeader, String email) {
        getUserByAuth(authHeader);

        if (email == null || email.isBlank()) {
            throw new BadRequestException(ExceptionConstants.EMAIL_REQUIRED);
        }
        List<User> users = userRepository.findTop10ByEmailStartingWithIgnoreCase(email);
        return users.stream()
                .map(userMapper::mapToSearchResponse)
                .toList();
    }


}
