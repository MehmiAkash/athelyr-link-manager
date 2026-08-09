package com.athelyr.linkmanager.grouplink.service;

import com.athelyr.linkmanager.constants.ExceptionConstants;
import com.athelyr.linkmanager.constants.LinkType;
import com.athelyr.linkmanager.exception.custom.ResourceNotFoundException;
import com.athelyr.linkmanager.exception.custom.UnauthorizedException;
import com.athelyr.linkmanager.group.entity.Group;
import com.athelyr.linkmanager.group.repository.GroupMemberRepository;
import com.athelyr.linkmanager.group.repository.GroupRepository;

import com.athelyr.linkmanager.grouplink.dto.SharedLinkRequestDTO;
import com.athelyr.linkmanager.grouplink.dto.SharedLinkResponseDTO;
import com.athelyr.linkmanager.grouplink.entity.GroupPrivateLink;
import com.athelyr.linkmanager.grouplink.entity.GroupShortLink;
import com.athelyr.linkmanager.grouplink.mapper.GroupLinkMapper;
import com.athelyr.linkmanager.grouplink.repository.GroupPrivateLinkRepository;
import com.athelyr.linkmanager.grouplink.repository.GroupShortLinkRepository;
import com.athelyr.linkmanager.privatelink.entity.PrivateLink;
import com.athelyr.linkmanager.privatelink.repository.PrivateLinkRepository;
import com.athelyr.linkmanager.shortlink.entity.ShortLink;
import com.athelyr.linkmanager.shortlink.repository.ShortLinkRepository;
import com.athelyr.linkmanager.user.entity.User;

import com.athelyr.linkmanager.user.service.UserService;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class GroupLinksServiceImpl implements GroupLinksService {
    private  final GroupPrivateLinkRepository groupPrivateLinkRepository;

    private  final GroupShortLinkRepository groupShortLinkRepository;

    private final PrivateLinkRepository privateLinkRepository;

    private final ShortLinkRepository shortLinkRepository;

    private final GroupRepository groupRepository;

    private final UserService userService;

    private final GroupMemberRepository groupMemberRepository;

    private final GroupLinkMapper groupLinkMapper;



    public GroupLinksServiceImpl(GroupShortLinkRepository groupShortLinkRepository, GroupPrivateLinkRepository groupPrivateLinkRepository , UserService userService, PrivateLinkRepository privateLinkRepository, ShortLinkRepository shortLinkRepository , GroupRepository groupRepository, GroupLinkMapper groupLinkMapper , GroupMemberRepository groupMemberRepository){
        this.groupPrivateLinkRepository = groupPrivateLinkRepository;
        this.groupShortLinkRepository = groupShortLinkRepository;
        this.shortLinkRepository = shortLinkRepository;
        this.privateLinkRepository = privateLinkRepository;
        this.groupRepository= groupRepository;
        this.userService = userService;
        this.groupLinkMapper = groupLinkMapper;
        this.groupMemberRepository = groupMemberRepository;
    }

    @Override
    public SharedLinkResponseDTO shareLink(String authHeader, SharedLinkRequestDTO sharedLinkRequestDTO) {
        User user = userService.getUserByAuth(authHeader);
        groupMemberRepository.findByGroupGroupIdAndUserUserId(
                sharedLinkRequestDTO.getGroupId(),
                user.getUserId()
        ).orElseThrow(() -> new UnauthorizedException(ExceptionConstants.USER_NOT_ALLOWED));

        return switch (sharedLinkRequestDTO.getLinkType()){
            case PRIVATE ->
                    sharePrivateLink(user,sharedLinkRequestDTO);
            case SHORT ->
                    shareShortLink(user,sharedLinkRequestDTO);
        };
    }

    @Override
    public List<SharedLinkResponseDTO> getAllGroupLinks(String authHeader, SharedLinkRequestDTO sharedLinkRequestDTO) {
        User user = userService.getUserByAuth(authHeader);
        return switch (sharedLinkRequestDTO.getLinkType()) {
            case PRIVATE -> getAllSharedPrivateLink(user.getUserId(), sharedLinkRequestDTO);
            case SHORT -> getAllSharedShortLink(user.getUserId(), sharedLinkRequestDTO);
        };
    }
    private List<SharedLinkResponseDTO> getAllSharedPrivateLink(UUID userId, SharedLinkRequestDTO sharedLinkRequestDTO){

        groupMemberRepository.findByGroupGroupIdAndUserUserId(
                sharedLinkRequestDTO.getGroupId(),
                userId
        ).orElseThrow(() -> new UnauthorizedException(ExceptionConstants.USER_NOT_ALLOWED));
        List<GroupPrivateLink> groupPrivateLinks = groupPrivateLinkRepository.findByGroupGroupIdAndSharedByUserId(sharedLinkRequestDTO.getGroupId(),userId);
        return groupPrivateLinks.stream()
                .map(groupPrivateLink -> groupLinkMapper.mapToPrivateLinkResponse(LinkType.PRIVATE,groupPrivateLink))
                .toList();
    }
    private List<SharedLinkResponseDTO> getAllSharedShortLink(UUID userId, SharedLinkRequestDTO sharedLinkRequestDTO){
        groupMemberRepository.findByGroupGroupIdAndUserUserId(
                sharedLinkRequestDTO.getGroupId(),
                userId
        ).orElseThrow(() -> new UnauthorizedException(ExceptionConstants.USER_NOT_FOUND));
        List<GroupShortLink> groupShortLinks = groupShortLinkRepository.findByGroupGroupIdAndSharedByUserId(sharedLinkRequestDTO.getGroupId(),userId);
        return groupShortLinks.stream()
                .map(groupShortLink -> groupLinkMapper.mapToShortLinkResponse(LinkType.SHORT,groupShortLink))
                .toList();
    }
    private SharedLinkResponseDTO sharePrivateLink(User user, SharedLinkRequestDTO sharedLinkRequestDTO){
        Group group = groupRepository.findById(sharedLinkRequestDTO.getGroupId()).orElseThrow(()->new ResourceNotFoundException(ExceptionConstants.GROUP_NOT_FOUND));
        PrivateLink privateLink = privateLinkRepository.findById(sharedLinkRequestDTO.getLinkId()).orElseThrow(()->new ResourceNotFoundException(ExceptionConstants.PRIVATE_LINK_NOT_FOUND));
        Instant now = Instant.now();
        GroupPrivateLink groupPrivateLink = GroupPrivateLink.builder()
                .group(group)
                .privateLink(privateLink)
                .sharedBy(user)
                .sharedAt(now)
                .build();
        GroupPrivateLink saved = groupPrivateLinkRepository.save(groupPrivateLink);
        return groupLinkMapper.mapToPrivateLinkResponse(sharedLinkRequestDTO.getLinkType(),saved);
    }

    private SharedLinkResponseDTO shareShortLink(User user, SharedLinkRequestDTO sharedLinkRequestDTO){
        Group group = groupRepository.findById(sharedLinkRequestDTO.getGroupId()).orElseThrow(()->new ResourceNotFoundException(ExceptionConstants.GROUP_NOT_FOUND));
        ShortLink shortLink = shortLinkRepository.findById(sharedLinkRequestDTO.getLinkId()).orElseThrow(()->new ResourceNotFoundException(ExceptionConstants.SHORT_LINK_NOT_FOUND));
        Instant now = Instant.now();
        GroupShortLink groupShortLink = GroupShortLink.builder()
                .group(group)
                .shortLink(shortLink)
                .sharedBy(user)
                .sharedAt(now)
                .build();
        GroupShortLink saved = groupShortLinkRepository.save(groupShortLink);
        return groupLinkMapper.mapToShortLinkResponse(sharedLinkRequestDTO.getLinkType(),saved);
    }


}
