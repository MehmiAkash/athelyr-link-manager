package com.athelyr.linkmanager.service;

import com.athelyr.linkmanager.config.JwtService;
import com.athelyr.linkmanager.exception.custom.InvalidTokenException;
import com.athelyr.linkmanager.exception.custom.ResourceAlreadyExistsException;
import com.athelyr.linkmanager.exception.custom.UnauthorizedException;
import com.athelyr.linkmanager.user.dto.*;
import com.athelyr.linkmanager.user.entity.User;
import com.athelyr.linkmanager.user.mapper.UserMapper;
import com.athelyr.linkmanager.user.repository.UserRepository;
import com.athelyr.linkmanager.user.service.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private UserMapper userMapper;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private UserServiceImpl userService;

    private UserRequestDTO registerRequest;
    private LoginRequestDTO loginRequest;

    @BeforeEach
    void createRegisterRequest() {
        registerRequest = new UserRequestDTO();
        registerRequest.setName("Akash");
        registerRequest.setEmail("test@gmail.com");
        registerRequest.setPassword("Password1");
    }

    @BeforeEach
    void createLoginRequest() {
        loginRequest = new LoginRequestDTO();
        loginRequest.setEmail("test@gmail.com");
        loginRequest.setPassword("Password1");
    }


    // Successful registration
    @Test
    void createUser_shouldCreateUserSuccessfully() {
        when(userRepository.existsByEmail(registerRequest.getEmail()))
                .thenReturn(false);

        when(passwordEncoder.encode(registerRequest.getPassword()))
                .thenReturn("encodedPassword");

        User savedUser = new User();
        savedUser.setName(registerRequest.getName());
        savedUser.setEmail(registerRequest.getEmail());
        savedUser.setPassword("encodedPassword");

        when(userRepository.save(any(User.class)))
                .thenReturn(savedUser);

        when(jwtService.generateToken(registerRequest.getEmail()))
                .thenReturn("fake-jwt-token");

        UserResponseDTO expectedUserResponse = new UserResponseDTO();
        expectedUserResponse.setName("Akash");
        expectedUserResponse.setEmail("test@gmail.com");

        when(userMapper.mapToResponse(savedUser))
                .thenReturn(expectedUserResponse);

        AuthResponseDTO result =
                userService.createUser(registerRequest);

        // Check actual response
        assertEquals("fake-jwt-token", result.getToken());
        assertEquals(expectedUserResponse, result.getUser());
    }


    // Duplicate email
    @Test
    void createUser_shouldThrowException_whenEmailAlreadyExists() {

        when(userRepository.existsByEmail(registerRequest.getEmail()))
                .thenReturn(true);

        assertThrows(
                ResourceAlreadyExistsException.class,
                () -> userService.createUser(registerRequest)
        );
    }
    @Test
    void updateUser_shouldUpdateSuccessfully() {

        // Authentication
        String authHeader = "Bearer fake-jwt-token";

        when(jwtService.extractEmail("fake-jwt-token"))
                .thenReturn("test@gmail.com");

        // Existing user from database
        User existingUser = new User();
        existingUser.setName("Akash");
        existingUser.setEmail("test@gmail.com");
        existingUser.setPassword("encodedPassword");

        when(userRepository.findByEmail("test@gmail.com"))
                .thenReturn(Optional.of(existingUser));


        // Update request
        UpdateProfileRequestDTO updateRequest = new UpdateProfileRequestDTO();
        updateRequest.setName("Akash");
        updateRequest.setBio("Artist");
        updateRequest.setDob(LocalDate.of(2002, 10, 20));


        // Repository saves updated user
        when(userRepository.save(any(User.class)))
                .thenReturn(existingUser);


        // Expected response
        UserResponseDTO expectedUserResponse = new UserResponseDTO();
        expectedUserResponse.setName("Akash");
        expectedUserResponse.setEmail("test@gmail.com");
        expectedUserResponse.setBio("Artist");
        expectedUserResponse.setDob(LocalDate.of(2002, 10, 20));

        when(userMapper.mapToResponse(existingUser))
                .thenReturn(expectedUserResponse);


        // ACT
        UserResponseDTO result =
                userService.updateUser(authHeader, updateRequest);


        // ASSERT
        assertEquals("Akash", result.getName());
        assertEquals("test@gmail.com", result.getEmail());
        assertEquals("Artist", result.getBio());
        assertEquals(
                LocalDate.of(2002, 10, 20),
                result.getDob()
        );
    }

    @Test
    void getUserByAuth_shouldRejectMissingBearerToken() {
        assertThrows(
                InvalidTokenException.class,
                () -> userService.getUserByAuth(null)
        );
    }

    @Test
    void getUserByAuth_shouldRejectExpiredOrInvalidToken() {
        when(jwtService.extractEmail("expired-token"))
                .thenThrow(new io.jsonwebtoken.JwtException("Token expired"));

        assertThrows(
                InvalidTokenException.class,
                () -> userService.getUserByAuth("Bearer expired-token")
        );
    }

    // Successful login
    @Test
    void login_shouldLoginSuccessfully() {

        User user = new User();
        user.setEmail(loginRequest.getEmail());
        user.setPassword("encodedPassword");

        when(userRepository.findByEmail(loginRequest.getEmail()))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
                loginRequest.getPassword(),
                "encodedPassword"
        )).thenReturn(true);

        when(jwtService.generateToken(loginRequest.getEmail()))
                .thenReturn("fake-jwt-token");

        UserResponseDTO expectedUserResponse = new UserResponseDTO();
        expectedUserResponse.setName("Akash");
        expectedUserResponse.setEmail("test@gmail.com");

        when(userMapper.mapToResponse(user))
                .thenReturn(expectedUserResponse);

        AuthResponseDTO result =
                userService.login(loginRequest);

        assertEquals("fake-jwt-token", result.getToken());
        assertEquals(expectedUserResponse, result.getUser());
    }


    // Wrong password
    @Test
    void login_shouldThrowException_whenPasswordIsWrong() {

        User user = new User();
        user.setEmail(loginRequest.getEmail());
        user.setPassword("encodedPassword");

        when(userRepository.findByEmail(loginRequest.getEmail()))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
                loginRequest.getPassword(),
                "encodedPassword"
        )).thenReturn(false);

        assertThrows(
                UnauthorizedException.class,
                () -> userService.login(loginRequest)
        );
    }
    @Test
    void searchUsers_shouldReturnUsersSuccessfully() {

        // Authentication
        String authHeader = "Bearer fake-jwt-token";

        when(jwtService.extractEmail("fake-jwt-token"))
                .thenReturn("test@gmail.com");

        User loggedInUser = new User();
        loggedInUser.setEmail("test@gmail.com");

        when(userRepository.findByEmail("test@gmail.com"))
                .thenReturn(Optional.of(loggedInUser));


        // Search result from repository
        User searchedUser = new User();
        searchedUser.setName("Rahul");
        searchedUser.setEmail("rahul@gmail.com");

        when(userRepository.findTop10ByEmailStartingWithIgnoreCase("rahul"))
                .thenReturn(List.of(searchedUser));


        // Mapper response
        UserSearchResponseDTO expectedResponse = new UserSearchResponseDTO();
        expectedResponse.setName("Rahul");
        expectedResponse.setEmail("rahul@gmail.com");

        when(userMapper.mapToSearchResponse(searchedUser))
                .thenReturn(expectedResponse);


        // ACT
        List<UserSearchResponseDTO> result =
                userService.searchUsers(authHeader, "rahul");


        // ASSERT
        assertEquals(1, result.size());
        assertEquals("Rahul", result.get(0).getName());
        assertEquals("rahul@gmail.com", result.get(0).getEmail());
    }






}