package com.athelyr.linkmanager.privatelink.repository;

import com.athelyr.linkmanager.privatelink.entity.PrivateLink;
import com.athelyr.linkmanager.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PrivateLinkRepository extends JpaRepository<PrivateLink, UUID> {

    List<PrivateLink> findByUser(User user);
    List<PrivateLink> findByUserOrderByCreatedAtDesc(User user);
    Page<PrivateLink> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    Page<PrivateLink> findByUserAndFavouriteOrderByCreatedAtDesc(
            User user,
            boolean favourite,
            Pageable pageable
    );
    @Query("""
            SELECT link FROM PrivateLink link
            WHERE link.user = :user
              AND (:favourite IS NULL OR link.favourite = :favourite)
              AND (
                    :search = ''
                    OR LOWER(link.title) LIKE LOWER(CONCAT('%', :search, '%'))
                    OR LOWER(link.url) LIKE LOWER(CONCAT('%', :search, '%'))
              )
            """)
    Page<PrivateLink> searchByUser(
            @Param("user") User user,
            @Param("favourite") Boolean favourite,
            @Param("search") String search,
            Pageable pageable
    );
    Optional<PrivateLink> findByPlIdAndUser(UUID plId , User user);
    boolean existsByUserAndTitle(User user, String title);
}
