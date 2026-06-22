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
import { EmptyState, MetaBadge, SectionCard, TextArea } from "@components";
import { useStore } from "@store";
import { SURVEY_STATUS_META } from "@constants/engagement";
import { SurveyAnswer } from "@dts";

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

const RatingRow = styled.div`
    ${tw`flex flex-row gap-2`}
`;

const RatingBtn = styled.button<{ $active: boolean }>`
    ${tw`flex-1 py-2 rounded-lg border text-sm`}
    ${({ $active }) =>
        $active ? tw`border-main bg-main text-white` : tw`border-ng_20 bg-white`}
`;

const Bar = styled.div`
    ${tw`bg-ng_10 rounded-full overflow-hidden mt-1`}
    height: 8px;
`;
const BarFill = styled.div`
    ${tw`bg-main h-full`}
`;

const SurveyDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { openSnackbar } = useSnackbar();

    const [
        survey,
        loading,
        getDetail,
        submit,
        getResults,
        result,
        submitting,
    ] = useStore(state => [
        state.surveyCampaignDetail,
        state.gettingSurveyCampaignDetail,
        state.getSurveyCampaignDetail,
        state.submitSurveyCampaign,
        state.getSurveyCampaignResults,
        state.surveyResult,
        state.submittingSurveyCampaign,
    ]);

    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [submitted, setSubmitted] = useState(false);
    const [showResult, setShowResult] = useState(false);

    useEffect(() => {
        if (id) {
            setSubmitted(false);
            setShowResult(false);
            setAnswers({});
            getDetail(id);
        }
    }, [id]);

    // Nếu đã tham gia và cho xem kết quả -> tải kết quả ngay.
    useEffect(() => {
        if (survey && survey.id === id && survey.participated && survey.showResult) {
            getResults(survey.id);
            setShowResult(true);
        }
    }, [survey, id]);

    const setSingle = (qId: string, value: string) =>
        setAnswers(a => ({ ...a, [qId]: value }));

    const toggleMulti = (qId: string, value: string) =>
        setAnswers(a => {
            const arr: string[] = a[qId] || [];
            return {
                ...a,
                [qId]: arr.includes(value)
                    ? arr.filter(x => x !== value)
                    : [...arr, value],
            };
        });

    const onSubmit = async () => {
        if (!survey || !id) return;
        // Validate câu hỏi bắt buộc.
        const missing = survey.questions.find(q => {
            if (!q.required) return false;
            const v = answers[q.id];
            if (q.type === "multiple_choice") return !v || v.length === 0;
            return v === undefined || v === "" || v === null;
        });
        if (missing) {
            openSnackbar({
                type: "warning",
                text: "Vui lòng trả lời đầy đủ các câu hỏi bắt buộc",
            });
            return;
        }
        const payload: SurveyAnswer[] = survey.questions.map(q => ({
            questionId: q.id,
            value: answers[q.id] ?? (q.type === "multiple_choice" ? [] : ""),
        }));
        const res = await submit(id, payload);
        if (res) {
            setSubmitted(true);
            if (survey.showResult) {
                setShowResult(true);
            }
            openSnackbar({ type: "success", text: "Cảm ơn bạn đã tham gia!" });
        } else {
            openSnackbar({ type: "error", text: "Gửi khảo sát thất bại" });
        }
    };

    if (loading) {
        return (
            <PageLayout title="Khảo sát" id="survey-loading">
                <Box p={4}>
                    <LoadingBlock />
                </Box>
            </PageLayout>
        );
    }

    if (!survey) {
        return (
            <PageLayout title="Khảo sát" id="survey-empty">
                <EmptyState
                    title="Không tìm thấy khảo sát"
                    actionLabel="Quay lại"
                    onAction={() => navigate(-1)}
                />
            </PageLayout>
        );
    }

    const closed = survey.status === "closed";
    const canParticipate =
        survey.status === "active" &&
        !showResult &&
        (!survey.participated || submitted === false) &&
        !submitted;

    return (
        <PageLayout title="Khảo sát" id="survey-detail-page">
            <Box p={4} tw="bg-ui_bg mb-2">
                <Box tw="flex flex-row items-start justify-between">
                    <Text.Title size="small" tw="text-text_1 flex-1 pr-2">
                        {survey.title}
                    </Text.Title>
                    <MetaBadge meta={SURVEY_STATUS_META[survey.status]} />
                </Box>
                {survey.description && (
                    <Text size="small" tw="text-text_2 mt-1">
                        {survey.description}
                    </Text>
                )}
            </Box>

            <Box px={4} style={{ paddingBottom: 110 }}>
                {/* Kết quả tổng hợp */}
                {showResult && result && (
                    <SectionCard title={`Kết quả (${result.total} lượt)`}>
                        {result.questions.map((q, qi) => (
                            <Box key={q.questionId} mt={qi === 0 ? 0 : 4}>
                                <Text size="small" tw="text-text_1 font-medium">
                                    {qi + 1}. {q.content}
                                </Text>
                                {q.options?.map(o => (
                                    <Box key={o.value} mt={2}>
                                        <Box tw="flex flex-row justify-between">
                                            <Text size="xxSmall" tw="text-text_2">
                                                {o.value}
                                            </Text>
                                            <Text size="xxSmall" tw="text-text_2">
                                                {o.percent}% ({o.count})
                                            </Text>
                                        </Box>
                                        <Bar>
                                            <BarFill
                                                style={{ width: `${o.percent}%` }}
                                            />
                                        </Bar>
                                    </Box>
                                ))}
                                {q.type === "rating" && (
                                    <Text size="small" tw="text-main mt-1">
                                        Điểm trung bình: {q.average}/5
                                    </Text>
                                )}
                                {q.type === "text" &&
                                    q.textAnswers?.map((t) => (
                                        <Text
                                            key={t}
                                            size="xxSmall"
                                            tw="text-text_2 mt-1"
                                        >
                                            • {t}
                                        </Text>
                                    ))}
                            </Box>
                        ))}
                    </SectionCard>
                )}

                {/* Cảm ơn (không hiển thị kết quả) */}
                {submitted && !showResult && (
                    <SectionCard>
                        <Box tw="text-center py-4">
                            <Text tw="text-text_1 font-medium">
                                Cảm ơn bạn đã tham gia khảo sát!
                            </Text>
                            <Text size="small" tw="text-text_2 mt-1">
                                Ý kiến của bạn đã được ghi nhận.
                            </Text>
                        </Box>
                    </SectionCard>
                )}

                {/* Trạng thái đóng / đã tham gia mà không xem được kết quả */}
                {!canParticipate && !showResult && !submitted && (
                    <SectionCard>
                        <Text size="small" tw="text-text_2 text-center">
                            {(() => {
                                if (closed) return "Khảo sát đã đóng.";
                                if (survey.participated)
                                    return "Bạn đã tham gia khảo sát này.";
                                return "Khảo sát chưa mở.";
                            })()}
                        </Text>
                    </SectionCard>
                )}

                {/* Form tham gia */}
                {canParticipate &&
                    survey.questions.map((q, qi) => (
                        <Box key={q.id} mt={qi === 0 ? 0 : 3}>
                            <SectionCard>
                                <Text tw="text-text_1 font-medium">
                                    {qi + 1}. {q.content}
                                    {q.required ? " *" : ""}
                                </Text>
                                <Box mt={3}>
                                    {q.type === "single_choice" &&
                                        (q.options || []).map(opt => (
                                            <OptionBtn
                                                key={opt}
                                                type="button"
                                                $active={answers[q.id] === opt}
                                                onClick={() =>
                                                    setSingle(q.id, opt)
                                                }
                                            >
                                                {opt}
                                            </OptionBtn>
                                        ))}
                                    {q.type === "multiple_choice" &&
                                        (q.options || []).map(opt => (
                                            <OptionBtn
                                                key={opt}
                                                type="button"
                                                $active={(
                                                    answers[q.id] || []
                                                ).includes(opt)}
                                                onClick={() =>
                                                    toggleMulti(q.id, opt)
                                                }
                                            >
                                                {opt}
                                            </OptionBtn>
                                        ))}
                                    {q.type === "rating" && (
                                        <RatingRow>
                                            {[1, 2, 3, 4, 5].map(n => (
                                                <RatingBtn
                                                    key={n}
                                                    type="button"
                                                    $active={answers[q.id] === n}
                                                    onClick={() =>
                                                        setSingle(
                                                            q.id,
                                                            n as unknown as string,
                                                        )
                                                    }
                                                >
                                                    {n}
                                                </RatingBtn>
                                            ))}
                                        </RatingRow>
                                    )}
                                    {q.type === "text" && (
                                        <TextArea
                                            placeholder="Nhập câu trả lời"
                                            value={answers[q.id] || ""}
                                            onChange={e =>
                                                setSingle(q.id, e.target.value)
                                            }
                                        />
                                    )}
                                </Box>
                            </SectionCard>
                        </Box>
                    ))}
            </Box>

            {canParticipate && (
                <Box
                    tw="fixed left-0 right-0 px-4 bg-ui_bg pt-3 border-t border-border"
                    style={{
                        bottom: 0,
                        paddingBottom:
                            "calc(var(--zaui-safe-area-inset-bottom, 0px) + 12px)",
                    }}
                >
                    <Button fullWidth loading={submitting} onClick={onSubmit}>
                        Hoàn thành
                    </Button>
                </Box>
            )}
        </PageLayout>
    );
};

export default SurveyDetailPage;
