package com.athelyr.linkmanager.group.mapper;

import com.athelyr.linkmanager.group.dto.GroupMembersDTO;
import com.athelyr.linkmanager.group.dto.GroupResponseDTO;
import com.athelyr.linkmanager.group.dto.GroupsDTO;
import com.athelyr.linkmanager.group.entity.Group;
import com.athelyr.linkmanager.group.entity.GroupMember;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class GroupMapper {
    public GroupResponseDTO mapToResponse(Group group , List<GroupMember> groupMember){
        List<GroupMembersDTO> memberDTOList = groupMember.stream()
                .map(member->{
                    GroupMembersDTO groupMembersDTO = new GroupMembersDTO();
                    groupMembersDTO.setMemberId(member.getMemberId());
                    groupMembersDTO.setName(member.getUser().getName());
                    groupMembersDTO.setEmail(member.getUser().getEmail());
                    groupMembersDTO.setRole(member.getRole());
                    return groupMembersDTO;
                }).toList();

        GroupResponseDTO responseDTO = new GroupResponseDTO();
        responseDTO.setGroupId(group.getGroupId());
        responseDTO.setGroupName(group.getGroupName());
        responseDTO.setDescription(group.getDescription());
        responseDTO.setCreatedAt(group.getCreatedAt());
        responseDTO.setGroupMembersDTOList(memberDTOList);

        return responseDTO;
    }
    public GroupsDTO mapToGroupDTO(Group group) {

        GroupsDTO dto = new GroupsDTO();

        dto.setGroupId(group.getGroupId());
        dto.setGroupName(group.getGroupName());
        dto.setDescription(group.getDescription());
        dto.setCreatedAt(group.getCreatedAt());

        return dto;
    }
}
