package com.athelyr.linkmanager.shortlink.service;

import com.athelyr.linkmanager.shortlink.dto.ShortLinkRequestDTO;
import com.athelyr.linkmanager.shortlink.dto.ShortLinkResponseDTO;
import com.athelyr.linkmanager.shortlink.dto.UpdateShortLinkRequestDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface ShortLinkService {

    ShortLinkResponseDTO createShortLink(String authHeader , ShortLinkRequestDTO shortLinkRequestDTO);
    String redirectToOriginalUrl(String shortCode);
    void deleteShortLink(String authHeader , UUID slId);
    List<ShortLinkResponseDTO> getShortLinksByUser(String authHeader);
    Page<ShortLinkResponseDTO> getShortLinksByUser(
            String authHeader,
            Pageable pageable,
            Boolean favourite
    );
    Page<ShortLinkResponseDTO> getShortLinksByUser(
            String authHeader,
            Pageable pageable,
            Boolean favourite,
            String search
    );
    ShortLinkResponseDTO updateShortLink(String authHeader, UUID slId , UpdateShortLinkRequestDTO updateShortLinkRequestDTO);
}
