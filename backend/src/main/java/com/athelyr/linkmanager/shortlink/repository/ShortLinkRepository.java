package com.athelyr.linkmanager.shortlink.repository;

import com.athelyr.linkmanager.shortlink.entity.ShortLink;
import com.athelyr.linkmanager.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ShortLinkRepository extends JpaRepository<ShortLink, UUID> {
    Optional<ShortLink> findByShortCode(String shortCode);

    boolean existsByShortCode(String shortCode);

    Optional<ShortLink> findBySlIdAndUser(UUID slId, User user);

    List<ShortLink> findByUser(User user);

    List<ShortLink> findByUserOrderByCreatedAtDesc(User user);
    Page<ShortLink> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    Page<ShortLink> findByUserAndFavouriteOrderByCreatedAtDesc(
            User user,
            boolean favourite,
            Pageable pageable
    );

    @Query("""
            SELECT link FROM ShortLink link
            WHERE link.user = :user
              AND (:favourite IS NULL OR link.favourite = :favourite)
              AND (
                    :search = ''
                    OR LOWER(link.title) LIKE LOWER(CONCAT('%', :search, '%'))
                    OR LOWER(link.url) LIKE LOWER(CONCAT('%', :search, '%'))
              )
            """)
    Page<ShortLink> searchByUser(
            @Param("user") User user,
            @Param("favourite") Boolean favourite,
            @Param("search") String search,
            Pageable pageable
    );

    boolean existsByUserAndTitle(User user, String title);
}
