import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Text,
    useNavigate,
    useParams,
    useSnackbar,
} from "zmp-ui";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import PageLayout from "@components/layout/PageLayout";
import { EmptyState, MetaBadge, SectionCard } from "@components/common";
import { useStore } from "@store";
import { CONTEST_STATUS_META } from "@constants/engagement";
import { ContestAnswer } from "@dts";

const LoadingBlock = styled.div`
    ${tw`bg-ng_10 rounded-lg`}
    height: 240px;
`;

const OptionBtn = styled.button<{ $active: boolean }>`
    ${tw`w-full text-left px-3 py-2 rounded-lg border mb-2 text-sm`}
    ${({ $active }) =>
        $active
            ? tw`border-main bg-primary_50 text-main`
            : tw`border-ng_20 bg-white text-text_1`}
`;

const ScoreCircle = styled.div`
    ${tw`bg-primary_50 text-main rounded-full flex flex-col items-center justify-center mx-auto`}
    width: 110px;
    height: 110px;
`;

const RankRow = styled.div`
    ${tw`flex flex-row items-center justify-between py-2 border-b border-divider_01`}
    &:last-child {
        border-bottom: none;
    }
`;

const ContestDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { openSnackbar } = useSnackbar();

    const [
        contest,
        loading,
        getDetail,
        submit,
        getRanking,
        result,
        ranking,
        submitting,
    ] = useStore(state => [
        state.contestDetail,
        state.gettingContestDetail,
        state.getContestDetail,
        state.submitContest,
        state.getContestRanking,
        state.contestResult,
        state.contestRanking,
        state.submittingContest,
    ]);

    const [answers, setAnswers] = useState<Record<string, string[]>>({});

    useEffect(() => {
        if (id) {
            setAnswers({});
            getDetail(id);
            getRanking(id);
        }
    }, [id]);

    const toggleOption = (qId: string, optId: string, multiple?: boolean) =>
        setAnswers(a => {
            if (!multiple) {
                return { ...a, [qId]: [optId] };
            }
            const arr = a[qId] || [];
            return {
                ...a,
                [qId]: arr.includes(optId)
                    ? arr.filter(x => x !== optId)
                    : [...arr, optId],
            };
        });

    const onSubmit = async () => {
        if (!contest || !id) return;
        const unanswered = contest.questions.find(
            q => !(answers[q.id] && answers[q.id].length > 0),
        );
        if (unanswered) {
            openSnackbar({
                type: "warning",
                text: "Vui lòng trả lời tất cả câu hỏi",
            });
            return;
        }
        const payload: ContestAnswer[] = contest.questions.map(q => ({
            questionId: q.id,
            optionIds: answers[q.id] || [],
        }));
        const res = await submit(id, payload);
        if (res) {
            getRanking(id);
            openSnackbar({ type: "success", text: "Đã nộp bài" });
        } else {
            openSnackbar({ type: "error", text: "Nộp bài thất bại" });
        }
    };

    if (loading) {
        return (
            <PageLayout title="Cuộc thi" id="contest-loading">
                <Box p={4}>
                    <LoadingBlock />
                </Box>
            </PageLayout>
        );
    }

    if (!contest) {
        return (
            <PageLayout title="Cuộc thi" id="contest-empty">
                <EmptyState
                    title="Không tìm thấy cuộc thi"
                    actionLabel="Quay lại"
                    onAction={() => navigate(-1)}
                />
            </PageLayout>
        );
    }

    const canDoExam = contest.status === "active" && !result;

    return (
        <PageLayout title="Cuộc thi" id="contest-detail-page">
            <Box p={4} tw="bg-ui_bg mb-2">
                <Box tw="flex flex-row items-start justify-between">
                    <Text.Title size="small" tw="text-text_1 flex-1 pr-2">
                        {contest.title}
                    </Text.Title>
                    <MetaBadge meta={CONTEST_STATUS_META[contest.status]} />
                </Box>
                {contest.description && (
                    <Text size="small" tw="text-text_2 mt-1">
                        {contest.description}
                    </Text>
                )}
                <Text size="xxSmall" tw="text-text_3 mt-2">
                    {contest.questions.length} câu
                    {contest.durationMinutes
                        ? ` · ${contest.durationMinutes} phút`
                        : ""}
                </Text>
            </Box>

            <Box px={4} style={{ paddingBottom: canDoExam ? 110 : 24 }}>
                {/* Kết quả sau khi nộp */}
                {result && (
                    <SectionCard title="Kết quả bài thi">
                        <ScoreCircle>
                            <Text tw="font-semibold" style={{ fontSize: 26 }}>
                                {result.score}
                            </Text>
                            <Text size="xxSmall" tw="text-text_2">
                                /{result.maxScore} điểm
                            </Text>
                        </ScoreCircle>
                        <Box tw="flex flex-row justify-around mt-3 text-center">
                            <Box>
                                <Text tw="text-text_1 font-semibold">
                                    {result.correctCount}/{result.totalQuestions}
                                </Text>
                                <Text size="xxSmall" tw="text-text_2">
                                    Câu đúng
                                </Text>
                            </Box>
                            <Box>
                                <Text tw="text-text_1 font-semibold">
                                    #{result.rank ?? "—"}
                                </Text>
                                <Text size="xxSmall" tw="text-text_2">
                                    Xếp hạng
                                </Text>
                            </Box>
                        </Box>
                    </SectionCard>
                )}

                {/* Thông báo trạng thái khi không làm bài được */}
                {!canDoExam && !result && (
                    <SectionCard>
                        <Text size="small" tw="text-text_2 text-center">
                            {(() => {
                                if (contest.status === "closed")
                                    return "Cuộc thi đã đóng.";
                                if (contest.status === "upcoming")
                                    return "Cuộc thi sắp diễn ra.";
                                return "Bạn đã tham gia cuộc thi này.";
                            })()}
                        </Text>
                    </SectionCard>
                )}

                {/* Bảng xếp hạng */}
                {!!ranking?.length && (
                    <Box mt={3}>
                        <SectionCard title="Bảng xếp hạng">
                            {ranking.map(r => (
                                <RankRow key={r.rank}>
                                    <Box tw="flex flex-row items-center">
                                        <Text
                                            tw="text-main font-semibold"
                                            style={{ width: 28 }}
                                        >
                                            #{r.rank}
                                        </Text>
                                        <Text size="small" tw="text-text_1 ml-2">
                                            {r.name}
                                        </Text>
                                    </Box>
                                    <Text size="small" tw="text-text_2">
                                        {r.score} điểm
                                    </Text>
                                </RankRow>
                            ))}
                        </SectionCard>
                    </Box>
                )}

                {/* Làm bài */}
                {canDoExam &&
                    contest.questions.map((q, qi) => (
                        <Box key={q.id} mt={qi === 0 ? 0 : 3}>
                            <SectionCard>
                                <Text tw="text-text_1 font-medium">
                                    {qi + 1}. {q.content}
                                </Text>
                                {q.multiple && (
                                    <Text size="xxSmall" tw="text-text_3 mt-0.5">
                                        (Chọn nhiều đáp án)
                                    </Text>
                                )}
                                <Box mt={3}>
                                    {q.options.map(opt => (
                                        <OptionBtn
                                            key={opt.id}
                                            type="button"
                                            $active={(
                                                answers[q.id] || []
                                            ).includes(opt.id)}
                                            onClick={() =>
                                                toggleOption(
                                                    q.id,
                                                    opt.id,
                                                    q.multiple,
                                                )
                                            }
                                        >
                                            {opt.content}
                                        </OptionBtn>
                                    ))}
                                </Box>
                            </SectionCard>
                        </Box>
                    ))}
            </Box>

            {canDoExam && (
                <Box
                    tw="fixed left-0 right-0 px-4 bg-ui_bg pt-3 border-t border-border"
                    style={{
                        bottom: 0,
                        paddingBottom:
                            "calc(var(--zaui-safe-area-inset-bottom, 0px) + 12px)",
                    }}
                >
                    <Button fullWidth loading={submitting} onClick={onSubmit}>
                        Nộp bài
                    </Button>
                </Box>
            )}
        </PageLayout>
    );
};

export default ContestDetailPage;
