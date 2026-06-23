import {
    Divider,
    FieldName,
    NumberDisplay,
    RowDisplay,
    ValueText,
} from "@components";
import React, { forwardRef } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { Box, Text } from "zmp-ui";
import "styled-components/macro";
import { formatDate } from "@utils/date-time";
import { ScheduleAppointment } from "@dts";

const Container = styled.div`
    ${tw`bg-main p-2`}
`;
const ContentWrapper = styled(Box)`
    ${tw`bg-white rounded-lg border border-ng_20`}
`;

const StyledText = styled(Text)`
    ${tw`text-text_2 font-medium`}
`;

export interface OrdinalNumberCardProps {
    schedule: ScheduleAppointment;
}
const OrdinalNumberCard = forwardRef<HTMLDivElement, OrdinalNumberCardProps>(
    ({ schedule }, ref) => {
        const {
            number,
            currentNumber,
            fullName,
            phoneNumber,
            citizenId,
            appointmentTime,
            code,
            content,
            date,
        } = schedule;

        const formatedDate = formatDate(date, "dd-mm-yyyy");

        return (
            <Container ref={ref}>
                <ContentWrapper px={4} py={8}>
                    {code && (
                        <Box mb={4}>
                            <RowDisplay>
                                <FieldName $nowrap="true">
                                    Mã phiếu hẹn:
                                </FieldName>
                                <ValueText $rowdisplay="true">{code}</ValueText>
                            </RowDisplay>
                        </Box>
                    )}
                    <Box flex flexDirection="row" alignItems="center">
                        <NumberDisplay number={number || 0} />
                        <Box ml={6}>
                            <StyledText>Số thứ tự của bạn</StyledText>
                        </Box>
                    </Box>
                    <Box my={5}>
                        <Divider />
                    </Box>
                    <Box flex flexDirection="row" alignItems="center">
                        <NumberDisplay number={currentNumber || 0} />
                        <Box ml={6}>
                            <StyledText>Số thứ tự hiện tại</StyledText>
                        </Box>
                    </Box>
                    <Box mt={5}>
                        <Divider />
                    </Box>
                    <Box mt={4}>
                        <RowDisplay>
                            <FieldName $nowrap="true">Họ và Tên:</FieldName>
                            <ValueText $rowdisplay="true">{fullName}</ValueText>
                        </RowDisplay>
                    </Box>
                    <Box mt={4}>
                        <Divider />
                    </Box>
                    <Box mt={4}>
                        <RowDisplay>
                            <FieldName $nowrap="true">Số điện thoại:</FieldName>
                            <ValueText $rowdisplay="true">
                                {phoneNumber}
                            </ValueText>
                        </RowDisplay>
                    </Box>
                    {citizenId && (
                        <>
                            <Box mt={4}>
                                <Divider />
                            </Box>
                            <Box mt={4}>
                                <RowDisplay>
                                    <FieldName $nowrap="true">
                                        Số CCCD:
                                    </FieldName>
                                    <ValueText $rowdisplay="true">
                                        {citizenId}
                                    </ValueText>
                                </RowDisplay>
                            </Box>
                        </>
                    )}
                    <Box mt={4}>
                        <Divider />
                    </Box>
                    <Box mt={4}>
                        <FieldName $nowrap="true">Nội dung làm việc:</FieldName>
                        <ValueText>{content}</ValueText>
                    </Box>
                    <Box mt={4}>
                        <Divider />
                    </Box>
                    <Box mt={4}>
                        <RowDisplay>
                            <FieldName $nowrap="true">Thời gian hẹn:</FieldName>
                            <ValueText $rowdisplay="true">
                                {appointmentTime
                                    ? `${appointmentTime} - ${formatedDate}`
                                    : formatedDate}
                            </ValueText>
                        </RowDisplay>
                    </Box>
                </ContentWrapper>
            </Container>
        );
    },
);

export default OrdinalNumberCard;
