package com.athelyr.linkmanager.grouplink.repository;

import com.athelyr.linkmanager.grouplink.entity.GroupPrivateLink;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface GroupPrivateLinkRepository extends JpaRepository<GroupPrivateLink , UUID> {
    List<GroupPrivateLink> findByGroupGroupIdAndSharedByUserId(UUID groupId,UUID userId);
}
