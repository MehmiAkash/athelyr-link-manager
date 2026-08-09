package com.athelyr.linkmanager.group.repository;
import com.athelyr.linkmanager.group.entity.GroupMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface GroupMemberRepository extends JpaRepository< GroupMember , UUID> {
    Optional<GroupMember> findByGroupGroupIdAndUserUserId(
            UUID groupId,
            UUID userId);
    List<GroupMember> findByGroupGroupId(UUID groupId);
    List<GroupMember> findByUserUserId(UUID userId);
    boolean existsByGroupGroupIdAndUserEmail(
            UUID groupId,
            String email);
    void deleteByGroupGroupIdAndUserUserId(
            UUID groupId,
            UUID userId);
}
