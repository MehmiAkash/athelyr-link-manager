package com.athelyr.linkmanager.privatelink.mapper;

import com.athelyr.linkmanager.privatelink.dto.PrivateLinkResponseDTO;
import com.athelyr.linkmanager.privatelink.entity.PrivateLink;
import org.springframework.stereotype.Component;

@Component
public class PrivateLinkMapper {
    public PrivateLinkResponseDTO mapToResponse(PrivateLink privateLink){
        PrivateLinkResponseDTO response = new PrivateLinkResponseDTO();

        response.setPlId(privateLink.getPlId());
        response.setTitle(privateLink.getTitle());
        response.setUrl(privateLink.getUrl());
        response.setFavourite(privateLink.isFavourite());
        response.setCopyCount(privateLink.getCopyCount());
        response.setCreatedAt(privateLink.getCreatedAt());
        response.setUpdatedAt(privateLink.getUpdatedAt());
        response.setLastCopiedAt(privateLink.getLastCopiedAt());

        return response;

    }
}
