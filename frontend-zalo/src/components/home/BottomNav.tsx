import React, { FC } from "react";
import styled from "styled-components";
import { useNavigate } from "zmp-ui";

const Bar = styled.div`
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 5;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    background: #fff;
    border-top: 1px solid #eceff3;
    padding-bottom: var(--zaui-safe-area-inset-bottom, 0px);
`;
const Item = styled.div<{ $active?: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 8px 0 10px;
    cursor: pointer;
    color: ${p => (p.$active ? "var(--main, #c8102e)" : "#8a9099")};
`;
const Ico = styled.div`
    font-size: 20px;
    line-height: 1;
`;
const Lbl = styled.div`
    font-size: 11.5px;
    font-weight: 600;
`;

export type BottomTab = "home" | "chat" | "contact" | "account";

const ITEMS: { key: BottomTab; label: string; emoji: string; path: string }[] =
    [
        { key: "home", label: "Trang chủ", emoji: "🏠", path: "/" },
        { key: "chat", label: "Chat OA", emoji: "💬", path: "/chatbot" },
        { key: "contact", label: "Liên hệ", emoji: "📞", path: "/hotlines" },
        { key: "account", label: "Cá nhân", emoji: "👤", path: "/account" },
    ];

const BottomNav: FC<{ active: BottomTab }> = ({ active }) => {
    const navigate = useNavigate();
    return (
        <Bar>
            {ITEMS.map(it => (
                <Item
                    key={it.key}
                    $active={active === it.key}
                    onClick={() => {
                        if (active !== it.key) navigate(it.path);
                    }}
                >
                    <Ico>{it.emoji}</Ico>
                    <Lbl>{it.label}</Lbl>
                </Item>
            ))}
        </Bar>
    );
};

export default BottomNav;
