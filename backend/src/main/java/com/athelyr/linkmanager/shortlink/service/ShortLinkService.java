package com.athelyr.linkmanager.shortlink.service;

import com.athelyr.linkmanager.shortlink.dto.ShortLinkRequestDTO;
import com.athelyr.linkmanager.shortlink.dto.ShortLinkResponseDTO;
import com.athelyr.linkmanager.shortlink.dto.UpdateShortLinkRequestDTO;
import com.athelyr.linkmanager.shortlink.entity.ShortLink;
import com.athelyr.linkmanager.user.entity.User;

import java.util.List;
import java.util.UUID;

public interface ShortLinkService {

    ShortLinkResponseDTO createShortLink(String authHeader , ShortLinkRequestDTO shortLinkRequestDTO);
    String redirectToOriginalUrl(String shortCode);
    void deleteShortLink(String authHeader , UUID slId);
    List<ShortLinkResponseDTO> getShortLinksByUser(String authHeader);
    ShortLinkResponseDTO updateShortLink(String authHeader, UUID slId , UpdateShortLinkRequestDTO updateShortLinkRequestDTO);
}
