package com.athelyr.linkmanager.grouplink.service;

import com.athelyr.linkmanager.constants.ExceptionConstants;
import com.athelyr.linkmanager.constants.LinkType;
import com.athelyr.linkmanager.constants.Role;
import com.athelyr.linkmanager.exception.custom.ResourceNotFoundException;
import com.athelyr.linkmanager.exception.custom.UnauthorizedException;
import com.athelyr.linkmanager.group.entity.Group;
import com.athelyr.linkmanager.group.entity.GroupMember;
import com.athelyr.linkmanager.group.repository.GroupMemberRepository;
import com.athelyr.linkmanager.group.repository.GroupRepository;

import com.athelyr.linkmanager.grouplink.dto.SharedLinkRequestDTO;
import com.athelyr.linkmanager.grouplink.dto.ShareLinkRequestDTO;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

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
    public SharedLinkResponseDTO shareLink(String authHeader, ShareLinkRequestDTO sharedLinkRequestDTO) {
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
        groupMemberRepository.findByGroupGroupIdAndUserUserId(
                sharedLinkRequestDTO.getGroupId(),
                user.getUserId()
        ).orElseThrow(() -> new UnauthorizedException(ExceptionConstants.USER_NOT_ALLOWED));

        String query = sharedLinkRequestDTO.getQuery() == null
        ? ""
        : sharedLinkRequestDTO.getQuery().trim().toLowerCase();

        return switch (sharedLinkRequestDTO.getLinkType()) {
            case PRIVATE -> groupPrivateLinkRepository
            .findByGroupGroupId(sharedLinkRequestDTO.getGroupId())
            .stream()
            .filter(link -> query.isEmpty()
                    || link.getPrivateLink().getTitle().toLowerCase().contains(query)
                    || link.getPrivateLink().getUrl().toLowerCase().contains(query)
                    || link.getSharedBy().getName().toLowerCase().contains(query))
            .map(link -> groupLinkMapper.mapToPrivateLinkResponse(LinkType.PRIVATE, link))
            .toList();
            case SHORT -> groupShortLinkRepository
            .findByGroupGroupId(sharedLinkRequestDTO.getGroupId())
            .stream()
            .filter(link -> query.isEmpty()
                    || link.getShortLink().getTitle().toLowerCase().contains(query)
                    || link.getShortLink().getUrl().toLowerCase().contains(query)
                    || link.getSharedBy().getName().toLowerCase().contains(query))
            .map(link -> groupLinkMapper.mapToShortLinkResponse(LinkType.SHORT, link))
            .toList();
        };
    }

    @Override
    public Page<SharedLinkResponseDTO> getGroupLinksPage(
            String authHeader,
            SharedLinkRequestDTO sharedLinkRequestDTO,
            Pageable pageable
    ) {
        User user = userService.getUserByAuth(authHeader);
        groupMemberRepository.findByGroupGroupIdAndUserUserId(
                sharedLinkRequestDTO.getGroupId(),
                user.getUserId()
        ).orElseThrow(() -> new UnauthorizedException(ExceptionConstants.USER_NOT_ALLOWED));

        String query = sharedLinkRequestDTO.getQuery() == null
                ? ""
                : sharedLinkRequestDTO.getQuery().trim().toLowerCase();

        return switch (sharedLinkRequestDTO.getLinkType()) {
            case PRIVATE -> groupPrivateLinkRepository
                    .searchByGroup(sharedLinkRequestDTO.getGroupId(), query, pageable)
                    .map(link -> groupLinkMapper.mapToPrivateLinkResponse(LinkType.PRIVATE, link));
            case SHORT -> groupShortLinkRepository
                    .searchByGroup(sharedLinkRequestDTO.getGroupId(), query, pageable)
                    .map(link -> groupLinkMapper.mapToShortLinkResponse(LinkType.SHORT, link));
        };
    }

    @Override
    public void deleteSharedLink(String authHeader, UUID groupId, LinkType linkType, UUID groupLinkId) {
        User user = userService.getUserByAuth(authHeader);
        GroupMember member = groupMemberRepository
                .findByGroupGroupIdAndUserUserId(groupId, user.getUserId())
                .orElseThrow(() -> new UnauthorizedException(ExceptionConstants.USER_NOT_ALLOWED));
        boolean canManageAllShares =
                member.getRole() == Role.OWNER || member.getRole() == Role.ADMIN;

        switch (linkType) {
            case PRIVATE -> {
                GroupPrivateLink sharedLink = groupPrivateLinkRepository.findById(groupLinkId)
                        .orElseThrow(() -> new ResourceNotFoundException("Shared link not found"));
                if (!sharedLink.getGroup().getGroupId().equals(groupId)) {
                    throw new ResourceNotFoundException("Shared link not found");
                }
                if (!canManageAllShares && !sharedLink.getSharedBy().getUserId().equals(user.getUserId())) {
                    throw new UnauthorizedException(ExceptionConstants.USER_NOT_ALLOWED);
                }
                groupPrivateLinkRepository.delete(sharedLink);
            }
            case SHORT -> {
                GroupShortLink sharedLink = groupShortLinkRepository.findById(groupLinkId)
                        .orElseThrow(() -> new ResourceNotFoundException("Shared link not found"));
                if (!sharedLink.getGroup().getGroupId().equals(groupId)) {
                    throw new ResourceNotFoundException("Shared link not found");
                }
                if (!canManageAllShares && !sharedLink.getSharedBy().getUserId().equals(user.getUserId())) {
                    throw new UnauthorizedException(ExceptionConstants.USER_NOT_ALLOWED);
                }
                groupShortLinkRepository.delete(sharedLink);
            }
        }
    }
    private SharedLinkResponseDTO sharePrivateLink(User user, ShareLinkRequestDTO sharedLinkRequestDTO){
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

    private SharedLinkResponseDTO shareShortLink(User user, ShareLinkRequestDTO sharedLinkRequestDTO){
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
