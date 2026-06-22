import React from "react";
import { Box, Text } from "zmp-ui";
import "styled-components/macro";
import PageLayout from "@components/layout/PageLayout";
import { SectionCard } from "@components/common";

/**
 * Trang placeholder: Phòng họp số (quản lý nhân sự họp, tài liệu, biểu quyết,
 * phân quyền tài liệu) thuộc Web Admin/DSS. Đánh dấu TODO + định hướng.
 */
const MeetingRoomPage: React.FC = () => (
    <PageLayout title="Phòng họp số" id="meeting-room-page">
        <Box p={4}>
            <SectionCard title="Chức năng thuộc Web Admin / DSS">
                <Text size="small" tw="text-text_2">
                    Phòng họp số gồm quản lý nhân sự họp, cuộc họp Đảng ủy/UBND/
                    MTTQ, tài liệu họp (thư mục, PDF), gán đại biểu, phân quyền
                    tài liệu, biểu quyết và kết quả biểu quyết.
                </Text>
                <Text size="small" tw="text-text_2 mt-2">
                    Đây là nghiệp vụ điều hành trên Web DSS. Trên Mini App, cư
                    dân/tổ trưởng dùng module Cuộc họp khu phố (tạo họp, xác nhận
                    tham gia, xem kết luận).
                </Text>
                <Box
                    mt={3}
                    p={3}
                    tw="rounded-lg"
                    style={{ backgroundColor: "#FFF7E6" }}
                >
                    <Text size="xxSmall" tw="text-warning">
                        TODO: liên kết sang Web DSS phòng họp số khi có hệ thống
                        thật.
                    </Text>
                </Box>
            </SectionCard>
        </Box>
    </PageLayout>
);

export default MeetingRoomPage;
