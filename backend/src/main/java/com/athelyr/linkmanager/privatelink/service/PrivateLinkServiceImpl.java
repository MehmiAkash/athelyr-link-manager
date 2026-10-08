package com.athelyr.linkmanager.privatelink.service;

import com.athelyr.linkmanager.constants.ExceptionConstants;
import com.athelyr.linkmanager.exception.custom.ResourceNotFoundException;
import com.athelyr.linkmanager.exception.custom.BadRequestException;
import com.athelyr.linkmanager.grouplink.repository.GroupPrivateLinkRepository;
import com.athelyr.linkmanager.privatelink.dto.PrivateLinkRequestDTO;
import com.athelyr.linkmanager.privatelink.dto.PrivateLinkResponseDTO;
import com.athelyr.linkmanager.privatelink.dto.UpdatePrivateLinkRequestDTO;
import com.athelyr.linkmanager.privatelink.entity.PrivateLink;
import com.athelyr.linkmanager.privatelink.mapper.PrivateLinkMapper;
import com.athelyr.linkmanager.privatelink.repository.PrivateLinkRepository;
import com.athelyr.linkmanager.user.entity.User;
import com.athelyr.linkmanager.user.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class PrivateLinkServiceImpl implements PrivateLinkService {
    private final PrivateLinkRepository privateLinkRepository;
    private final UserService userService;
    private final PrivateLinkMapper privateLinkMapper;
    private final GroupPrivateLinkRepository groupPrivateLinkRepository;

    public PrivateLinkServiceImpl(
            PrivateLinkRepository privateLinkRepository,
            UserService userService,
            PrivateLinkMapper privateLinkMapper,
            GroupPrivateLinkRepository groupPrivateLinkRepository
    ){
        this.privateLinkRepository = privateLinkRepository;
        this.userService = userService;
        this.privateLinkMapper = privateLinkMapper;
        this.groupPrivateLinkRepository = groupPrivateLinkRepository;
    }
    @Override
    public PrivateLinkResponseDTO createPrivateLink(String authHeader , PrivateLinkRequestDTO privateLinkRequestDTO) {
        User user = userService.getUserByAuth(authHeader);

        if (privateLinkRepository.existsByUserAndTitle(user, privateLinkRequestDTO.getTitle())) {
            throw new IllegalArgumentException(ExceptionConstants.LINK_TITLE_ALREADY_EXISTS);
        }
        Instant now = Instant.now();
        PrivateLink privateLink = PrivateLink.builder()
                .user(user)
                .title(privateLinkRequestDTO.getTitle())
                .url(privateLinkRequestDTO.getUrl())
                .favourite(privateLinkRequestDTO.isFavourite())
                .copyCount(0)
                .createdAt(now)
                .build();
        PrivateLink newPrivateLink = privateLinkRepository.save(privateLink);
        return privateLinkMapper.mapToResponse(newPrivateLink);
    }

    @Override
    public List<PrivateLinkResponseDTO> getPrivateLinkByUser(String authHeader) {
        User user = userService.getUserByAuth(authHeader);

        List<PrivateLink> privateLinks = privateLinkRepository.findByUserOrderByCreatedAtDesc(user);
        return privateLinks.stream()
                .map(privateLinkMapper::mapToResponse)
                .toList();
    }

    @Override
    public Page<PrivateLinkResponseDTO> getPrivateLinkByUser(
            String authHeader,
            Pageable pageable,
            Boolean favourite
    ) {
        return getPrivateLinkByUser(authHeader, pageable, favourite, "");
    }

    @Override
    public Page<PrivateLinkResponseDTO> getPrivateLinkByUser(
            String authHeader,
            Pageable pageable,
            Boolean favourite,
            String search
    ) {
        User user = userService.getUserByAuth(authHeader);
        Page<PrivateLink> links = privateLinkRepository.searchByUser(
                user,
                favourite,
                search == null ? "" : search.trim(),
                pageable
        );
        return links.map(privateLinkMapper::mapToResponse);
    }

    @Override
    public void updateCopyCount(String authHeader, UUID plId) {
        User user = userService.getUserByAuth(authHeader);
        PrivateLink privateLink = privateLinkRepository.findByPlIdAndUser(plId,user).orElseThrow(()->new ResourceNotFoundException(ExceptionConstants.PRIVATE_LINK_NOT_FOUND));
        Instant now = Instant.now();
        privateLink.setCopyCount(privateLink.getCopyCount()+1);
        privateLink.setLastCopiedAt(now);
        privateLink.setUpdatedAt(now);

        privateLinkRepository.save(privateLink);

    }

    @Override
    public void deletePrivateLink(String authHeader, UUID plId) {
        User user = userService.getUserByAuth(authHeader);
        PrivateLink privateLink = privateLinkRepository.findByPlIdAndUser(plId,user).orElseThrow(()->new ResourceNotFoundException(ExceptionConstants.PRIVATE_LINK_NOT_FOUND));
        if (groupPrivateLinkRepository.existsByPrivateLink_PlId(plId)) {
            throw new BadRequestException(ExceptionConstants.LINK_SHARED_WITH_GROUPS);
        }
        privateLinkRepository.delete(privateLink);
    }

    @Override
    public PrivateLinkResponseDTO updatePrivateLink(String authHeader,UUID plId, UpdatePrivateLinkRequestDTO updatePrivateLinkRequestDTO) {
        User user = userService.getUserByAuth(authHeader);
        PrivateLink privateLink = privateLinkRepository.findByPlIdAndUser(plId,user).orElseThrow(()->new ResourceNotFoundException(ExceptionConstants.PRIVATE_LINK_NOT_FOUND));
        if(updatePrivateLinkRequestDTO.getTitle()!=null && !updatePrivateLinkRequestDTO.getTitle().isBlank()){
            privateLink.setTitle(updatePrivateLinkRequestDTO.getTitle());
        }
        if(updatePrivateLinkRequestDTO.getUrl()!=null && !updatePrivateLinkRequestDTO.getUrl().isBlank()) {
            privateLink.setUrl(updatePrivateLinkRequestDTO.getUrl());
        }
        Instant now = Instant.now();
        privateLink.setFavourite(updatePrivateLinkRequestDTO.isFavourite());
        privateLink.setUpdatedAt(now);
        PrivateLink savedPrivateLink= privateLinkRepository.save(privateLink);
        return privateLinkMapper.mapToResponse(savedPrivateLink);
    }

}
