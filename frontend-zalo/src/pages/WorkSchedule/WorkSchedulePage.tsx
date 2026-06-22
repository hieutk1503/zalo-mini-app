import React, { useEffect, useMemo } from "react";
import { Box, Text } from "zmp-ui";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import PageLayout from "@components/layout/PageLayout";
import { EmptyDataContainer } from "@components/common";
import { useStore } from "@store";
import { WorkScheduleEvent } from "@dts";
import { formatDate } from "@utils/date-time";

const DateHeader = styled.div`
    ${tw`text-main text-sm font-semibold px-4 pt-4 pb-2`}
`;

const EventCard = styled.div`
    ${tw`bg-white mx-3 mb-3 rounded-lg p-4 border-l-4 border-main`}
`;

const TimeText = styled.div`
    ${tw`text-main text-sm font-medium`}
`;

const TypeBadge = styled.span`
    ${tw`bg-blue_10 text-main text-[11px] rounded px-2 py-0.5`}
`;

const TYPE_LABEL: Record<string, string> = {
    leadership: "Lãnh đạo",
    meeting: "Họp",
    citizen_reception: "Tiếp công dân",
    other: "Khác",
};

const WorkSchedulePage: React.FC = () => {
    const [events, getWorkScheduleEvents, loading] = useStore(state => [
        state.workScheduleEvents,
        state.getWorkScheduleEvents,
        state.gettingWorkScheduleEvents,
    ]);

    useEffect(() => {
        if (!events) {
            getWorkScheduleEvents();
        }
    }, []);

    const grouped = useMemo(() => {
        const map: Record<string, WorkScheduleEvent[]> = {};
        [...(events || [])]
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .forEach(e => {
                const key = formatDate(e.date, "dd/mm/yyyy");
                if (!map[key]) {
                    map[key] = [];
                }
                map[key].push(e);
            });
        return map;
    }, [events]);

    if (!loading && (!events || events.length === 0)) {
        return (
            <PageLayout title="Lịch công tác">
                <EmptyDataContainer />
            </PageLayout>
        );
    }

    return (
        <PageLayout title="Lịch công tác" id="work-schedule-page">
            {Object.keys(grouped).map(date => (
                <Box key={date}>
                    <DateHeader>Ngày {date}</DateHeader>
                    {grouped[date].map(ev => (
                        <EventCard key={ev.id}>
                            <Box tw="flex flex-row items-center justify-between">
                                <TimeText>
                                    {[ev.startTime, ev.endTime]
                                        .filter(Boolean)
                                        .join(" - ")}
                                </TimeText>
                                {ev.type && (
                                    <TypeBadge>
                                        {TYPE_LABEL[ev.type] || "Khác"}
                                    </TypeBadge>
                                )}
                            </Box>
                            <Text tw="text-text_1 font-medium mt-1">
                                {ev.title}
                            </Text>
                            {ev.location && (
                                <Text size="small" tw="text-text_2 mt-1">
                                    Địa điểm: {ev.location}
                                </Text>
                            )}
                            {ev.host && (
                                <Text size="small" tw="text-text_2 mt-0.5">
                                    Chủ trì: {ev.host}
                                </Text>
                            )}
                            {ev.participants && (
                                <Text size="small" tw="text-text_2 mt-0.5">
                                    Thành phần: {ev.participants}
                                </Text>
                            )}
                        </EventCard>
                    ))}
                </Box>
            ))}
        </PageLayout>
    );
};

export default WorkSchedulePage;
