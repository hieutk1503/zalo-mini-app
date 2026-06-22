import React, { useEffect, useMemo, useState } from "react";
import { Box, Input, Text, useNavigate } from "zmp-ui";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import debounce from "lodash.debounce";
import PageLayout from "@components/layout/PageLayout";
import { EmptyDataContainer } from "@components/common";
import { useStore } from "@store";
import { ROUTES } from "@constants/common";
import { ProjectStatus } from "@dts";

const Item = styled.div`
    ${tw`bg-white rounded-lg p-4 mb-3 border border-devider_1`}
`;

const Badge = styled.span<{ $status?: ProjectStatus }>`
    ${tw`text-[11px] rounded px-2 py-0.5`}
    ${({ $status }) => {
        switch ($status) {
            case "completed":
                return tw`bg-[#E3F6E9] text-[#1A9D52]`;
            case "ongoing":
                return tw`bg-blue_10 text-main`;
            case "suspended":
                return tw`bg-[#FDECEC] text-[#DC1F18]`;
            default:
                return tw`bg-ng_20 text-text_2`;
        }
    }}
`;

const Bar = styled.div`
    ${tw`bg-ng_20 rounded-full h-1.5 mt-2 overflow-hidden`}
`;
const BarFill = styled.div<{ $pct: number }>`
    ${tw`bg-main h-full`}
    width: ${({ $pct }) => `${$pct}%`};
`;

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
    preparing: "Chuẩn bị đầu tư",
    ongoing: "Đang thực hiện",
    completed: "Hoàn thành",
    suspended: "Tạm dừng",
};

const ProjectsPage: React.FC = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");

    const [projects, getProjects, loading] = useStore(state => [
        state.projects,
        state.getProjects,
        state.gettingProjects,
    ]);

    const fetchData = useMemo(
        () => debounce((kw: string) => getProjects(kw), 350),
        [getProjects],
    );

    useEffect(() => {
        fetchData(keyword);
        return () => fetchData.cancel();
    }, [keyword]);

    const data = projects?.projects || [];

    return (
        <PageLayout title="Dự án đầu tư" id="projects-page">
            <Box p={4} tw="bg-white">
                <Input.Search
                    placeholder="Tìm theo tên dự án, lĩnh vực"
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    clearable
                />
            </Box>
            <Box p={4}>
                {!loading && data.length === 0 ? (
                    <EmptyDataContainer emptyText="Không tìm thấy dự án phù hợp" />
                ) : (
                    data.map(item => (
                        <Item
                            key={item.id}
                            onClick={() =>
                                navigate(`${ROUTES.PROJECTS}/${item.id}`, {
                                    animate: true,
                                    direction: "forward",
                                })
                            }
                        >
                            <Box tw="flex flex-row items-start justify-between">
                                <Text tw="text-text_1 font-medium flex-1 pr-2">
                                    {item.name}
                                </Text>
                                {item.status && (
                                    <Badge $status={item.status}>
                                        {PROJECT_STATUS_LABEL[item.status]}
                                    </Badge>
                                )}
                            </Box>
                            <Text size="small" tw="text-text_2 mt-1">
                                {item.field}
                                {item.totalInvestment
                                    ? ` · ${item.totalInvestment}`
                                    : ""}
                            </Text>
                            {typeof item.progress === "number" && (
                                <>
                                    <Bar>
                                        <BarFill $pct={item.progress} />
                                    </Bar>
                                    <Text
                                        size="xSmall"
                                        tw="text-text_2 mt-1 block"
                                    >
                                        Tiến độ: {item.progress}%
                                    </Text>
                                </>
                            )}
                        </Item>
                    ))
                )}
            </Box>
        </PageLayout>
    );
};

export default ProjectsPage;
