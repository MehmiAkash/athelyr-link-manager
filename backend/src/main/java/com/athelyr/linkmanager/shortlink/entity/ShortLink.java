package com.athelyr.linkmanager.shortlink.entity;

import com.athelyr.linkmanager.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Builder
@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "short_links")
public class ShortLink {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID slId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String url;

    @Column(unique = true)
    private String shortCode;

    private boolean favourite;

    private long clickCount;

    private Instant createdAt;

    private Instant updatedAt;

    private Instant lastClickedAt;

}
