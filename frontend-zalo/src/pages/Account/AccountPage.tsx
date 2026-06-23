import React, { FC } from "react";
import styled from "styled-components";
import { Page, useNavigate } from "zmp-ui";
import { useStore } from "@store";
import { BottomNav } from "@components/home";

const PageBg = styled(Page)`
    background: #f4f6f9;
    padding-bottom: calc(64px + var(--zaui-safe-area-inset-bottom, 0px));
`;

const Header = styled.div`
    background: linear-gradient(135deg, #c8102e 0%, #7a0c16 100%);
    color: #fff;
    padding: calc(var(--zaui-safe-area-inset-top, 0px) + 14px) 16px 56px 16px;
    text-align: center;
`;
const HeaderTitle = styled.div`
    font-size: 18px;
    font-weight: 700;
`;
const ProfileRow = styled.div`
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 0 16px;
    margin-top: 18px;
`;
const Avatar = styled.div`
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: #cfe0f5;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
`;
const NameText = styled.div`
    font-size: 18px;
    font-weight: 700;
    color: #fff;
`;

const Card = styled.div`
    margin: -36px 16px 16px 16px;
    background: #fff;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
`;
const Row = styled.div<{ $disabled?: boolean }>`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 14px;
    border-bottom: 1px solid #f0f2f5;
    cursor: ${p => (p.$disabled ? "default" : "pointer")};
    opacity: ${p => (p.$disabled ? 0.5 : 1)};
    &:last-child {
        border-bottom: none;
    }
`;
const RowIcon = styled.div<{ $bg: string }>`
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: ${p => p.$bg};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
`;
const RowLabel = styled.div`
    flex: 1;
    font-size: 15px;
    color: #141415;
`;
const Chevron = styled.div`
    color: #b9bdc1;
    font-size: 20px;
`;

interface AccountRow {
    key: string;
    label: string;
    emoji: string;
    bg: string;
    path?: string;
    inDevelopment?: boolean;
}
const ROWS: AccountRow[] = [
    {
        key: "feedbacks",
        label: "Phản ánh - Kiến nghị đã gửi",
        emoji: "📝",
        bg: "#E8F0FE",
        path: "/feedbacks",
    },
    {
        key: "my-appointments",
        label: "Lịch hẹn của tôi",
        emoji: "🗒️",
        bg: "#E6F7EC",
        path: "/my-appointments",
    },
    {
        key: "service-hub",
        label: "Tiện ích & liên kết dịch vụ",
        emoji: "🧩",
        bg: "#E6F7EC",
        path: "/service-hub",
    },
    {
        key: "dashboard",
        label: "Tổng quan khu phố",
        emoji: "📈",
        bg: "#FFF4E0",
        path: "/dashboard",
    },
    {
        key: "about",
        label: "Giới thiệu ứng dụng",
        emoji: "⭐",
        bg: "#FDE8E8",
        inDevelopment: true,
    },
];

const AccountPage: FC = () => {
    const navigate = useNavigate();
    const user = useStore(s => s.user);
    const name = user?.name || "Người dùng";
    const avatar = user?.avatar || "";

    return (
        <PageBg id="account-page">
            <Header>
                <HeaderTitle>Cá nhân</HeaderTitle>
                <ProfileRow>
                    {avatar ? (
                        <Avatar style={{ overflow: "hidden" }}>
                            <img src={avatar} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </Avatar>
                    ) : (
                        <Avatar>👤</Avatar>
                    )}
                    <NameText>{name}</NameText>
                </ProfileRow>
            </Header>
            <Card>
                {ROWS.map(r => (
                    <Row
                        key={r.key}
                        $disabled={!!r.inDevelopment}
                        onClick={() => {
                            if (r.inDevelopment || !r.path) return;
                            navigate(r.path);
                        }}
                    >
                        <RowIcon $bg={r.bg}>{r.emoji}</RowIcon>
                        <RowLabel>{r.label}</RowLabel>
                        <Chevron>›</Chevron>
                    </Row>
                ))}
            </Card>
            <BottomNav active="account" />
        </PageBg>
    );
};

export default AccountPage;
