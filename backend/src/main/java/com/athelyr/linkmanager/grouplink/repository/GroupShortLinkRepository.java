package com.athelyr.linkmanager.grouplink.repository;

import com.athelyr.linkmanager.grouplink.entity.GroupShortLink;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface GroupShortLinkRepository extends JpaRepository<GroupShortLink, UUID> {
    List<GroupShortLink> findByGroupGroupIdAndSharedByUserId(
            UUID groupId,
            UUID userId
    );
}
