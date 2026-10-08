package com.athelyr.linkmanager.group.service;

import com.athelyr.linkmanager.constants.ExceptionConstants;
import com.athelyr.linkmanager.constants.Role;
import com.athelyr.linkmanager.exception.custom.ResourceAlreadyExistsException;
import com.athelyr.linkmanager.exception.custom.ResourceNotFoundException;
import com.athelyr.linkmanager.exception.custom.UnauthorizedException;
import com.athelyr.linkmanager.group.dto.*;
import com.athelyr.linkmanager.group.entity.Group;
import com.athelyr.linkmanager.group.entity.GroupMember;
import com.athelyr.linkmanager.group.mapper.GroupMapper;
import com.athelyr.linkmanager.group.repository.GroupMemberRepository;
import com.athelyr.linkmanager.group.repository.GroupRepository;
import com.athelyr.linkmanager.grouplink.repository.GroupPrivateLinkRepository;
import com.athelyr.linkmanager.grouplink.repository.GroupShortLinkRepository;
import com.athelyr.linkmanager.user.entity.User;
import com.athelyr.linkmanager.user.service.UserService;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class GroupServiceImpl implements GroupService {
    private final GroupMemberRepository groupMemberRepository;
    private final GroupRepository groupRepository;
    private final UserService userService;
    private final GroupMapper groupMapper;
    private final GroupPrivateLinkRepository groupPrivateLinkRepository;
    private final GroupShortLinkRepository groupShortLinkRepository;

    public GroupServiceImpl(
            GroupMemberRepository groupMemberRepository,
            GroupRepository groupRepository,
            UserService userService,
            GroupMapper groupMapper,
            GroupPrivateLinkRepository groupPrivateLinkRepository,
            GroupShortLinkRepository groupShortLinkRepository
    ){
        this.groupMemberRepository=groupMemberRepository;
        this.groupRepository=groupRepository;
        this.userService=userService;
        this.groupMapper= groupMapper;
        this.groupPrivateLinkRepository = groupPrivateLinkRepository;
        this.groupShortLinkRepository = groupShortLinkRepository;
    }


    @Override
    public GroupResponseDTO createGroup(String authHeader,GroupRequestDTO groupRequestDTO) {
        User user = userService.getUserByAuth(authHeader);
        Instant now = Instant.now();
        Group group = Group.builder()
                .groupName(groupRequestDTO.getGroupName())
                .description(groupRequestDTO.getDescription())
                .createdAt(now)
                .build();
        GroupMember groupMember = GroupMember.builder()
                .group(group)
                .user(user)
                .role(Role.OWNER)
                .addedAt(now)
                .build();
        Group newGroup = groupRepository.save(group);
        GroupMember newGroupMember = groupMemberRepository.save(groupMember);

        return groupMapper.mapToResponse(newGroup,List.of(newGroupMember));
    }

    @Override
    public GroupResponseDTO addUserInGroup(String authHeader, UUID groupId , GroupMemberRequestDTO groupMemberRequestDTO){
        User user = userService.getUserByAuth(authHeader);
        User addUser = userService.getUserByEmail(groupMemberRequestDTO.getEmail());
        Group group = groupRepository.findById(groupId).orElseThrow(()->new ResourceNotFoundException(ExceptionConstants.GROUP_NOT_FOUND));
        GroupMember mainMember = groupMemberRepository.findByGroupGroupIdAndUserUserId(groupId,user.getUserId()).orElseThrow(()->new ResourceNotFoundException(ExceptionConstants.USER_NOT_FOUND));
        if(mainMember.getRole()!=Role.OWNER && mainMember.getRole()!=Role.ADMIN){
            throw new UnauthorizedException(ExceptionConstants.USER_NOT_ALLOWED);
        }
        Instant now = Instant.now();
        GroupMember newGroupMember = GroupMember.builder()
                .group(group)
                .user(addUser)
                .role(groupMemberRequestDTO.getRole() == null
                        ? Role.MEMBER
                        : groupMemberRequestDTO.getRole())
                .addedAt(now)
                .build();
        if(groupMemberRepository.existsByGroupGroupIdAndUserEmail(groupId,groupMemberRequestDTO.getEmail())) {
            throw new ResourceAlreadyExistsException(ExceptionConstants.USER_ALREADY_EXISTS);
        }
        groupMemberRepository.save(newGroupMember);
        List<GroupMember> groupMembers = groupMemberRepository.findByGroupGroupId(groupId);

        return groupMapper.mapToResponse(group, groupMembers);
    }

    @Override
    public void leaveGroup(String authHeader, UUID groupId) {
        User user = userService.getUserByAuth(authHeader);
        GroupMember groupMember = groupMemberRepository.findByGroupGroupIdAndUserUserId(groupId,user.getUserId()).orElseThrow(()->new ResourceNotFoundException(ExceptionConstants.USER_NOT_FOUND));
        if(groupMember.getRole()==Role.OWNER){
            throw new UnauthorizedException(ExceptionConstants.OWNER_CANNOT_LEAVE);
        }
        groupMemberRepository.deleteByGroupGroupIdAndUserUserId(groupId,user.getUserId());
    }


    @Override
    public GroupResponseDTO removeUserFromGroup(String authHeader, UUID groupId,GroupMemberRequestDTO groupMemberRequestDTO) {
        User user = userService.getUserByAuth(authHeader);
        GroupMember groupMember = groupMemberRepository.findByGroupGroupIdAndUserUserId(groupId,user.getUserId()).orElseThrow(()->new ResourceNotFoundException(ExceptionConstants.USER_NOT_FOUND));

        if(groupMember.getRole()!= Role.OWNER && groupMember.getRole()!=Role.ADMIN){
            throw new UnauthorizedException(ExceptionConstants.USER_NOT_ALLOWED);
        };

        User deleteUser = userService.getUserByEmail(groupMemberRequestDTO.getEmail());
        GroupMember deleteMember = groupMemberRepository.findByGroupGroupIdAndUserUserId(groupId,deleteUser.getUserId()).orElseThrow(()->new ResourceNotFoundException(ExceptionConstants.USER_NOT_FOUND));
        if(deleteMember.getRole() == Role.OWNER){
            throw new UnauthorizedException(ExceptionConstants.USER_NOT_ALLOWED);
        }
        groupMemberRepository.deleteByGroupGroupIdAndUserUserId(groupId,deleteMember.getUser().getUserId());
        Group group = groupRepository.findById(groupId).orElseThrow(()->new ResourceNotFoundException(ExceptionConstants.GROUP_NOT_FOUND));
        List<GroupMember> groupMembers = groupMemberRepository.findByGroupGroupId(groupId);
        return groupMapper.mapToResponse(group,groupMembers);
    }

    @Override
    public GroupResponseDTO updateUserRole(String authHeader, UUID groupId, GroupMemberRequestDTO groupMemberRequestDTO) {
        User user = userService.getUserByAuth(authHeader);
        GroupMember groupMember = groupMemberRepository.findByGroupGroupIdAndUserUserId(groupId,user.getUserId()).orElseThrow(()->new ResourceNotFoundException(ExceptionConstants.USER_NOT_FOUND));
        if(groupMember.getRole()!= Role.OWNER){
            throw new UnauthorizedException(ExceptionConstants.USER_NOT_ALLOWED);
        }
        User member = userService.getUserByEmail(groupMemberRequestDTO.getEmail());
        GroupMember groupMember1= groupMemberRepository.findByGroupGroupIdAndUserUserId(groupId,member.getUserId()).orElseThrow(()->new ResourceNotFoundException(ExceptionConstants.USER_NOT_FOUND));
        if(groupMember1.getRole() == Role.OWNER){
            throw new UnauthorizedException(ExceptionConstants.USER_NOT_ALLOWED);
        }
        groupMember1.setRole(groupMemberRequestDTO.getRole());
        groupMemberRepository.save(groupMember1);
        Group group = groupRepository.findById(groupId).orElseThrow(()->new ResourceNotFoundException(ExceptionConstants.GROUP_NOT_FOUND));
        List<GroupMember> groupMembers = groupMemberRepository.findByGroupGroupId(groupId);
        return groupMapper.mapToResponse(group,groupMembers);
    }

    @Override
    public List<GroupsDTO> getAllGroups(String authHeader) {
        User user = userService.getUserByAuth(authHeader);
        List<GroupMember> memberships = groupMemberRepository.findByUserUserId(user.getUserId());
        return memberships.stream()
                .map(member -> groupMapper.mapToGroupDTO(member.getGroup(), member.getRole()))
                .toList();
    }

    @Override
    public List<GroupsDTO> searchGroups(String authHeader, String query) {
        String searchTerm = query == null ? "" : query.trim().toLowerCase();
        return getAllGroups(authHeader).stream()
                .filter(group -> searchTerm.isEmpty()
                        || (group.getGroupName() != null
                                && group.getGroupName().toLowerCase().contains(searchTerm))
                        || (group.getDescription() != null
                                && group.getDescription().toLowerCase().contains(searchTerm)))
                .toList();
    }

    @Override
    public GroupResponseDTO getAllUsersByGroup(String authHeader, UUID groupId) {
        User user = userService.getUserByAuth(authHeader);

        Group group = groupRepository.findById(groupId).orElseThrow(()->new ResourceNotFoundException(ExceptionConstants.GROUP_NOT_FOUND));
        if(!groupMemberRepository.existsByGroupGroupIdAndUserEmail(groupId, user.getEmail())) {
            throw new UnauthorizedException(ExceptionConstants.USER_NOT_ALLOWED);
        }
        List<GroupMember> groupMembers = groupMemberRepository.findByGroupGroupId(groupId);

        return groupMapper.mapToResponse(group, groupMembers);
    }

    @Override
    @Transactional
    public void deleteGroup(String authHeader, UUID groupId) {
        User user = userService.getUserByAuth(authHeader);
        GroupMember groupMember = groupMemberRepository.findByGroupGroupIdAndUserUserId(groupId,user.getUserId()).orElseThrow(()->new ResourceNotFoundException(ExceptionConstants.USER_NOT_FOUND));
        if(groupMember.getRole()!= Role.OWNER){
            throw new UnauthorizedException(ExceptionConstants.USER_NOT_ALLOWED);
        }

        groupPrivateLinkRepository.deleteAllByGroupId(groupId);
        groupShortLinkRepository.deleteAllByGroupId(groupId);
        groupMemberRepository.deleteAllByGroupId(groupId);
        groupRepository.deleteById(groupId);
    }

    @Override
    public GroupsDTO getGroupById(String authHeader, UUID groupId) {
        User user = userService.getUserByAuth(authHeader);
        GroupMember member = groupMemberRepository.findByGroupGroupIdAndUserUserId(groupId,user.getUserId()).orElseThrow(()->new ResourceNotFoundException(ExceptionConstants.USER_NOT_FOUND)) ;
        return groupMapper.mapToGroupDTO(member.getGroup(), member.getRole());

    }


}
