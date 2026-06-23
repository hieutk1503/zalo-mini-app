import React from "react";
import { Box, Text } from "zmp-ui";
import "styled-components/macro";
import PageLayout from "@components/layout/PageLayout";
import { SectionCard } from "@components/common";

/**
 * Trang placeholder: Nhập liệu báo cáo DSS thuộc Web Admin/DSS (web cán bộ),
 * không đưa toàn bộ vào Mini App. Trang này đánh dấu TODO + định hướng.
 */
const ReportEntryPage: React.FC = () => (
    <PageLayout title="Nhập liệu báo cáo DSS" id="report-entry-page">
        <Box p={4}>
            <SectionCard title="Chức năng thuộc Web Admin / DSS">
                <Text size="small" tw="text-text_2">
                    Nhập liệu báo cáo theo kỳ (thủ công, import Excel, lấy từ kỳ
                    trước), lịch sử báo cáo và đính kèm tài liệu là nghiệp vụ
                    của cán bộ/chuyên viên trên Web DSS.
                </Text>
                <Text size="small" tw="text-text_2 mt-2">
                    Theo định hướng, phần này được xây trên web quản trị, không
                    đưa toàn bộ vào Mini App. Mini App chỉ hiển thị số liệu tổng
                    hợp ở mục Tổng quan.
                </Text>
                <Box
                    mt={3}
                    p={3}
                    tw="rounded-lg"
                    style={{ backgroundColor: "#FFF7E6" }}
                >
                    <Text size="xxSmall" tw="text-warning">
                        TODO: tích hợp đường dẫn mở Web DSS hoặc webview khi có
                        hệ thống thật.
                    </Text>
                </Box>
            </SectionCard>
        </Box>
    </PageLayout>
);

export default ReportEntryPage;
