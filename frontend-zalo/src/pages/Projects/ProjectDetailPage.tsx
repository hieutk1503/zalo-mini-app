import React, { useEffect } from "react";
import { useParams } from "react-router";
import { Box, Text } from "zmp-ui";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import PageLayout from "@components/layout/PageLayout";
import { EmptyDataContainer } from "@components/common";
import { useStore } from "@store";
import { formatDate } from "@utils/date-time";
import { PROJECT_STATUS_LABEL } from "./ProjectsPage";

const Card = styled(Box)`
    ${tw`bg-white rounded-lg p-4 mb-3`}
`;

const Bar = styled.div`
    ${tw`bg-ng_20 rounded-full h-2 mt-2 overflow-hidden`}
`;
const BarFill = styled.div<{ $pct: number }>`
    ${tw`bg-main h-full`}
    width: ${({ $pct }) => `${$pct}%`};
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

const ProjectDetailPage: React.FC = () => {
    const { id } = useParams();
    const [detail, getProjectDetail, loading] = useStore(state => [
        state.projectDetail,
        state.getProjectDetail,
        state.gettingProjectDetail,
    ]);

    useEffect(() => {
        if (id) {
            getProjectDetail(id);
        }
    }, [id]);

    if (!loading && detail === null) {
        return (
            <PageLayout title="Chi tiết dự án">
                <EmptyDataContainer emptyText="Không tìm thấy dự án" />
            </PageLayout>
        );
    }

    const period =
        detail?.startDate || detail?.endDate
            ? `${
                  detail?.startDate
                      ? formatDate(detail.startDate, "dd/mm/yyyy")
                      : "—"
              } → ${
                  detail?.endDate ? formatDate(detail.endDate, "dd/mm/yyyy") : "—"
              }`
            : undefined;

    return (
        <PageLayout title="Chi tiết dự án" id="project-detail">
            <Box p={3}>
                <Card>
                    <Text.Title size="normal" tw="text-text_1">
                        {detail?.name}
                    </Text.Title>
                    {typeof detail?.progress === "number" && (
                        <Box mt={3}>
                            <Text size="small" tw="text-text_2">
                                Tiến độ:{" "}
                                {detail.status
                                    ? PROJECT_STATUS_LABEL[detail.status]
                                    : ""}{" "}
                                ({detail.progress}%)
                            </Text>
                            <Bar>
                                <BarFill $pct={detail.progress} />
                            </Bar>
                        </Box>
                    )}
                </Card>
                <Card>
                    <Field label="Lĩnh vực" value={detail?.field} />
                    <Field label="Chủ đầu tư" value={detail?.investor} />
                    <Field
                        label="Tổng mức đầu tư"
                        value={detail?.totalInvestment}
                    />
                    <Field label="Địa điểm" value={detail?.location} />
                    <Field label="Thời gian thực hiện" value={period} />
                </Card>
                {detail?.description && (
                    <Card>
                        <Field label="Mô tả" value={detail.description} />
                    </Card>
                )}
            </Box>
        </PageLayout>
    );
};

export default ProjectDetailPage;
