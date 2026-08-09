package com.athelyr.linkmanager.shortlink.mapper;

import com.athelyr.linkmanager.shortlink.dto.ShortLinkResponseDTO;
import com.athelyr.linkmanager.shortlink.entity.ShortLink;
import org.springframework.stereotype.Component;

@Component
public class ShortLinkMapper {
    public ShortLinkResponseDTO mapToResponse(ShortLink shortLink){
        ShortLinkResponseDTO response = new ShortLinkResponseDTO();
        response.setSlId(shortLink.getSlId());
        response.setTitle(shortLink.getTitle());
        response.setUrl(shortLink.getUrl());
        response.setShortCode(shortLink.getShortCode());
        response.setFavourite(shortLink.isFavourite());
        response.setClickCount(shortLink.getClickCount());
        response.setCreatedAt(shortLink.getCreatedAt());
        response.setUpdatedAt(shortLink.getUpdatedAt());
        response.setLastClickedAt(shortLink.getLastClickedAt());
        return response;
    }
}
