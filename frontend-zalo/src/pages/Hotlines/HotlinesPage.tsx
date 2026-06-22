import React, { useEffect, useMemo } from "react";
import { Box, Icon, Text } from "zmp-ui";
import { openPhone } from "zmp-sdk";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import PageLayout from "@components/layout/PageLayout";
import { EmptyDataContainer } from "@components/common";
import { useStore } from "@store";
import { Hotline } from "@dts";

const GroupTitle = styled.div`
    ${tw`text-text_2 text-sm font-medium px-4 pt-4 pb-2 uppercase`}
`;

const Item = styled.div`
    ${tw`bg-white flex flex-row items-center justify-between px-4 py-3 border-b border-devider_1`}
`;

const CallButton = styled.div`
    ${tw`flex flex-row items-center text-main font-medium`}
`;

const HotlinesPage: React.FC = () => {
    const [hotlines, getHotlines, loading] = useStore(state => [
        state.hotlines,
        state.getHotlines,
        state.gettingHotlines,
    ]);

    useEffect(() => {
        if (!hotlines) {
            getHotlines();
        }
    }, []);

    const grouped = useMemo(() => {
        const map: Record<string, Hotline[]> = {};
        (hotlines || []).forEach(h => {
            if (!map[h.group]) {
                map[h.group] = [];
            }
            map[h.group].push(h);
        });
        Object.values(map).forEach(list =>
            list.sort((a, b) => (a.order || 0) - (b.order || 0)),
        );
        return map;
    }, [hotlines]);

    const handleCall = (phoneNumber: string) => {
        openPhone({
            phoneNumber: phoneNumber.replace(/\s/g, ""),
            fail: err => console.error(err),
        });
    };

    if (!loading && (!hotlines || hotlines.length === 0)) {
        return (
            <PageLayout title="Đường dây nóng">
                <EmptyDataContainer />
            </PageLayout>
        );
    }

    return (
        <PageLayout title="Đường dây nóng" id="hotlines-page">
            {Object.keys(grouped).map(group => (
                <Box key={group}>
                    <GroupTitle>{group}</GroupTitle>
                    {grouped[group].map(item => (
                        <Item
                            key={item.id}
                            onClick={() => handleCall(item.phoneNumber)}
                        >
                            <Box tw="flex-1 pr-3">
                                <Text tw="text-text_1 font-medium">
                                    {item.title}
                                </Text>
                                {(item.personName || item.role) && (
                                    <Text size="small" tw="text-text_2 mt-0.5">
                                        {[item.personName, item.role]
                                            .filter(Boolean)
                                            .join(" · ")}
                                    </Text>
                                )}
                                <Text size="small" tw="text-text_2 mt-0.5">
                                    {item.phoneNumber}
                                </Text>
                            </Box>
                            <CallButton>
                                <Icon icon="zi-call" />
                                <span style={{ marginLeft: 4 }}>Gọi</span>
                            </CallButton>
                        </Item>
                    ))}
                </Box>
            ))}
        </PageLayout>
    );
};

export default HotlinesPage;
