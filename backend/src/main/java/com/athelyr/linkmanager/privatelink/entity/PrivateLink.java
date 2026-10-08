package com.athelyr.linkmanager.privatelink.entity;

import com.athelyr.linkmanager.group.entity.Group;
import com.athelyr.linkmanager.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Data
@Table(name = "Private_Links")
public class PrivateLink {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID plId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id")
    private Group group;   // nullable


    private String title;
    @Column(columnDefinition = "TEXT")
    private String url;

    private boolean favourite;

    private long copyCount;

    private Instant createdAt;

    private Instant updatedAt;

    private Instant lastCopiedAt;

}
