import React, { useEffect, useRef, useState } from "react";
import { Box, Icon, Input, Text, useNavigate } from "zmp-ui";
import { openPhone } from "zmp-sdk";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import PageLayout from "@components/layout/PageLayout";
import { useStore } from "@store";
import { openWebView } from "@service/zalo";
import { ChatMessage, ChatSuggestion } from "@dts";

const MessagesWrapper = styled.div`
    ${tw`px-3 pt-3`}
    padding-bottom: 88px;
`;

const Bubble = styled.div<{ $isUser: boolean }>`
    ${tw`px-3 py-2 rounded-2xl max-w-[80%] whitespace-pre-line text-[15px] leading-5`}
    ${({ $isUser }) =>
        $isUser
            ? tw`bg-main text-white rounded-br-sm`
            : tw`bg-white text-text_1 rounded-bl-sm border border-devider_1`}
`;

const Row = styled.div<{ $isUser: boolean }>`
    ${tw`flex mb-2`}
    ${({ $isUser }) => ($isUser ? tw`justify-end` : tw`justify-start`)}
`;

const SuggestRow = styled.div`
    ${tw`flex flex-row flex-wrap gap-2 mb-3`}
`;

const SuggestChip = styled.button`
    ${tw`px-3 py-1.5 rounded-full text-sm bg-blue_10 text-main border border-main`}
`;

const SuggestLabel = styled.div`
    ${tw`text-xs text-text_3 mb-1 mt-0.5`}
`;

const InputBar = styled.div`
    ${tw`fixed left-0 right-0 bg-white border-t border-devider_1 px-3 py-2 flex flex-row items-center`}
    bottom: 0;
    padding-bottom: calc(8px + var(--zaui-safe-area-inset-bottom, 0px));
    z-index: 2;
`;

const SendButton = styled.button<{ $disabled: boolean }>`
    ${tw`ml-2 rounded-full text-white flex items-center justify-center`}
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    ${({ $disabled }) => ($disabled ? tw`bg-text_3` : tw`bg-main`)}
`;

const ChatbotPage: React.FC = () => {
    const navigate = useNavigate();
    const [input, setInput] = useState("");
    const endRef = useRef<HTMLDivElement>(null);

    const [messages, chatLoading, initChat, sendChat] = useStore(state => [
        state.chatMessages,
        state.chatLoading,
        state.initChat,
        state.sendChat,
    ]);

    useEffect(() => {
        initChat();
    }, []);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, chatLoading]);

    const handleSend = (text?: string) => {
        const value = (text ?? input).trim();
        if (!value || chatLoading) {
            return;
        }
        sendChat(value);
        setInput("");
    };

    const handleSuggestion = (s: ChatSuggestion) => {
        if (s.path) {
            navigate(s.path, { animate: true, direction: "forward" });
        } else if (s.link) {
            openWebView(s.link);
        } else if (s.phoneNumber) {
            openPhone({
                phoneNumber: s.phoneNumber.replace(/\s/g, ""),
                fail: err => console.error(err),
            });
        } else {
            handleSend(s.label);
        }
    };

    const list: ChatMessage[] = messages || [];

    return (
        <PageLayout title="Trợ lý dịch vụ công" id="chatbot-page" bg="#EAEBED">
            <MessagesWrapper>
                {list.map(msg => {
                    const isUser = msg.role === "user";
                    return (
                        <Box key={msg.id}>
                            <Row $isUser={isUser}>
                                <Bubble $isUser={isUser}>{msg.content}</Bubble>
                            </Row>
                            {!isUser &&
                                msg.suggestions &&
                                msg.suggestions.length > 0 && (
                                    <>
                                    {msg.id !== "greeting" && (
                                        <SuggestLabel>Tham khảo thêm</SuggestLabel>
                                    )}
                                    <SuggestRow>
                                        {msg.suggestions.map(s => (
                                            <SuggestChip
                                                key={s.label}
                                                type="button"
                                                onClick={() =>
                                                    handleSuggestion(s)
                                                }
                                            >
                                                {s.label}
                                            </SuggestChip>
                                        ))}
                                    </SuggestRow>
                                    </>
                                )}
                        </Box>
                    );
                })}
                {chatLoading && (
                    <Row $isUser={false}>
                        <Bubble $isUser={false}>
                            <Text tw="text-text_2">Đang soạn trả lời…</Text>
                        </Bubble>
                    </Row>
                )}
                <div ref={endRef} />
            </MessagesWrapper>

            <InputBar>
                <Box tw="flex-1">
                    <Input
                        placeholder="Nhập câu hỏi của bạn…"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={(e: React.KeyboardEvent) => {
                            if (e.key === "Enter") {
                                handleSend();
                            }
                        }}
                    />
                </Box>
                <SendButton
                    type="button"
                    $disabled={!input.trim() || !!chatLoading}
                    onClick={() => handleSend()}
                >
                    <Icon icon="zi-chevron-right" />
                </SendButton>
            </InputBar>
        </PageLayout>
    );
};

export default ChatbotPage;
