import React, { useEffect } from "react";
import { Box, Text, Button, useNavigate } from "zmp-ui";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import PageLayout from "@components/layout/PageLayout";
import { EmptyDataContainer } from "@components/common";
import { useStore } from "@store";

const Card = styled.div`
    ${tw`bg-white rounded-lg p-4 border border-devider_1 mb-3`}
`;
const Row = styled.div`
    ${tw`flex flex-row justify-between items-start mt-2`}
`;
const Badge = styled.span<{ $bg: string; $c: string }>`
    ${tw`text-xs font-medium rounded-full px-2 py-1 whitespace-nowrap`}
    background: ${p => p.$bg};
    color: ${p => p.$c};
`;

const STATUS_META: Record<string, { label: string; bg: string; c: string }> = {
    pending: { label: "Chờ duyệt", bg: "#FFF7E6", c: "#F59E0B" },
    approved: { label: "Đã duyệt", bg: "#EAF8EF", c: "#16A34A" },
    rejected: { label: "Từ chối", bg: "#FEECEC", c: "#DC2626" },
    completed: { label: "Hoàn thành", bg: "#EAF8EF", c: "#16A34A" },
    cancelled: { label: "Đã hủy", bg: "#E9EBED", c: "#767A7F" },
};

const fmtDate = (d?: Date) => {
    if (!d) return "—";
    try {
        return new Date(d).toLocaleDateString("vi-VN");
    } catch (e) {
        return "—";
    }
};

const MyAppointmentsPage: React.FC = () => {
    const navigate = useNavigate();
    const schedules = useStore(state => state.schedules);
    const getSchedules = useStore(state => state.getSchedules);
    const loading = useStore(state => state.gettingSchedules);

    useEffect(() => {
        getSchedules();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const list = schedules || [];

    return (
        <PageLayout title="Lịch hẹn của tôi" id="my-appointments-page">
            <Box p={4}>
                {!loading && list.length === 0 && (
                    <>
                        <EmptyDataContainer emptyText="Bạn chưa có lịch hẹn nào" />
                        <Button
                            fullWidth
                            onClick={() =>
                                navigate("/create-schedule-appointment")
                            }
                        >
                            Đặt lịch ngay
                        </Button>
                    </>
                )}

                {list.map((s, idx) => {
                    const meta = STATUS_META[String(s.status)] || {
                        label: String(s.status || ""),
                        bg: "#EEF1F5",
                        c: "#767A7F",
                    };
                    return (
                        <Card key={s.code || `lh-${idx}`}>
                            <Box tw="flex flex-row justify-between items-center">
                                <Text tw="text-text_1 font-medium">
                                    {s.code || "Phiếu hẹn"}
                                </Text>
                                <Badge $bg={meta.bg} $c={meta.c}>
                                    {meta.label}
                                </Badge>
                            </Box>

                            <Row>
                                <Text size="small" tw="text-text_2">
                                    Họ tên
                                </Text>
                                <Text size="small" tw="text-text_1">
                                    {s.fullName}
                                </Text>
                            </Row>
                            <Row>
                                <Text size="small" tw="text-text_2">
                                    Thời gian hẹn
                                </Text>
                                <Text size="small" tw="text-text_1">
                                    {s.appointmentTime || fmtDate(s.date)}
                                </Text>
                            </Row>
                            <Row>
                                <Text size="small" tw="text-text_2">
                                    Nội dung
                                </Text>
                                <Text
                                    size="small"
                                    tw="text-text_1"
                                    style={{
                                        textAlign: "right",
                                        maxWidth: "60%",
                                    }}
                                >
                                    {s.content}
                                </Text>
                            </Row>
                            {typeof s.number !== "undefined" && (
                                <Row>
                                    <Text size="small" tw="text-text_2">
                                        Số thứ tự
                                    </Text>
                                    <Text
                                        size="small"
                                        tw="text-main font-medium"
                                    >
                                        {s.number}
                                    </Text>
                                </Row>
                            )}
                            {String(s.status) === "rejected" &&
                                s.rejectedInfo && (
                                    <Box tw="mt-2">
                                        <Text
                                            size="small"
                                            style={{ color: "#DC2626" }}
                                        >
                                            Lý do từ chối: {s.rejectedInfo}
                                        </Text>
                                    </Box>
                                )}
                        </Card>
                    );
                })}

                {list.length > 0 && (
                    <Box tw="mt-1">
                        <Button
                            fullWidth
                            variant="secondary"
                            onClick={() =>
                                navigate("/create-schedule-appointment")
                            }
                        >
                            Đặt lịch mới
                        </Button>
                    </Box>
                )}
            </Box>
        </PageLayout>
    );
};

export default MyAppointmentsPage;
