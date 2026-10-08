package com.athelyr.linkmanager.shortlink.service;

import com.athelyr.linkmanager.constants.ExceptionConstants;
import com.athelyr.linkmanager.constants.StringConstants;
import com.athelyr.linkmanager.exception.custom.ResourceNotFoundException;
import com.athelyr.linkmanager.exception.custom.BadRequestException;
import com.athelyr.linkmanager.grouplink.repository.GroupShortLinkRepository;
import com.athelyr.linkmanager.shortlink.dto.ShortLinkRequestDTO;
import com.athelyr.linkmanager.shortlink.dto.ShortLinkResponseDTO;
import com.athelyr.linkmanager.shortlink.dto.UpdateShortLinkRequestDTO;
import com.athelyr.linkmanager.shortlink.entity.ShortLink;
import com.athelyr.linkmanager.shortlink.mapper.ShortLinkMapper;
import com.athelyr.linkmanager.shortlink.repository.ShortLinkRepository;
import com.athelyr.linkmanager.user.entity.User;
import com.athelyr.linkmanager.user.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class ShortLinkServiceImpl implements ShortLinkService {
    private final ShortLinkRepository shortLinkRepository;
    private final UserService userService;
    private final ShortLinkMapper shortLinkMapper;
    private final GroupShortLinkRepository groupShortLinkRepository;

    public ShortLinkServiceImpl(
            ShortLinkRepository shortLinkRepository,
            UserService userService,
            ShortLinkMapper shortLinkMapper,
            GroupShortLinkRepository groupShortLinkRepository
    ){
        this.shortLinkRepository = shortLinkRepository;
        this.userService = userService;
        this.shortLinkMapper = shortLinkMapper;
        this.groupShortLinkRepository = groupShortLinkRepository;
    }


    private static final  SecureRandom random = new SecureRandom();

    @Override
    public ShortLinkResponseDTO createShortLink(String authHeader, ShortLinkRequestDTO shortLinkRequestDTO) {
        User user = userService.getUserByAuth(authHeader);
        if(shortLinkRepository.existsByUserAndTitle(user,shortLinkRequestDTO.getTitle())){
            throw new IllegalArgumentException(ExceptionConstants.LINK_TITLE_ALREADY_EXISTS);
        }
        Instant now = Instant.now();
        ShortLink shortLink = ShortLink.builder()
                .user(user)
                .title(shortLinkRequestDTO.getTitle())
                .url(shortLinkRequestDTO.getUrl())
                .shortCode(createUniqueShortCode())
                .favourite(shortLinkRequestDTO.isFavourite())
                .clickCount(0)
                .createdAt(now)
                .build();
        ShortLink savedShortLink = shortLinkRepository.save(shortLink);
        return shortLinkMapper.mapToResponse(savedShortLink);
    }

    @Override
    public String redirectToOriginalUrl(String shortCode) {
        ShortLink shortLink = shortLinkRepository.findByShortCode(shortCode).orElseThrow(()->new ResourceNotFoundException(ExceptionConstants.SHORT_LINK_NOT_FOUND));
        shortLink.setClickCount(shortLink.getClickCount() + 1);
        Instant now = Instant.now();
        shortLink.setLastClickedAt(now);
        shortLinkRepository.save(shortLink);
        return shortLink.getUrl();
    }


    @Override
    public void deleteShortLink(String authHeader, UUID slId) {
        User user = userService.getUserByAuth(authHeader);
        ShortLink shortLink  = shortLinkRepository.findBySlIdAndUser(slId,user).orElseThrow(()->new ResourceNotFoundException(ExceptionConstants.SHORT_LINK_NOT_FOUND));
        if (groupShortLinkRepository.existsByShortLink_SlId(slId)) {
            throw new BadRequestException(ExceptionConstants.LINK_SHARED_WITH_GROUPS);
        }
        shortLinkRepository.delete(shortLink);
    }


    private String createUniqueShortCode(){
        String shortCode ;
        do{
            shortCode = base62();
        }
        while (shortLinkRepository.existsByShortCode(shortCode));
    return  shortCode;
    }

    private String base62(){
        StringBuilder shortCode = new StringBuilder();
        for(int i = 0; i < 7 ; i++){
            int index= random.nextInt(StringConstants.BASE);
            shortCode.append(StringConstants.ALPHABET.charAt(index));
        }
        return shortCode.toString();
    }

    @Override
    public List<ShortLinkResponseDTO> getShortLinksByUser(String authHeader) {
        User user = userService.getUserByAuth(authHeader);
        List<ShortLink> shortLinks = shortLinkRepository.findByUserOrderByCreatedAtDesc(user);
        return shortLinks.stream()
                .map(shortLinkMapper::mapToResponse)
                .toList();
    }

    @Override
    public Page<ShortLinkResponseDTO> getShortLinksByUser(
            String authHeader,
            Pageable pageable,
            Boolean favourite
    ) {
        return getShortLinksByUser(authHeader, pageable, favourite, "");
    }

    @Override
    public Page<ShortLinkResponseDTO> getShortLinksByUser(
            String authHeader,
            Pageable pageable,
            Boolean favourite,
            String search
    ) {
        User user = userService.getUserByAuth(authHeader);
        Page<ShortLink> links = shortLinkRepository.searchByUser(
                user,
                favourite,
                search == null ? "" : search.trim(),
                pageable
        );
        return links.map(shortLinkMapper::mapToResponse);
    }

    @Override
    public ShortLinkResponseDTO updateShortLink(String authHeader, UUID slId, UpdateShortLinkRequestDTO updateShortLinkRequestDTO) {
        User user = userService.getUserByAuth(authHeader);
        ShortLink shortLink = shortLinkRepository.findBySlIdAndUser(slId, user).orElseThrow(()->new ResourceNotFoundException(ExceptionConstants.SHORT_LINK_NOT_FOUND));
        Instant now = Instant.now();
        if(updateShortLinkRequestDTO.getTitle()!=null && !updateShortLinkRequestDTO.getTitle().isBlank()){
            shortLink.setTitle(updateShortLinkRequestDTO.getTitle());
        }
        if(updateShortLinkRequestDTO.getUrl()!=null && !updateShortLinkRequestDTO.getUrl().isBlank()){
            shortLink.setUrl(updateShortLinkRequestDTO.getUrl());
        }
        if(updateShortLinkRequestDTO.isUpdateShortCode()){
            shortLink.setShortCode(createUniqueShortCode());
        }
        shortLink.setFavourite(updateShortLinkRequestDTO.isFavourite());
        shortLink.setUpdatedAt(now);
        ShortLink savedShortLink = shortLinkRepository.save(shortLink);

        return shortLinkMapper.mapToResponse(savedShortLink);
    }



}
