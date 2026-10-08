package com.athelyr.linkmanager.group.repository;
import com.athelyr.linkmanager.group.entity.GroupMember;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface GroupMemberRepository extends JpaRepository< GroupMember , UUID> {
    Optional<GroupMember> findByGroupGroupIdAndUserUserId(
            UUID groupId,
            UUID userId);
    List<GroupMember> findByGroupGroupId(UUID groupId);
    List<GroupMember> findByUserUserId(UUID userId);
    @Modifying
    @Transactional
    @Query("DELETE FROM GroupMember member WHERE member.group.groupId = :groupId")
    void deleteAllByGroupId(@Param("groupId") UUID groupId);
    boolean existsByGroupGroupIdAndUserEmail(
            UUID groupId,
            String email);
    void deleteByGroupGroupIdAndUserUserId(
            UUID groupId,
            UUID userId);
}
