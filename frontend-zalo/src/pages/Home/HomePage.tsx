import React, { FC, useEffect } from "react";
import styled from "styled-components";
import { Page, useNavigate } from "zmp-ui";
import { useStore } from "@store";
import { MINI_APP_ID } from "@constants/common";
import { followOfficialAccount, openWebView } from "@service/zalo";
import { HomeSection } from "@dts";
import {
    CITIZEN_TILES,
    KHUPHO_TILES,
    BUSINESS_TILES,
} from "@constants/home-tiles";
import {
    HeroHeader,
    StatCards,
    ExploreBanner,
    OAFollowCard,
    SectionHeading,
    TileGrid,
    FeaturedBanner,
    FeaturedNews,
    NewsList,
    Slider,
    VideoBlock,
    Events,
    BottomNav,
} from "@components/home";
import StatsSection from "./StatsSection";

const PageBg = styled(Page)`
    background: #f4f6f9;
    padding-bottom: calc(64px + var(--zaui-safe-area-inset-bottom, 0px));
`;

const pad2 = (n: number) => String(n).padStart(2, "0");
const formatDateTime = (d: Date) =>
    `${pad2(d.getHours())}:${pad2(d.getMinutes())} ${pad2(d.getDate())}/${pad2(
        d.getMonth() + 1,
    )}/${d.getFullYear()}`;

// Layout mặc định khi backend chưa cấu hình (fallback an toàn, không vỡ giao diện).
const DEFAULT_SECTIONS: HomeSection[] = [
    {
        id: "hero",
        key: "hero",
        order: 1,
        enabled: true,
        title: "CHÍNH QUYỀN SỐ",
        color1: "#C8102E",
        color2: "#7A0C16",
    },
    {
        id: "stats",
        key: "stats",
        order: 2,
        enabled: true,
        color1: "#C8102E",
        color2: "#A4161A",
    },
    { id: "statsDss", key: "statsDss", order: 3, enabled: true },
    {
        id: "explore",
        key: "explore",
        order: 4,
        enabled: true,
        title: "Du lịch địa phương",
        subtitle: "Trải nghiệm thiên nhiên, văn hóa và con người",
        link: "/news",
        color1: "#C8102E",
        color2: "#7A0C16",
    },
    {
        id: "newsList",
        key: "newsList",
        order: 4.5,
        enabled: false,
        title: "Tin tức mới",
    },
    {
        id: "events",
        key: "events",
        order: 4.7,
        enabled: true,
        title: "Sự kiện sắp diễn ra",
    },
    { id: "oa", key: "oa", order: 5, enabled: true },
    {
        id: "citizenGrid",
        key: "citizenGrid",
        order: 6,
        enabled: true,
        title: "Dành cho công dân",
    },
    {
        id: "khuphoGrid",
        key: "khuphoGrid",
        order: 7,
        enabled: true,
        title: "Quản lý khu phố",
    },
    {
        id: "businessGrid",
        key: "businessGrid",
        order: 8,
        enabled: true,
        title: "Dành cho doanh nghiệp, tổ chức",
    },
    {
        id: "featured",
        key: "featured",
        order: 9,
        enabled: true,
        title: "Tin tức Chuyển Đổi Số",
        subtitle: "TIN NỔI BẬT",
        link: "/news",
        color1: "#7A0C16",
        color2: "#C8102E",
    },
];

const HomePage: FC = () => {
    const navigate = useNavigate();
    const organization = useStore(state => state.organization);
    const getOrganization = useStore(state => state.getOrganization);
    const weatherInfo = useStore(state => state.weather);
    const getWeather = useStore(state => state.getWeather);
    const homeSections = useStore(state => state.homeSections);
    const getHomeSections = useStore(state => state.getHomeSections);
    const newsArticles = useStore(state => state.newsArticles);
    const getNewsArticles = useStore(state => state.getNewsArticles);
    const events = useStore(state => state.events);
    const getEvents = useStore(state => state.getEvents);

    useEffect(() => {
        if (!organization) {
            getOrganization?.({ miniAppId: MINI_APP_ID })?.catch?.(
                () => undefined,
            );
        }
        getWeather?.();
        getHomeSections?.();
        getNewsArticles?.({ limit: 6 });
        getEvents?.();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Áp màu chủ đạo toàn app theo cấu hình tổ chức (đổi trong Admin).
    useEffect(() => {
        const c = (organization as any)?.primaryColor;
        if (c) document.documentElement.style.setProperty("--main", c);
    }, [organization]);

    // Đọc cấu hình linh hoạt; nếu backend chưa cung cấp thì dùng giá trị mặc định.
    const org = (organization || {}) as any;
    const wardName = String(
        org.shortName || org.name || "Phường Tuần Châu",
    ).toUpperCase();
    const population =
        typeof org.population === "number"
            ? org.population.toLocaleString("vi-VN")
            : org.population || "14.390";
    const area = org.area || "67,68 km²";
    const weather = weatherInfo ||
        org.weather || {
            emoji: "⛈️",
            temp: "30°C",
            condition: "Giông bão",
        };
    const oa = (org.officialAccounts && org.officialAccounts[0]) || null;

    const onFollow = () => {
        if (oa && oa.oaId) {
            followOfficialAccount({ id: oa.oaId }).catch(() => undefined);
        }
    };

    const sections =
        homeSections && homeSections.length
            ? [...homeSections]
                  .filter(
                      s => s.enabled !== false && String(s.enabled) !== "false",
                  )
                  .sort(
                      (a, b) => (Number(a.order) || 0) - (Number(b.order) || 0),
                  )
            : DEFAULT_SECTIONS;

    const renderSection = (s: HomeSection) => {
        switch (s.key) {
            case "hero":
                return (
                    <HeroHeader
                        key={s.id}
                        line1={s.title || "CHÍNH QUYỀN SỐ"}
                        line2={wardName}
                        dateText={formatDateTime(new Date())}
                        weatherEmoji={weather.emoji}
                        weatherTemp={weather.temp}
                        weatherCondition={weather.condition}
                        bgFrom={s.color1}
                        bgTo={s.color2}
                        imageUrl={s.imageUrl}
                    />
                );
            case "stats":
                return (
                    <StatCards
                        key={s.id}
                        population={population}
                        area={area}
                        color1={s.color1}
                        color2={s.color2}
                    />
                );
            case "statsDss":
                return <StatsSection key={s.id} />;
            case "explore":
                return (
                    <ExploreBanner
                        key={s.id}
                        title={s.title || "Du lịch địa phương"}
                        desc={
                            s.subtitle ||
                            "Trải nghiệm thiên nhiên, văn hóa và con người"
                        }
                        bgFrom={s.color1}
                        bgTo={s.color2}
                        imageUrl={s.imageUrl}
                        onClick={() => navigate(s.link || "/news")}
                    />
                );
            case "oa":
                return oa ? (
                    <OAFollowCard
                        key={s.id}
                        name={
                            org.name ||
                            org.shortName ||
                            oa.name ||
                            "UBND phường"
                        }
                        logoUrl={oa.logoUrl}
                        onFollow={onFollow}
                    />
                ) : null;
            case "citizenGrid":
                return (
                    <React.Fragment key={s.id}>
                        <SectionHeading>
                            {s.title || "Dành cho công dân"}
                        </SectionHeading>
                        <TileGrid items={CITIZEN_TILES} />
                    </React.Fragment>
                );
            case "khuphoGrid":
                return (
                    <React.Fragment key={s.id}>
                        <SectionHeading>
                            {s.title || "Quản lý khu phố"}
                        </SectionHeading>
                        <TileGrid items={KHUPHO_TILES} />
                    </React.Fragment>
                );
            case "businessGrid":
                return (
                    <React.Fragment key={s.id}>
                        <SectionHeading>
                            {s.title || "Dành cho doanh nghiệp, tổ chức"}
                        </SectionHeading>
                        <TileGrid items={BUSINESS_TILES} />
                    </React.Fragment>
                );
            case "featured": {
                // Chỉ dùng "Tin tức nội bộ" để luôn mở được trang chi tiết trong app
                // (/news/:id). Không fallback sang tin liên kết ngoài (openWebView).
                // Ưu tiên bài "Nổi bật", rồi tới bài mới nhất.
                const naList = newsArticles?.articles || [];
                const a =
                    naList.find(
                        x =>
                            x.featured === true ||
                            String(x.featured) === "true",
                    ) || naList[0];
                if (a) {
                    return (
                        <FeaturedNews
                            key={s.id}
                            label={s.subtitle || "TIN NỔI BẬT"}
                            article={a}
                            onOpen={id => navigate(`/news/${id}`)}
                        />
                    );
                }
                // Chưa có bài nội bộ → banner tĩnh dẫn tới danh sách tin.
                return (
                    <FeaturedBanner
                        key={s.id}
                        label={s.subtitle || "TIN NỔI BẬT"}
                        title={s.title || "Tin tức Chuyển Đổi Số"}
                        bgFrom={s.color1}
                        bgTo={s.color2}
                        onClick={() => navigate(s.link || "/news")}
                    />
                );
            }
            case "newsList":
                return (
                    <NewsList
                        key={s.id}
                        title={s.title || "Tin tức"}
                        items={(
                            (newsArticles && newsArticles.articles) ||
                            []
                        ).slice(0, 6)}
                        onOpen={id => navigate(`/news/${id}`)}
                        onMore={() => navigate("/news")}
                    />
                );
            case "slider":
                return (
                    <React.Fragment key={s.id}>
                        {s.title && <SectionHeading>{s.title}</SectionHeading>}
                        <Slider
                            images={(s.images || "")
                                .split(/\r?\n|,/)
                                .map(x => x.trim())
                                .filter(Boolean)}
                            onClick={() => s.link && navigate(s.link)}
                        />
                    </React.Fragment>
                );
            case "video":
                return (
                    <VideoBlock
                        key={s.id}
                        title={s.title}
                        imageUrl={s.imageUrl}
                        onPlay={() => s.videoUrl && openWebView(s.videoUrl)}
                    />
                );
            case "events":
                return (
                    <Events
                        key={s.id}
                        title={s.title || "Sự kiện"}
                        items={(events || []).slice(0, 5)}
                        onOpen={id => navigate(`/events/${id}`)}
                        onMore={() => navigate("/events")}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <PageBg id="home-page">
            {sections.map(renderSection)}
            <BottomNav active="home" />
        </PageBg>
    );
};

export default HomePage;
