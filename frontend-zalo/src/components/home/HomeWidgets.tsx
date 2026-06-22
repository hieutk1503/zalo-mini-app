import React, { FC } from "react";
import styled from "styled-components";
import { useNavigate } from "zmp-ui";
import Logo from "@assets/quoc-huy.png";
import HeaderBg from "@assets/header-background.png";
import { HomeTile } from "@constants/home-tiles";
import { openWebView } from "@service/zalo";

/* ============================ Hero header ============================ */
const Hero = styled.div`
    position: relative;
    color: #fff;
    padding: calc(var(--zaui-safe-area-inset-top, 0px) + 14px) 16px 20px 16px;
    border-radius: 0 0 20px 20px;
    background-image: linear-gradient(
            135deg,
            rgba(200, 16, 46, 0.95),
            rgba(122, 12, 22, 0.97)
        ),
        url(${HeaderBg});
    background-size: cover;
    background-position: center;
`;
const HeroRow = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
`;
const HeroBrand = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;
const HeroLogo = styled.img`
    width: 46px;
    height: 46px;
    object-fit: contain;
`;
const HeroTitle = styled.div`
    font-size: 17px;
    font-weight: 800;
    line-height: 1.15;
    text-transform: uppercase;
    letter-spacing: 0.2px;
`;
const HeroWeather = styled.div`
    text-align: right;
    font-size: 12px;
    opacity: 0.95;
    min-width: 92px;
`;
const HeroTemp = styled.div`
    font-size: 18px;
    font-weight: 700;
    line-height: 1.1;
`;

export interface HeroHeaderProps {
    line1: string;
    line2: string;
    dateText: string;
    weatherEmoji?: string;
    weatherTemp?: string;
    weatherCondition?: string;
    bgFrom?: string;
    bgTo?: string;
    imageUrl?: string;
}
export const HeroHeader: FC<HeroHeaderProps> = ({
    line1,
    line2,
    dateText,
    weatherEmoji = "⛅",
    weatherTemp,
    weatherCondition,
    bgFrom,
    bgTo,
    imageUrl,
}) => (
    <Hero
        style={
            bgFrom && bgTo
                ? {
                      backgroundImage: `linear-gradient(135deg, ${bgFrom}, ${bgTo})${
                          imageUrl ? `, url(${imageUrl})` : ""
                      }`,
                  }
                : undefined
        }
    >
        <HeroRow>
            <HeroBrand>
                <HeroLogo src={Logo} alt="logo" />
                <HeroTitle>
                    {line1}
                    <br />
                    {line2}
                </HeroTitle>
            </HeroBrand>
            <HeroWeather>
                <div>{dateText}</div>
                {(weatherTemp || weatherCondition) && (
                    <>
                        <HeroTemp>
                            {weatherEmoji} {weatherTemp}
                        </HeroTemp>
                        <div>{weatherCondition}</div>
                    </>
                )}
            </HeroWeather>
        </HeroRow>
    </Hero>
);

/* ============================ Stat cards ============================ */
const StatRow = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    padding: 14px 16px 4px 16px;
`;
const StatCard = styled.div<{ $bg: string }>`
    background: ${p => p.$bg};
    color: #fff;
    border-radius: 14px;
    padding: 14px 16px;
`;
const StatLabel = styled.div`
    font-size: 13px;
    opacity: 0.9;
`;
const StatValue = styled.div`
    font-size: 26px;
    font-weight: 800;
    margin: 2px 0;
    line-height: 1.1;
`;

export interface StatCardsProps {
    population: string;
    area: string;
    color1?: string;
    color2?: string;
}
export const StatCards: FC<StatCardsProps> = ({
    population,
    area,
    color1 = "#2563EB",
    color2 = "#16A34A",
}) => (
    <StatRow>
        <StatCard $bg={color1}>
            <StatLabel>Người dân</StatLabel>
            <StatValue>{population}</StatValue>
            <StatLabel>Dân số</StatLabel>
        </StatCard>
        <StatCard $bg={color2}>
            <StatLabel>Diện tích</StatLabel>
            <StatValue>{area}</StatValue>
            <StatLabel>Diện tích</StatLabel>
        </StatCard>
    </StatRow>
);

/* ============================ Explore banner ============================ */
const Explore = styled.div`
    margin: 12px 16px;
    border-radius: 16px;
    padding: 22px 18px;
    color: #fff;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    background: linear-gradient(120deg, #c8102e 0%, #a4161a 60%, #7a0c16 100%);
`;
const ExplorePill = styled.span`
    display: inline-block;
    background: rgba(255, 255, 255, 0.22);
    border-radius: 8px;
    padding: 4px 10px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.5px;
`;
const ExploreTitle = styled.div`
    font-size: 22px;
    font-weight: 800;
    margin: 10px 0 6px;
`;
const ExploreDesc = styled.div`
    font-size: 13px;
    opacity: 0.92;
    max-width: 80%;
`;
const RoundArrow = styled.div`
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
`;

export interface ExploreBannerProps {
    title: string;
    desc: string;
    onClick?: () => void;
    bgFrom?: string;
    bgTo?: string;
    imageUrl?: string;
}
export const ExploreBanner: FC<ExploreBannerProps> = ({
    title,
    desc,
    onClick,
    bgFrom,
    bgTo,
    imageUrl,
}) => (
    <Explore
        onClick={onClick}
        style={
            bgFrom && bgTo
                ? {
                      backgroundImage: `linear-gradient(120deg, ${bgFrom}, ${bgTo})${
                          imageUrl ? `, url(${imageUrl})` : ""
                      }`,
                      backgroundSize: "cover",
                  }
                : undefined
        }
    >
        <ExplorePill>KHÁM PHÁ</ExplorePill>
        <ExploreTitle>{title}</ExploreTitle>
        <ExploreDesc>{desc}</ExploreDesc>
        <RoundArrow>›</RoundArrow>
    </Explore>
);

/* ============================ OA follow card ============================ */
const OACard = styled.div`
    margin: 4px 16px 12px 16px;
    background: #fff;
    border-radius: 14px;
    padding: 12px 14px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
`;
const OALogo = styled.img`
    width: 44px;
    height: 44px;
    border-radius: 50%;
    object-fit: cover;
    background: #f0f4f8;
`;
const OAName = styled.div`
    font-size: 15px;
    font-weight: 700;
    color: #141415;
`;
const OASub = styled.div`
    font-size: 12.5px;
    color: #767a7f;
`;
const FollowBtn = styled.button`
    background: var(--main, #c8102e);
    color: #fff;
    border: 0;
    border-radius: 999px;
    padding: 9px 16px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
`;

export interface OAFollowCardProps {
    name: string;
    logoUrl?: string;
    onFollow?: () => void;
}
export const OAFollowCard: FC<OAFollowCardProps> = ({ name, logoUrl, onFollow }) => (
    <OACard>
        <OALogo src={logoUrl || Logo} alt="oa" />
        <div style={{ flex: 1, minWidth: 0 }}>
            <OAName>
                {name} <span style={{ color: "var(--main, #c8102e)" }}>✔</span>
            </OAName>
            <OASub>Cổng thông tin chính thức</OASub>
        </div>
        <FollowBtn onClick={onFollow}>Quan tâm</FollowBtn>
    </OACard>
);

/* ============================ Section heading ============================ */
const Heading = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 14px 16px 6px 16px;
    font-size: 16px;
    font-weight: 800;
    color: #141415;
    text-transform: uppercase;
    &::before {
        content: "";
        width: 4px;
        height: 18px;
        background: var(--main, #c8102e);
        border-radius: 2px;
    }
`;
export const SectionHeading: FC<{ children: React.ReactNode }> = ({ children }) => (
    <Heading>{children}</Heading>
);

/* ============================ Tile grid ============================ */
const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px 4px;
    padding: 4px 12px 8px 12px;
`;
const Tile = styled.div<{ $disabled?: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 6px 2px;
    cursor: ${p => (p.$disabled ? "default" : "pointer")};
    opacity: ${p => (p.$disabled ? 0.45 : 1)};
`;
const TileIcon = styled.div<{ $bg: string }>`
    width: 56px;
    height: 56px;
    border-radius: 16px;
    background: ${p => p.$bg};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
`;
const TileLabel = styled.div`
    font-size: 11.5px;
    line-height: 1.25;
    text-align: center;
    color: #141415;
`;
const PASTELS = ["#FCEFEF", "#FFF7E6", "#FCEFEF", "#FFF7E6"];

export const TileGrid: FC<{ items: HomeTile[] }> = ({ items }) => {
    const navigate = useNavigate();
    return (
        <Grid>
            {items.map((it, idx) => (
                <Tile
                    key={it.key}
                    $disabled={!!it.inDevelopment}
                    onClick={() => {
                        if (it.inDevelopment) return;
                        if (it.link) {
                            openWebView(it.link);
                            return;
                        }
                        if (!it.path) return;
                        navigate(it.path);
                    }}
                >
                    <TileIcon $bg={PASTELS[idx % PASTELS.length]}>{it.emoji}</TileIcon>
                    <TileLabel>{it.label}</TileLabel>
                </Tile>
            ))}
        </Grid>
    );
};

/* ============================ Featured news banner ============================ */
const Featured = styled.div`
    margin: 12px 16px 16px 16px;
    border-radius: 16px;
    padding: 18px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    background: linear-gradient(120deg, #7a0c16 0%, #a4161a 55%, #c8102e 100%);
`;
const FeaturedSmall = styled.div`
    font-size: 11px;
    letter-spacing: 1px;
    opacity: 0.8;
`;
const FeaturedTitle = styled.div`
    font-size: 17px;
    font-weight: 800;
    margin-top: 4px;
`;

export interface FeaturedBannerProps {
    label: string;
    title: string;
    onClick?: () => void;
    bgFrom?: string;
    bgTo?: string;
}
export const FeaturedBanner: FC<FeaturedBannerProps> = ({
    label,
    title,
    onClick,
    bgFrom,
    bgTo,
}) => (
    <Featured
        onClick={onClick}
        style={
            bgFrom && bgTo
                ? {
                      backgroundImage: `linear-gradient(120deg, ${bgFrom}, ${bgTo})`,
                  }
                : undefined
        }
    >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
                style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                }}
            >
                ✨
            </div>
            <div>
                <FeaturedSmall>{label}</FeaturedSmall>
                <FeaturedTitle>{title}</FeaturedTitle>
            </div>
        </div>
        <RoundArrow style={{ position: "static", transform: "none" }}>→</RoundArrow>
    </Featured>
);

/* ===================== Featured news (bài nổi bật thật) ===================== */
const FNWrap = styled.div`
    margin: 12px 16px 16px 16px;
    border-radius: 16px;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    background: #7a0c16;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
`;
const FNImg = styled.img`
    width: 100%;
    height: 190px;
    object-fit: cover;
    display: block;
`;
const FNFallback = styled.div`
    width: 100%;
    height: 190px;
    background: linear-gradient(120deg, #7a0c16, #c8102e);
`;
const FNOverlay = styled.div`
    position: absolute;
    inset: 0;
    background: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0) 35%,
        rgba(0, 0, 0, 0.78) 100%
    );
`;
const FNChip = styled.div`
    position: absolute;
    top: 12px;
    left: 12px;
    background: var(--main, #046dd6);
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.5px;
    padding: 4px 10px;
    border-radius: 999px;
`;
const FNHeadline = styled.div`
    position: absolute;
    left: 14px;
    right: 14px;
    bottom: 12px;
    color: #fff;
    font-size: 16px;
    font-weight: 800;
    line-height: 1.3;
    text-shadow: 0 1px 6px rgba(0, 0, 0, 0.6);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
`;
export interface FeaturedNewsItem {
    id: string;
    title: string;
    thumbnailUrl?: string;
    category?: string;
}
export interface FeaturedNewsProps {
    label?: string;
    article?: FeaturedNewsItem | null;
    onOpen?: (id: string) => void;
}
export const FeaturedNews: FC<FeaturedNewsProps> = ({
    label = "TIN NỔI BẬT",
    article,
    onOpen,
}) => {
    if (!article) return null;
    return (
        <FNWrap onClick={() => onOpen?.(article.id)}>
            {article.thumbnailUrl ? (
                <FNImg src={article.thumbnailUrl} alt={article.title} />
            ) : (
                <FNFallback />
            )}
            <FNOverlay />
            <FNChip>{label}</FNChip>
            <FNHeadline>{article.title}</FNHeadline>
        </FNWrap>
    );
};

/* ============================ News list ============================ */
const NewsBox = styled.div`
    margin: 4px 16px 12px 16px;
`;
const NewsHeadRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
`;
const NewsHeadTitle = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 800;
    color: #141415;
    text-transform: uppercase;
    &::before {
        content: "";
        width: 4px;
        height: 18px;
        background: var(--main, #c8102e);
        border-radius: 2px;
    }
`;
const NewsMore = styled.span`
    color: var(--main, #c8102e);
    font-size: 13px;
    cursor: pointer;
`;
const NewsRow = styled.div`
    display: flex;
    gap: 10px;
    background: #fff;
    border-radius: 12px;
    padding: 8px;
    margin-bottom: 8px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
    cursor: pointer;
`;
const NewsThumb = styled.img`
    width: 86px;
    height: 64px;
    border-radius: 8px;
    object-fit: cover;
    background: #eef1f5;
    flex-shrink: 0;
`;
const NewsTitle = styled.div`
    font-size: 13.5px;
    font-weight: 600;
    color: #141415;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
`;
const NewsMeta = styled.div`
    font-size: 11.5px;
    color: #767a7f;
    margin-top: 4px;
`;

export interface NewsListItem {
    id: string;
    title: string;
    thumbnailUrl?: string;
    publishedAt?: string;
    category?: string;
    source?: string;
}
export interface NewsListProps {
    title?: string;
    items: NewsListItem[];
    onOpen: (id: string) => void;
    onMore?: () => void;
}
export const NewsList: FC<NewsListProps> = ({
    title = "Tin tức",
    items,
    onOpen,
    onMore,
}) => (
    <NewsBox>
        <NewsHeadRow>
            <NewsHeadTitle>{title}</NewsHeadTitle>
            {onMore && <NewsMore onClick={onMore}>Xem tất cả ›</NewsMore>}
        </NewsHeadRow>
        {(items || []).map(it => (
            <NewsRow key={it.id} onClick={() => onOpen(it.id)}>
                {it.thumbnailUrl ? (
                    <NewsThumb src={it.thumbnailUrl} alt={it.title} />
                ) : (
                    <NewsThumb as="div" />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <NewsTitle>{it.title}</NewsTitle>
                    <NewsMeta>
                        {it.publishedAt
                            ? it.publishedAt.split("-").reverse().join("/")
                            : ""}
                        {it.source ? ` · ${it.source}` : ""}
                        {it.category ? ` · ${it.category}` : ""}
                    </NewsMeta>
                </div>
            </NewsRow>
        ))}
    </NewsBox>
);

/* ============================ Slider ảnh ============================ */
const SliderRow = styled.div`
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding: 4px 16px 12px 16px;
    scroll-snap-type: x mandatory;
`;
const SlideImg = styled.img`
    width: 280px;
    height: 150px;
    border-radius: 14px;
    object-fit: cover;
    flex-shrink: 0;
    scroll-snap-align: start;
    background: #eef1f5;
`;
export interface SliderProps {
    images: string[];
    onClick?: () => void;
}
export const Slider: FC<SliderProps> = ({ images, onClick }) => (
    <SliderRow>
        {(images || [])
            .filter(Boolean)
            .map((src, i) => (
                <SlideImg
                    // eslint-disable-next-line react/no-array-index-key
                    key={i}
                    src={src}
                    alt={`slide-${i}`}
                    onClick={onClick}
                />
            ))}
    </SliderRow>
);

/* ============================ Video ============================ */
const VideoCard = styled.div`
    margin: 4px 16px 12px 16px;
    border-radius: 14px;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    background: #000;
`;
const VideoPoster = styled.img`
    width: 100%;
    height: 184px;
    object-fit: cover;
    opacity: 0.85;
    display: block;
`;
const PlayBtn = styled.div`
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 46px;
    color: #fff;
`;
const VideoTitle = styled.div`
    position: absolute;
    left: 12px;
    bottom: 10px;
    color: #fff;
    font-weight: 700;
    font-size: 15px;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
`;
export interface VideoBlockProps {
    title?: string;
    imageUrl?: string;
    onPlay?: () => void;
}
export const VideoBlock: FC<VideoBlockProps> = ({ title, imageUrl, onPlay }) => (
    <VideoCard onClick={onPlay}>
        {imageUrl ? (
            <VideoPoster src={imageUrl} alt={title || "video"} />
        ) : (
            <div
                style={{
                    height: 184,
                    background: "linear-gradient(120deg, #334155, #0f172a)",
                }}
            />
        )}
        <PlayBtn>▶</PlayBtn>
        {title && <VideoTitle>{title}</VideoTitle>}
    </VideoCard>
);

/* ============================ Sự kiện ============================ */
const EvBox = styled.div`
    margin: 4px 0 12px 0;
    padding: 0 16px;
`;
const EvHead = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 4px 0 10px 0;
`;
const EvRow = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    background: #fff;
    border-radius: 12px;
    padding: 10px;
    margin-bottom: 8px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
    cursor: pointer;
`;
const EvDate = styled.div`
    flex-shrink: 0;
    width: 52px;
    height: 56px;
    border-radius: 10px;
    background: var(--main, #046dd6);
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;
const EvDay = styled.div`
    font-size: 20px;
    font-weight: 800;
    line-height: 1;
`;
const EvMon = styled.div`
    font-size: 11px;
    margin-top: 2px;
`;
const EvName = styled.div`
    font-size: 13.5px;
    font-weight: 600;
    color: #141415;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
`;
const EvMeta = styled.div`
    font-size: 11.5px;
    color: #767a7f;
    margin-top: 4px;
`;
export interface EventListItem {
    id: string;
    title: string;
    location?: string;
    startTime?: string;
}
export interface EventsProps {
    title?: string;
    items: EventListItem[];
    onOpen?: (id: string) => void;
    onMore?: () => void;
}
const evParts = (iso?: string) => {
    const d = iso ? new Date(iso) : null;
    if (!d || Number.isNaN(d.getTime())) return { day: "--", mon: "", time: "" };
    const p2 = (n: number) => String(n).padStart(2, "0");
    return {
        day: p2(d.getDate()),
        mon: `Th${d.getMonth() + 1}`,
        time: `${p2(d.getHours())}:${p2(d.getMinutes())}`,
    };
};
export const Events: FC<EventsProps> = ({ title, items, onOpen, onMore }) => {
    if (!items || !items.length) return null;
    return (
        <EvBox>
            {(title || onMore) && (
                <EvHead>
                    {title ? <NewsHeadTitle>{title}</NewsHeadTitle> : <span />}
                    {onMore && (
                        <NewsMore onClick={onMore}>Xem tất cả ›</NewsMore>
                    )}
                </EvHead>
            )}
            {items.map(it => {
                const p = evParts(it.startTime);
                return (
                    <EvRow key={it.id} onClick={() => onOpen?.(it.id)}>
                        <EvDate>
                            <EvDay>{p.day}</EvDay>
                            <EvMon>{p.mon}</EvMon>
                        </EvDate>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <EvName>{it.title}</EvName>
                            <EvMeta>
                                {p.time}
                                {it.location
                                    ? `${p.time ? " · " : ""}${it.location}`
                                    : ""}
                            </EvMeta>
                        </div>
                    </EvRow>
                );
            })}
        </EvBox>
    );
};
