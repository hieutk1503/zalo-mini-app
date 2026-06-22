import React, { useState } from "react";
import { Box, Icon, Text, useSnackbar } from "zmp-ui";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import tw from "twin.macro";
import styled from "styled-components";
import "styled-components/macro";
import { Button, DatePicker, Input, TextArea } from "@components";
import { useStore } from "@store";
import { useForm } from "react-hook-form";
import { isValidPhoneNumber, isValidCitizenId } from "@utils/string";
import { APPOINTMENT_TIME_SLOTS } from "@constants/common";

const TimeSlot = styled.button<{ $active: boolean }>`
    ${tw`px-3 py-2 rounded-lg text-sm border text-center`}
    ${({ $active }) =>
        $active
            ? tw`bg-main text-white border-main`
            : tw`bg-white text-text_1 border-ng_20`}
`;

const SlotGrid = styled.div`
    ${tw`grid grid-cols-4 gap-2`}
`;

export const CreateScheduleForm = () => {
    const { openSnackbar } = useSnackbar();
    const [creatingSchedule, createSchedule] = useStore(state => [
        state.creatingSchedule,
        state.createSchedule,
    ]);

    const [dateValue, setDateValue] = useState<Date>(new Date());
    const [timeSlot, setTimeSlot] = useState<string>("");
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ mode: "onChange" });

    const onSubmit = data => {
        const { fullName, phoneNumber, content, citizenId } = data;
        if (!timeSlot) {
            openSnackbar({
                type: "warning",
                text: "Vui lòng chọn khung giờ hẹn",
            });
            return;
        }
        createSchedule({
            fullName,
            phoneNumber,
            content,
            citizenId,
            appointmentTime: timeSlot,
            date: dateValue,
        });
    };

    const getFieldName = (field: string) => {
        switch (field) {
            case "fullName":
                return "Họ và tên";
            case "phoneNumber":
                return "Số điện thoại";
            case "citizenId":
                return "Số CCCD";
            case "content":
                return "Nội dung";
            default:
                return "";
        }
    };

    const getErrorMessage = (field: string) => {
        if (errors[field]) {
            const name = getFieldName(field);
            if (errors[field]?.type === "required")
                return `${name} không được để trống`;
            return `${name} không hợp lệ`;
        }
        return "";
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box tw="bg-white">
                <Box p={4}>
                    <Text tw="text-text_2 text-center">
                        Vui lòng chọn ngày, khung giờ làm việc mong muốn và điền
                        đầy đủ thông tin cá nhân
                    </Text>
                </Box>

                <Box px={3}>
                    <DatePicker
                        inline
                        minDate={new Date()}
                        onChange={date => {
                            if (date) {
                                setDateValue(date);
                            }
                        }}
                        selected={dateValue}
                        onMonthChange={date => {
                            if (date) {
                                date.setHours(0, 0, 0, 0);
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                if (date < today) {
                                    setDateValue(today);
                                } else {
                                    setDateValue(date);
                                }
                            }
                        }}
                    />
                </Box>
            </Box>

            <Box p={4} mt={4} tw="bg-white">
                <Text tw="text-[15px] text-text_1 font-medium mb-3">
                    Chọn khung giờ*
                </Text>
                <SlotGrid>
                    {APPOINTMENT_TIME_SLOTS.map(slot => (
                        <TimeSlot
                            key={slot}
                            type="button"
                            $active={timeSlot === slot}
                            onClick={() => setTimeSlot(slot)}
                        >
                            {slot}
                        </TimeSlot>
                    ))}
                </SlotGrid>
            </Box>

            <Box p={4} mt={4} tw="bg-white">
                <Box>
                    <Input
                        label="Họ và Tên*"
                        errorText={getErrorMessage("fullName")}
                        placeholder="Nhập Họ và Tên"
                        status={errors?.fullName ? "error" : "default"}
                        {...register("fullName", { required: true })}
                    />
                </Box>
                <Box mt={4}>
                    <Input
                        label="Số điện thoại*"
                        errorText={getErrorMessage("phoneNumber")}
                        placeholder="Nhập số điện thoại"
                        status={errors?.phoneNumber ? "error" : "default"}
                        {...register("phoneNumber", {
                            required: true,
                            validate: value => isValidPhoneNumber(value),
                        })}
                    />
                </Box>
                <Box mt={4}>
                    <Input
                        label="Số CCCD*"
                        errorText={getErrorMessage("citizenId")}
                        placeholder="Nhập số CCCD (12 số)"
                        status={errors?.citizenId ? "error" : "default"}
                        {...register("citizenId", {
                            required: true,
                            validate: value => isValidCitizenId(value),
                        })}
                    />
                </Box>
                <Box mt={4}>
                    <TextArea
                        label="Nội dung làm việc*"
                        errorText={getErrorMessage("content")}
                        status={errors?.content ? "error" : "default"}
                        placeholder="Nhập nội dung làm việc"
                        {...register("content", { required: true })}
                    />
                </Box>
            </Box>
            <Box p={4} mt={4} tw="bg-white">
                <Button
                    htmlType="submit"
                    fullWidth
                    suffixIcon={<Icon icon="zi-chevron-right" />}
                    loading={creatingSchedule}
                >
                    Nhận số thứ tự
                </Button>
            </Box>
        </form>
    );
};
