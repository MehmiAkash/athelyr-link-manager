package com.athelyr.linkmanager.analytics.service;

import com.athelyr.linkmanager.analytics.dto.AnalyticsResponseDTO;
import com.athelyr.linkmanager.analytics.dto.LinkUsageDTO;
import com.athelyr.linkmanager.privatelink.entity.PrivateLink;
import com.athelyr.linkmanager.privatelink.repository.PrivateLinkRepository;
import com.athelyr.linkmanager.shortlink.entity.ShortLink;
import com.athelyr.linkmanager.shortlink.repository.ShortLinkRepository;
import com.athelyr.linkmanager.user.entity.User;
import com.athelyr.linkmanager.user.service.UserService;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {
    private static final int TOP_LINK_LIMIT = 10;

    private final ShortLinkRepository shortLinkRepository;
    private final PrivateLinkRepository privateLinkRepository;
    private final UserService userService;

    public AnalyticsServiceImpl(
            ShortLinkRepository shortLinkRepository,
            PrivateLinkRepository privateLinkRepository,
            UserService userService
    ) {
        this.shortLinkRepository = shortLinkRepository;
        this.privateLinkRepository = privateLinkRepository;
        this.userService = userService;
    }

    @Override
    public AnalyticsResponseDTO getUserAnalytics(String authHeader) {
        User user = userService.getUserByAuth(authHeader);
        List<ShortLink> shortLinks = shortLinkRepository.findByUser(user);
        List<PrivateLink> privateLinks = privateLinkRepository.findByUser(user);

        List<LinkUsageDTO> topShortLinks = shortLinks.stream()
                .filter(link -> link.getClickCount() > 0)
                .sorted(Comparator.comparingLong(ShortLink::getClickCount).reversed())
                .limit(TOP_LINK_LIMIT)
                .map(link -> new LinkUsageDTO(
                        link.getSlId(),
                        link.getTitle(),
                        link.getUrl(),
                        link.getShortCode(),
                        "SHORT",
                        link.getClickCount()
                ))
                .toList();

        List<LinkUsageDTO> topPrivateLinks = privateLinks.stream()
                .filter(link -> link.getCopyCount() > 0)
                .sorted(Comparator.comparingLong(PrivateLink::getCopyCount).reversed())
                .limit(TOP_LINK_LIMIT)
                .map(link -> new LinkUsageDTO(
                        link.getPlId(),
                        link.getTitle(),
                        link.getUrl(),
                        null,
                        "PRIVATE",
                        link.getCopyCount()
                ))
                .toList();

        List<LinkUsageDTO> topLinks = java.util.stream.Stream
                .concat(topShortLinks.stream(), topPrivateLinks.stream())
                .sorted(Comparator.comparingLong(LinkUsageDTO::getUsageCount).reversed())
                .limit(TOP_LINK_LIMIT)
                .toList();

        long shortUsage = shortLinks.stream().mapToLong(ShortLink::getClickCount).sum();
        long privateUsage = privateLinks.stream().mapToLong(PrivateLink::getCopyCount).sum();

        return new AnalyticsResponseDTO(
                topShortLinks,
                topPrivateLinks,
                topLinks,
                shortUsage,
                privateUsage
        );
    }
}
