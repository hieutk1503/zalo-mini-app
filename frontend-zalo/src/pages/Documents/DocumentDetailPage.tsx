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

const DocumentDetailPage: React.FC = () => {
    const { id } = useParams();

    const [detail, getDocumentDetail, loading] = useStore(state => [
        state.documentDetail,
        state.getDocumentDetail,
        state.gettingDocumentDetail,
    ]);

    useEffect(() => {
        if (id) {
            getDocumentDetail(id);
        }
    }, [id]);

    if (!loading && detail === null) {
        return (
            <PageLayout title="Chi tiết văn bản">
                <EmptyDataContainer emptyText="Không tìm thấy văn bản" />
            </PageLayout>
        );
    }

    return (
        <PageLayout title="Chi tiết văn bản" id="document-detail">
            <Box p={3}>
                <Card>
                    {detail?.documentNo && (
                        <Text size="small" tw="text-main font-medium">
                            {detail.documentNo}
                        </Text>
                    )}
                    <Text.Title size="normal" tw="text-text_1 mt-1">
                        {detail?.title}
                    </Text.Title>
                    <Box mt={3}>
                        <Field label="Trích yếu" value={detail?.summary} />
                        <Field label="Loại văn bản" value={detail?.category} />
                        <Field
                            label="Ngày ban hành"
                            value={
                                detail?.issuedDate
                                    ? formatDate(detail.issuedDate, "dd/mm/yyyy")
                                    : undefined
                            }
                        />
                        <Field
                            label="Định dạng"
                            value={[detail?.fileType, detail?.fileSize]
                                .filter(Boolean)
                                .join(" · ")}
                        />
                    </Box>
                </Card>

                {detail?.fileUrl && (
                    <Box mt={2}>
                        <Button
                            fullWidth
                            suffixIcon={<Icon icon="zi-download" />}
                            onClick={() => openWebView(detail.fileUrl as string)}
                        >
                            Xem / Tải văn bản
                        </Button>
                    </Box>
                )}
            </Box>
        </PageLayout>
    );
};

export default DocumentDetailPage;
