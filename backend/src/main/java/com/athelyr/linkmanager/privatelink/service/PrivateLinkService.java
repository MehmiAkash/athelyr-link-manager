package com.athelyr.linkmanager.privatelink.service;

import com.athelyr.linkmanager.privatelink.dto.PrivateLinkRequestDTO;
import com.athelyr.linkmanager.privatelink.dto.PrivateLinkResponseDTO;
import com.athelyr.linkmanager.privatelink.dto.UpdatePrivateLinkRequestDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface PrivateLinkService {
    PrivateLinkResponseDTO createPrivateLink(String authHeader , PrivateLinkRequestDTO privateLinkRequestDTO);
    List<PrivateLinkResponseDTO> getPrivateLinkByUser(String authHeader);
    Page<PrivateLinkResponseDTO> getPrivateLinkByUser(
            String authHeader,
            Pageable pageable,
            Boolean favourite
    );
    Page<PrivateLinkResponseDTO> getPrivateLinkByUser(
            String authHeader,
            Pageable pageable,
            Boolean favourite,
            String search
    );
    void updateCopyCount(String authHeader , UUID plId);
    void deletePrivateLink(String authHeader , UUID plId);
    PrivateLinkResponseDTO updatePrivateLink(String authHeader , UUID plId , UpdatePrivateLinkRequestDTO updatePrivateLinkRequestDTO);
}
