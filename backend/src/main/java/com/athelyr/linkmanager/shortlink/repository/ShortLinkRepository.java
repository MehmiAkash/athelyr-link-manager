package com.athelyr.linkmanager.shortlink.repository;

import com.athelyr.linkmanager.shortlink.entity.ShortLink;
import com.athelyr.linkmanager.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ShortLinkRepository extends JpaRepository<ShortLink, UUID> {
    Optional<ShortLink> findByShortCode(String shortCode);

    boolean existsByShortCode(String shortCode);

    Optional<ShortLink> findBySlIdAndUser(UUID slId, User user);

    List<ShortLink> findByUser(User user);
}
