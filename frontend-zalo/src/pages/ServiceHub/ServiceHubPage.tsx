import React, { useEffect, useMemo } from "react";
import { Box, Icon, Text, useSnackbar } from "zmp-ui";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import PageLayout from "@components/layout/PageLayout";
import { DataList, SectionCard } from "@components/common";
import { useStore } from "@store";
import { openWebView } from "@service/zalo";
import { ServiceLink } from "@dts";

const Row = styled.div`
    ${tw`flex flex-row items-center py-3 border-b border-divider_01`}
    &:last-child {
        border-bottom: none;
    }
`;

const IconWrap = styled.div`
    ${tw`bg-primary_50 rounded-lg flex items-center justify-center mr-3 flex-shrink-0`}
    width: 40px;
    height: 40px;
`;

const ServiceHubPage: React.FC = () => {
    const { openSnackbar } = useSnackbar();

    const [serviceLinks, getServiceLinks, loading] = useStore(state => [
        state.serviceLinks,
        state.getServiceLinks,
        state.gettingServiceLinks,
    ]);

    useEffect(() => {
        getServiceLinks();
    }, []);

    const groups = useMemo(() => {
        const list = serviceLinks || [];
        const order: string[] = [];
        const map: Record<string, ServiceLink[]> = {};
        list.forEach(l => {
            if (!map[l.group]) {
                map[l.group] = [];
                order.push(l.group);
            }
            map[l.group].push(l);
        });
        return order.map(g => ({ group: g, links: map[g] }));
    }, [serviceLinks]);

    const openWeb = async (url: string) => {
        try {
            await openWebView(url);
        } catch (err) {
            openSnackbar({
                type: "error",
                text: "Không mở được liên kết, vui lòng thử lại",
            });
        }
    };

    const onOpen = async (link: ServiceLink) => {
        // Ưu tiên mở app qua deep link nếu đã cài; nếu không mở được thì
        // fallback sang web (Zalo webview) sau một khoảng chờ ngắn.
        if (link.appScheme) {
            let handled = false;
            const fallbackToWeb = () => {
                if (handled) return;
                handled = true;
                openWeb(link.webUrl);
            };
            // Nếu app mở được, trang sẽ ẩn đi -> không fallback nữa.
            const onHide = () => {
                if (document.hidden) {
                    handled = true;
                }
            };
            document.addEventListener("visibilitychange", onHide, {
                once: true,
            });
            try {
                const iframe = document.createElement("iframe");
                iframe.style.display = "none";
                iframe.src = link.appScheme;
                document.body.appendChild(iframe);
                window.setTimeout(() => {
                    try {
                        document.body.removeChild(iframe);
                    } catch (e) {
                        // iframe đã bị gỡ
                    }
                    document.removeEventListener("visibilitychange", onHide);
                    fallbackToWeb();
                }, 1200);
            } catch (err) {
                document.removeEventListener("visibilitychange", onHide);
                fallbackToWeb();
            }
            return;
        }
        openWeb(link.webUrl);
    };

    return (
        <PageLayout title="Tiện ích - Liên kết" id="service-hub-page">
            <Box p={4}>
                {/* Loading/empty xử lý qua DataList trên một danh sách phẳng */}
                {(!serviceLinks || serviceLinks.length === 0) && (
                    <DataList<ServiceLink>
                        items={serviceLinks}
                        loading={loading}
                        onRetry={getServiceLinks}
                        keyExtractor={l => l.id}
                        emptyTitle="Chưa có liên kết"
                        renderItem={() => null}
                    />
                )}

                {groups.map((g, gi) => (
                    <Box key={g.group} mt={gi === 0 ? 0 : 3}>
                        <SectionCard title={g.group}>
                            {g.links.map(link => (
                                <Row key={link.id} onClick={() => onOpen(link)}>
                                    <IconWrap>
                                        <Icon
                                            icon="zi-link"
                                            size={22}
                                            tw="text-main"
                                        />
                                    </IconWrap>
                                    <Box tw="flex-1 pr-2">
                                        <Text
                                            size="small"
                                            tw="text-text_1 font-medium"
                                        >
                                            {link.title}
                                        </Text>
                                        {link.description && (
                                            <Text
                                                size="xxSmall"
                                                tw="text-text_2 mt-0.5"
                                            >
                                                {link.description}
                                            </Text>
                                        )}
                                    </Box>
                                    <Icon
                                        icon="zi-chevron-right"
                                        size={20}
                                        tw="text-text_3"
                                    />
                                </Row>
                            ))}
                        </SectionCard>
                    </Box>
                ))}

                <Text size="xxSmall" tw="text-text_3 mt-3 text-center">
                    Ưu tiên mở ứng dụng nếu đã cài; nếu chưa, mở bằng trình
                    duyệt trong Zalo.
                </Text>
            </Box>
        </PageLayout>
    );
};

export default ServiceHubPage;
