import React, { useEffect } from "react";
import { useParams } from "react-router";
import { Box, Icon, Text, useNavigate } from "zmp-ui";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import PageLayout from "@components/layout/PageLayout";
import { Button } from "@components/customized";
import { EmptyDataContainer } from "@components/common";
import { useStore } from "@store";
import { openWebView } from "@service/zalo";
import { ROUTES } from "@constants/common";

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

const ProcedureDetailPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [detail, getProcedureDetail, loading] = useStore(state => [
        state.procedureDetail,
        state.getProcedureDetail,
        state.gettingProcedureDetail,
    ]);

    useEffect(() => {
        if (id) {
            getProcedureDetail(id);
        }
    }, [id]);

    if (!loading && detail === null) {
        return (
            <PageLayout title="Chi tiết thủ tục">
                <EmptyDataContainer emptyText="Không tìm thấy thủ tục" />
            </PageLayout>
        );
    }

    return (
        <PageLayout title="Chi tiết thủ tục" id="procedure-detail">
            <Box p={3}>
                <Card>
                    <Text size="small" tw="text-main font-medium">
                        Mã: {detail?.code}
                    </Text>
                    <Text.Title size="normal" tw="text-text_1 mt-1">
                        {detail?.name}
                    </Text.Title>
                    {detail?.description && (
                        <Text size="normal" tw="text-text_2 mt-2 whitespace-pre-line">
                            {detail.description}
                        </Text>
                    )}
                    <Box mt={3}>
                        <Field label="Lĩnh vực" value={detail?.category} />
                        <Field
                            label="Cơ quan thực hiện"
                            value={detail?.agency}
                        />
                        <Field label="Lệ phí" value={detail?.fee} />
                        <Field
                            label="Thời hạn giải quyết"
                            value={detail?.processingTime}
                        />
                    </Box>
                </Card>

                <Card>
                    <Field
                        label="Thành phần hồ sơ"
                        value={detail?.dossierRequirements}
                    />
                    <Field
                        label="Trình tự thực hiện"
                        value={detail?.processSteps}
                    />
                    <Field label="Căn cứ pháp lý" value={detail?.legalBasis} />
                </Card>

                {detail?.formIds && detail.formIds.length > 0 && (
                    <Card>
                        <Text tw="text-text_1 font-medium mb-2">
                            Mẫu đơn, tờ khai liên quan
                        </Text>
                        {detail.formIds.map(formId => (
                            <Box
                                key={formId}
                                tw="flex flex-row items-center justify-between py-2 border-t border-devider_1"
                                onClick={() =>
                                    navigate(`${ROUTES.DOCUMENTS}/${formId}`, {
                                        animate: true,
                                        direction: "forward",
                                    })
                                }
                            >
                                <Text tw="text-main">Xem mẫu {formId}</Text>
                                <Icon icon="zi-chevron-right" />
                            </Box>
                        ))}
                    </Card>
                )}

                {detail?.onlineSubmissionUrl && (
                    <Box mt={2}>
                        <Button
                            fullWidth
                            suffixIcon={<Icon icon="zi-arrow-right" />}
                            onClick={() =>
                                openWebView(
                                    detail.onlineSubmissionUrl as string,
                                )
                            }
                        >
                            Nộp hồ sơ trực tuyến
                        </Button>
                    </Box>
                )}
            </Box>
        </PageLayout>
    );
};

export default ProcedureDetailPage;
