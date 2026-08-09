package com.athelyr.linkmanager.privatelink.repository;

import com.athelyr.linkmanager.privatelink.entity.PrivateLink;
import com.athelyr.linkmanager.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PrivateLinkRepository extends JpaRepository<PrivateLink, UUID> {

    List<PrivateLink> findByUser(User user);
    Optional<PrivateLink> findByPlIdAndUser(UUID plId , User user);

}
