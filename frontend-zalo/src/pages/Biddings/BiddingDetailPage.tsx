import React, { useEffect } from "react";
import { useParams } from "react-router";
import { Box, Icon, Text } from "zmp-ui";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import PageLayout from "@components/layout/PageLayout";
import { Button } from "@components/customized";
import { EmptyDataContainer } from "@components/common";
import { useStore } from "@store";
import { openWebView } from "@service/zalo";
import { formatDate } from "@utils/date-time";
import { BIDDING_STATUS_LABEL } from "./BiddingsPage";

const Card = styled(Box)`
    ${tw`bg-white rounded-lg p-4 mb-3`}
`;

const Field: React.FC<{ label: string; value?: string }> = ({
    label,
    value,
}) => {
    if (!value) {
        return null;
    }
    return (
        <Box mb={3}>
            <Text size="small" tw="text-text_2 mb-1">
                {label}
            </Text>
            <Text tw="text-text_1 whitespace-pre-line">{value}</Text>
        </Box>
    );
};

const BiddingDetailPage: React.FC = () => {
    const { id } = useParams();
    const [detail, getBiddingDetail, loading] = useStore(state => [
        state.biddingDetail,
        state.getBiddingDetail,
        state.gettingBiddingDetail,
    ]);

    useEffect(() => {
        if (id) {
            getBiddingDetail(id);
        }
    }, [id]);

    if (!loading && detail === null) {
        return (
            <PageLayout title="Chi tiết gói thầu">
                <EmptyDataContainer emptyText="Không tìm thấy gói thầu" />
            </PageLayout>
        );
    }

    return (
        <PageLayout title="Chi tiết gói thầu" id="bidding-detail">
            <Box p={3}>
                <Card>
                    {detail?.code && (
                        <Text size="small" tw="text-main font-medium">
                            {detail.code}
                        </Text>
                    )}
                    <Text.Title size="normal" tw="text-text_1 mt-1">
                        {detail?.name}
                    </Text.Title>
                </Card>
                <Card>
                    <Field
                        label="Trạng thái"
                        value={
                            detail?.status
                                ? BIDDING_STATUS_LABEL[detail.status]
                                : undefined
                        }
                    />
                    <Field label="Bên mời thầu" value={detail?.investor} />
                    <Field label="Lĩnh vực" value={detail?.field} />
                    <Field label="Giá gói thầu" value={detail?.budget} />
                    <Field
                        label="Hình thức lựa chọn nhà thầu"
                        value={detail?.method}
                    />
                    <Field
                        label="Ngày đăng tải"
                        value={
                            detail?.publishDate
                                ? formatDate(detail.publishDate, "dd/mm/yyyy")
                                : undefined
                        }
                    />
                    <Field
                        label="Thời điểm đóng thầu"
                        value={
                            detail?.closeDate
                                ? formatDate(detail.closeDate, "dd/mm/yyyy")
                                : undefined
                        }
                    />
                    <Field
                        label="Nhà thầu trúng thầu"
                        value={detail?.winner || undefined}
                    />
                </Card>
                {detail?.description && (
                    <Card>
                        <Field label="Mô tả" value={detail.description} />
                    </Card>
                )}
                {detail?.link && (
                    <Box mt={2}>
                        <Button
                            fullWidth
                            suffixIcon={<Icon icon="zi-arrow-right" />}
                            onClick={() => openWebView(detail.link as string)}
                        >
                            Xem trên Hệ thống mua sắm công
                        </Button>
                    </Box>
                )}
            </Box>
        </PageLayout>
    );
};

export default BiddingDetailPage;
