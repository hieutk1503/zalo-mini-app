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
import { LEGAL_STATUS_LABEL } from "@constants/common";
import { formatDate } from "@utils/date-time";

const Card = styled(Box)`
    ${tw`bg-white rounded-lg p-4 mb-3`}
`;

const Note = styled(Box)`
    ${tw`bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3`}
`;

const StatusBadge = styled.span<{ $status?: string }>`
    ${tw`text-[11px] font-medium rounded px-2 py-1 whitespace-nowrap`}
    ${({ $status }) => {
        if ($status === "active") return tw`bg-green-50 text-green-700`;
        if ($status === "expired") return tw`bg-red-50 text-red-600`;
        return tw`bg-amber-50 text-amber-700`;
    }}
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

const LegalDocumentDetailPage: React.FC = () => {
    const { id } = useParams();

    const [detail, getLegalDocumentDetail, loading] = useStore(state => [
        state.legalDocumentDetail,
        state.getLegalDocumentDetail,
        state.gettingLegalDocumentDetail,
    ]);

    useEffect(() => {
        if (id) {
            getLegalDocumentDetail(id);
        }
    }, [id]);

    if (!loading && detail === null) {
        return (
            <PageLayout title="Chi tiết văn bản">
                <EmptyDataContainer emptyText="Không tìm thấy văn bản pháp luật" />
            </PageLayout>
        );
    }

    return (
        <PageLayout title="Chi tiết văn bản" id="legal-document-detail">
            <Box p={3}>
                <Card>
                    <Box tw="flex flex-row items-center mb-1">
                        {detail?.docType && (
                            <Text size="small" tw="text-main font-medium mr-2">
                                {detail.docType}
                            </Text>
                        )}
                        {detail?.status && (
                            <StatusBadge $status={detail.status}>
                                {LEGAL_STATUS_LABEL[detail.status]}
                            </StatusBadge>
                        )}
                    </Box>
                    {detail?.docNo && (
                        <Text size="small" tw="text-main font-medium">
                            {detail.docNo}
                        </Text>
                    )}
                    <Text.Title size="normal" tw="text-text_1 mt-1">
                        {detail?.title}
                    </Text.Title>
                    <Box mt={3}>
                        <Field label="Lĩnh vực" value={detail?.field} />
                        <Field
                            label="Cơ quan ban hành"
                            value={detail?.issuingAgency}
                        />
                        <Field
                            label="Ngày ban hành"
                            value={
                                detail?.issuedDate
                                    ? formatDate(
                                          detail.issuedDate,
                                          "dd/mm/yyyy",
                                      )
                                    : undefined
                            }
                        />
                        <Field
                            label="Ngày hiệu lực"
                            value={
                                detail?.effectiveDate
                                    ? formatDate(
                                          detail.effectiveDate,
                                          "dd/mm/yyyy",
                                      )
                                    : undefined
                            }
                        />
                        <Field label="Trích yếu" value={detail?.summary} />
                    </Box>
                </Card>

                {detail?.plainExplanation && (
                    <Card>
                        <Text.Title size="small" tw="text-text_1 mb-2">
                            Diễn giải dễ hiểu
                        </Text.Title>
                        <Text tw="text-text_1 whitespace-pre-line">
                            {detail.plainExplanation}
                        </Text>
                    </Card>
                )}

                {detail?.aiSummary && (
                    <Card>
                        <Text.Title size="small" tw="text-text_1 mb-2">
                            Tóm tắt (AI)
                        </Text.Title>
                        <Text tw="text-text_1 whitespace-pre-line">
                            {detail.aiSummary}
                        </Text>
                    </Card>
                )}

                <Note>
                    <Text size="small" tw="text-amber-800">
                        Nội dung diễn giải và tóm tắt chỉ mang tính tham khảo.
                        Vui lòng đối chiếu với văn bản gốc khi áp dụng.
                    </Text>
                </Note>

                {detail?.fileUrl && (
                    <Box mt={2}>
                        <Button
                            fullWidth
                            suffixIcon={<Icon icon="zi-download" />}
                            onClick={() =>
                                openWebView(detail.fileUrl as string)
                            }
                        >
                            Xem / Tải văn bản gốc
                        </Button>
                    </Box>
                )}
            </Box>
        </PageLayout>
    );
};

export default LegalDocumentDetailPage;
