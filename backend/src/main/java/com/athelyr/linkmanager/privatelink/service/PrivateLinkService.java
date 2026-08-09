package com.athelyr.linkmanager.privatelink.service;

import com.athelyr.linkmanager.privatelink.dto.PrivateLinkRequestDTO;
import com.athelyr.linkmanager.privatelink.dto.PrivateLinkResponseDTO;
import com.athelyr.linkmanager.privatelink.dto.UpdatePrivateLinkRequestDTO;

import java.util.List;
import java.util.UUID;

public interface PrivateLinkService {
    PrivateLinkResponseDTO createPrivateLink(String authHeader , PrivateLinkRequestDTO privateLinkRequestDTO);
    List<PrivateLinkResponseDTO> getPrivateLinkByUser(String authHeader);
    void updateCopyCount(String authHeader , UUID plId);
    void deletePrivateLink(String authHeader , UUID plId);
    PrivateLinkResponseDTO updatePrivateLink(String authHeader , UUID plId , UpdatePrivateLinkRequestDTO updatePrivateLinkRequestDTO);
}
