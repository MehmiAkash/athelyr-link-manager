package com.athelyr.linkmanager.grouplink.service;

import com.athelyr.linkmanager.grouplink.dto.SharedLinkRequestDTO;
import com.athelyr.linkmanager.grouplink.dto.ShareLinkRequestDTO;
import com.athelyr.linkmanager.grouplink.dto.SharedLinkResponseDTO;
import com.athelyr.linkmanager.constants.LinkType;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface GroupLinksService {
    SharedLinkResponseDTO shareLink(String authHeader, ShareLinkRequestDTO sharedLinkRequestDTO);
    List<SharedLinkResponseDTO> getAllGroupLinks(String authHeader , SharedLinkRequestDTO sharedLinkRequestDTO);
    Page<SharedLinkResponseDTO> getGroupLinksPage(
            String authHeader,
            SharedLinkRequestDTO sharedLinkRequestDTO,
            Pageable pageable
    );
    void deleteSharedLink(String authHeader, UUID groupId, LinkType linkType, UUID groupLinkId);

}
