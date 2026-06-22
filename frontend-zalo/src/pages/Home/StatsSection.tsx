import React, { useEffect } from "react";
import { Text } from "zmp-ui";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import { useStore } from "@store";

const Wrapper = styled.div`
    ${tw`bg-ui_bg px-4 pt-2 pb-1`}
`;

const Grid = styled.div`
    ${tw`grid grid-cols-2 gap-3`}
`;

const StatCard = styled.div`
    ${tw`bg-icon_bg rounded-xl p-3`}
`;

const Value = styled(Text)`
    ${tw`text-main font-medium text-[20px]`}
`;

const StatsSection: React.FC = () => {
    const [homeStats, getHomeStats] = useStore(state => [
        state.homeStats,
        state.getHomeStats,
    ]);

    useEffect(() => {
        getHomeStats();
    }, []);

    if (!homeStats) {
        return null;
    }

    const cards: { label: string; value: string }[] = [];
    const push = (label: string, value?: number | null, suffix = "") => {
        if (value !== undefined && value !== null) {
            cards.push({ label, value: `${value}${suffix}` });
        }
    };

    push("Thủ tục hành chính", homeStats.procedureCount);
    push("Văn bản pháp luật", homeStats.legalDocumentCount);
    push("Lượt đặt lịch", homeStats.appointmentCount);
    push("Phản ánh tiếp nhận", homeStats.feedbackCount);
    push("Tỉ lệ xử lý phản ánh", homeStats.reflectionResolvedRate, "%");
    push("Mức hài lòng", homeStats.satisfactionScore, "%");
    push("Dân số", homeStats.population);
    push("DVC trực tuyến", homeStats.onlineServiceRate, "%");

    if (cards.length === 0) {
        return null;
    }

    return (
        <Wrapper>
            <Text.Title size="small" tw="text-text_1 mb-2">
                Tổng quan phục vụ
            </Text.Title>
            <Grid>
                {cards.slice(0, 6).map(c => (
                    <StatCard key={c.label}>
                        <Value>{c.value}</Value>
                        <Text size="xSmall" tw="text-text_2 mt-1 block">
                            {c.label}
                        </Text>
                    </StatCard>
                ))}
            </Grid>
        </Wrapper>
    );
};

export default StatsSection;
