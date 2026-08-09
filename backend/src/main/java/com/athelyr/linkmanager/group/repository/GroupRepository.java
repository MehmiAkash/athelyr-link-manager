package com.athelyr.linkmanager.group.repository;

import com.athelyr.linkmanager.group.entity.Group;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface GroupRepository extends JpaRepository<Group , UUID> {

}
