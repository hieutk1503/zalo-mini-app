import React, { useEffect } from "react";
import { Box, Icon, Text, useNavigate } from "zmp-ui";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import PageLayout from "@components/layout/PageLayout";
import { EmptyDataContainer } from "@components/common";
import { useStore } from "@store";
import { ROUTES } from "@constants/common";
import { openWebView } from "@service/zalo";
import { formatDate } from "@utils/date-time";

const Item = styled.div`
    ${tw`bg-white rounded-lg p-4 mb-3 border border-devider_1`}
`;

const FileBadge = styled.div`
    ${tw`bg-blue_10 text-main text-[11px] font-medium rounded px-2 py-1 mr-3 whitespace-nowrap`}
`;

const MapImage = styled.img`
    ${tw`w-full rounded-lg mb-3 border border-devider_1`}
    max-height: 220px;
    object-fit: cover;
`;

const MapButton = styled.button`
    ${tw`mt-2 inline-flex items-center bg-main text-white text-sm rounded-lg px-3 py-2`}
`;

const PlanningPage: React.FC = () => {
    const navigate = useNavigate();
    const [documents, getDocuments, loading] = useStore(state => [
        state.documents,
        state.getDocuments,
        state.gettingDocuments,
    ]);

    useEffect(() => {
        getDocuments({ type: "planning" });
    }, []);

    const data = (documents?.documents || []).filter(
        d => d.type === "planning",
    );

    return (
        <PageLayout title="Thông tin quy hoạch" id="planning-page">
            <Box p={4}>
                <Text size="small" tw="text-text_2 mb-3 block">
                    Thông tin quy hoạch sử dụng đất, quy hoạch xây dựng trên địa
                    bàn. Nhấn vào bản đồ để xem chi tiết hoặc mở bản đồ trực tuyến.
                </Text>

                {!loading && data.length === 0 ? (
                    <EmptyDataContainer emptyText="Chưa có tài liệu quy hoạch" />
                ) : (
                    data.map(item => (
                        <Item key={item.id}>
                            {item.imageUrl && (
                                <MapImage
                                    src={item.imageUrl}
                                    alt={item.title}
                                    onClick={() => openWebView(item.imageUrl as string)}
                                />
                            )}
                            <Box
                                tw="flex flex-row items-start"
                                onClick={() =>
                                    navigate(
                                        `${ROUTES.DOCUMENTS}/${item.id}`,
                                        { animate: true, direction: "forward" },
                                    )
                                }
                            >
                                <FileBadge>{item.fileType || "FILE"}</FileBadge>
                                <Box tw="flex-1">
                                    {item.documentNo && (
                                        <Text
                                            size="small"
                                            tw="text-main font-medium"
                                        >
                                            {item.documentNo}
                                        </Text>
                                    )}
                                    <Text tw="text-text_1 font-medium mt-0.5">
                                        {item.title}
                                    </Text>
                                    {item.summary && (
                                        <Text
                                            size="small"
                                            tw="text-text_2 mt-1"
                                        >
                                            {item.summary}
                                        </Text>
                                    )}
                                    {item.issuedDate && (
                                        <Text
                                            size="xSmall"
                                            tw="text-text_3 mt-1 block"
                                        >
                                            {formatDate(
                                                item.issuedDate,
                                                "dd/mm/yyyy",
                                            )}
                                        </Text>
                                    )}
                                </Box>
                                <Icon
                                    icon="zi-chevron-right"
                                    tw="text-text_3"
                                />
                            </Box>
                            {item.mapUrl && (
                                <MapButton
                                    type="button"
                                    onClick={() =>
                                        openWebView(item.mapUrl as string)
                                    }
                                >
                                    <Icon icon="zi-location" tw="mr-1" />
                                    Mở bản đồ trực tuyến
                                </MapButton>
                            )}
                        </Item>
                    ))
                )}
            </Box>
        </PageLayout>
    );
};

export default PlanningPage;
