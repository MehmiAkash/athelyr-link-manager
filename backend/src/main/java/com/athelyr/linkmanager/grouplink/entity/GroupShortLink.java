package com.athelyr.linkmanager.grouplink.entity;

import com.athelyr.linkmanager.group.entity.Group;
import com.athelyr.linkmanager.shortlink.entity.ShortLink;
import com.athelyr.linkmanager.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "group_short_link")
public class GroupShortLink {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id")
    private Group group;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "short_link_id")
    private ShortLink shortLink;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shared_by")
    private User sharedBy;

    private Instant sharedAt;
}