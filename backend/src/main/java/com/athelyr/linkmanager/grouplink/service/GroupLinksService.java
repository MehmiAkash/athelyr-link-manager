package com.athelyr.linkmanager.grouplink.service;

import com.athelyr.linkmanager.grouplink.dto.SharedLinkRequestDTO;
import com.athelyr.linkmanager.grouplink.dto.SharedLinkResponseDTO;

import java.util.List;

public interface GroupLinksService {
    SharedLinkResponseDTO shareLink(String authHeader , SharedLinkRequestDTO sharedLinkRequestDTO);
    List<SharedLinkResponseDTO> getAllGroupLinks(String authHeader , SharedLinkRequestDTO sharedLinkRequestDTO);

}
