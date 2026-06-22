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
import { BiddingStatus } from "@dts";
import { formatDate } from "@utils/date-time";

const Item = styled.div`
    ${tw`bg-white rounded-lg p-4 mb-3 border border-devider_1`}
`;

const Badge = styled.span<{ $status?: BiddingStatus }>`
    ${tw`text-[11px] rounded px-2 py-0.5 whitespace-nowrap`}
    ${({ $status }) => {
        switch ($status) {
            case "awarded":
                return tw`bg-[#E3F6E9] text-[#1A9D52]`;
            case "open":
                return tw`bg-blue_10 text-main`;
            case "evaluating":
                return tw`bg-[#FFF4E0] text-[#B8770A]`;
            default:
                return tw`bg-ng_20 text-text_2`;
        }
    }}
`;

export const BIDDING_STATUS_LABEL: Record<BiddingStatus, string> = {
    open: "Đang mở thầu",
    evaluating: "Đang xét thầu",
    awarded: "Đã có kết quả",
    cancelled: "Đã huỷ",
};

const BiddingsPage: React.FC = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");

    const [biddings, getBiddings, loading] = useStore(state => [
        state.biddings,
        state.getBiddings,
        state.gettingBiddings,
    ]);

    const fetchData = useMemo(
        () => debounce((kw: string) => getBiddings(kw), 350),
        [getBiddings],
    );

    useEffect(() => {
        fetchData(keyword);
        return () => fetchData.cancel();
    }, [keyword]);

    const data = biddings?.biddings || [];

    return (
        <PageLayout title="Thông tin đấu thầu" id="biddings-page">
            <Box p={4} tw="bg-white">
                <Input.Search
                    placeholder="Tìm theo tên gói thầu, số TBMT"
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    clearable
                />
            </Box>
            <Box p={4}>
                {!loading && data.length === 0 ? (
                    <EmptyDataContainer emptyText="Không tìm thấy gói thầu phù hợp" />
                ) : (
                    data.map(item => (
                        <Item
                            key={item.id}
                            onClick={() =>
                                navigate(`${ROUTES.BIDDINGS}/${item.id}`, {
                                    animate: true,
                                    direction: "forward",
                                })
                            }
                        >
                            <Box tw="flex flex-row items-start justify-between">
                                {item.code && (
                                    <Text
                                        size="small"
                                        tw="text-main font-medium"
                                    >
                                        {item.code}
                                    </Text>
                                )}
                                {item.status && (
                                    <Badge $status={item.status}>
                                        {BIDDING_STATUS_LABEL[item.status]}
                                    </Badge>
                                )}
                            </Box>
                            <Text tw="text-text_1 font-medium mt-1">
                                {item.name}
                            </Text>
                            <Text size="small" tw="text-text_2 mt-1">
                                {item.budget ? `Giá gói: ${item.budget}` : ""}
                                {item.closeDate
                                    ? ` · Đóng thầu: ${formatDate(
                                          item.closeDate,
                                          "dd/mm/yyyy",
                                      )}`
                                    : ""}
                            </Text>
                        </Item>
                    ))
                )}
            </Box>
        </PageLayout>
    );
};

export default BiddingsPage;
