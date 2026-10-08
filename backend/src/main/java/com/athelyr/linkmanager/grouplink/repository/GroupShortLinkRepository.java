package com.athelyr.linkmanager.grouplink.repository;

import com.athelyr.linkmanager.grouplink.entity.GroupShortLink;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

public interface GroupShortLinkRepository extends JpaRepository<GroupShortLink, UUID> {
    List<GroupShortLink> findByGroupGroupId(UUID groupId);
    boolean existsByShortLink_SlId(UUID shortLinkId);

    @Modifying
    @Transactional
    @Query("DELETE FROM GroupShortLink sharedLink WHERE sharedLink.group.groupId = :groupId")
    void deleteAllByGroupId(@Param("groupId") UUID groupId);

    @Query("""
            SELECT sharedLink
            FROM GroupShortLink sharedLink
            JOIN sharedLink.shortLink link
            JOIN sharedLink.sharedBy sharer
            WHERE sharedLink.group.groupId = :groupId
              AND (
                :query = ''
                OR LOWER(COALESCE(link.title, '')) LIKE LOWER(CONCAT('%', :query, '%'))
                OR LOWER(COALESCE(link.url, '')) LIKE LOWER(CONCAT('%', :query, '%'))
                OR LOWER(COALESCE(sharer.name, '')) LIKE LOWER(CONCAT('%', :query, '%'))
              )
            """)
    Page<GroupShortLink> searchByGroup(
            @Param("groupId") UUID groupId,
            @Param("query") String query,
            Pageable pageable
    );
}
