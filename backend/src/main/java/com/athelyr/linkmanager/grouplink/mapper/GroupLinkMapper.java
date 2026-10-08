package com.athelyr.linkmanager.grouplink.mapper;

import com.athelyr.linkmanager.constants.LinkType;
import com.athelyr.linkmanager.grouplink.dto.GroupPrivateLinkResponseDTO;
import com.athelyr.linkmanager.grouplink.dto.GroupShortLinkResponseDTO;
import com.athelyr.linkmanager.grouplink.dto.SharedLinkResponseDTO;
import com.athelyr.linkmanager.grouplink.entity.GroupPrivateLink;
import com.athelyr.linkmanager.grouplink.entity.GroupShortLink;
import com.athelyr.linkmanager.privatelink.entity.PrivateLink;
import com.athelyr.linkmanager.privatelink.mapper.PrivateLinkMapper;
import com.athelyr.linkmanager.shortlink.mapper.ShortLinkMapper;
import org.springframework.stereotype.Component;

@Component
public class GroupLinkMapper {
    private final  PrivateLinkMapper privateLinkMapper;
    private final ShortLinkMapper shortLinkMapper;
    private GroupLinkMapper(PrivateLinkMapper privateLinkMapper,ShortLinkMapper shortLinkMapper){
        this.privateLinkMapper=privateLinkMapper;
        this.shortLinkMapper=shortLinkMapper;
    }
    public SharedLinkResponseDTO mapToPrivateLinkResponse(LinkType linkType , GroupPrivateLink groupPrivateLink){
        SharedLinkResponseDTO sharedLinkResponseDTO = new SharedLinkResponseDTO();
        sharedLinkResponseDTO.setGroupLinkId(groupPrivateLink.getId());
        sharedLinkResponseDTO.setLinkType(linkType);

        GroupPrivateLinkResponseDTO groupPrivateLinkResponseDTO = new GroupPrivateLinkResponseDTO();

        groupPrivateLinkResponseDTO.setPrivateLinkResponseDTO(privateLinkMapper.mapToResponse(groupPrivateLink.getPrivateLink()));
        groupPrivateLinkResponseDTO.setSharedBy(groupPrivateLink.getSharedBy().getName());
        groupPrivateLinkResponseDTO.setSharedByUserId(groupPrivateLink.getSharedBy().getUserId());
        groupPrivateLinkResponseDTO.setSharedAt(groupPrivateLink.getSharedAt());

        sharedLinkResponseDTO.setGroupPrivateLinkResponseDTO(groupPrivateLinkResponseDTO);

        return sharedLinkResponseDTO;
    }
    public SharedLinkResponseDTO mapToShortLinkResponse(LinkType linkType , GroupShortLink groupShortLink){
        SharedLinkResponseDTO sharedLinkResponseDTO = new SharedLinkResponseDTO();
        sharedLinkResponseDTO.setGroupLinkId(groupShortLink.getId());
        sharedLinkResponseDTO.setLinkType(linkType);

        GroupShortLinkResponseDTO groupShortLinkResponseDTO = new GroupShortLinkResponseDTO();

        groupShortLinkResponseDTO.setShortLinkResponseDTO(shortLinkMapper.mapToResponse(groupShortLink.getShortLink()));
        groupShortLinkResponseDTO.setSharedBy(groupShortLink.getSharedBy().getName());
        groupShortLinkResponseDTO.setSharedByUserId(groupShortLink.getSharedBy().getUserId());
        groupShortLinkResponseDTO.setSharedAt(groupShortLink.getSharedAt());

        sharedLinkResponseDTO.setGroupShortLinkResponseDTO(groupShortLinkResponseDTO);

        return  sharedLinkResponseDTO;
    }
}
