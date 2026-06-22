import React, { useEffect, useState } from "react";
import { Box, Icon, Text, useSnackbar } from "zmp-ui";
import styled from "styled-components";
import tw from "twin.macro";
import "styled-components/macro";
import PageLayout from "@components/layout/PageLayout";
import { Button, TextArea } from "@components/customized";
import { EmptyDataContainer } from "@components/common";
import { useStore } from "@store";
import { SurveyAnswer, SurveyQuestion } from "@dts";

const Card = styled(Box)`
    ${tw`bg-white rounded-lg p-4 mb-3`}
`;

const Star = styled.button<{ $active: boolean }>`
    ${tw`text-3xl mr-1`}
    color: ${({ $active }) => ($active ? "#F5A623" : "#D7DBDF")};
`;

const Option = styled.button<{ $active: boolean }>`
    ${tw`w-full text-left px-4 py-3 rounded-lg border mb-2`}
    ${({ $active }) =>
        $active ? tw`border-main bg-blue_10 text-main` : tw`border-ng_20`}
`;

const SurveyPage: React.FC = () => {
    const { openSnackbar } = useSnackbar();
    const [answers, setAnswers] = useState<Record<string, string | number>>({});

    const [
        survey,
        getActiveSurvey,
        loading,
        submitSurvey,
        submitting,
        submitted,
    ] = useStore(state => [
        state.survey,
        state.getActiveSurvey,
        state.gettingSurvey,
        state.submitSurvey,
        state.submittingSurvey,
        state.surveySubmitted,
    ]);

    useEffect(() => {
        if (!survey) {
            getActiveSurvey();
        }
    }, []);

    const setAnswer = (qId: string, value: string | number) =>
        setAnswers(prev => ({ ...prev, [qId]: value }));

    const handleSubmit = async () => {
        if (!survey) {
            return;
        }
        const missing = survey.questions.find(
            q => q.required && (answers[q.id] === undefined || answers[q.id] === ""),
        );
        if (missing) {
            openSnackbar({
                type: "warning",
                text: "Vui lòng trả lời đầy đủ các câu hỏi bắt buộc",
            });
            return;
        }
        const payload: SurveyAnswer[] = Object.keys(answers).map(qId => ({
            questionId: qId,
            value: answers[qId],
        }));
        const ok = await submitSurvey(payload);
        if (!ok) {
            openSnackbar({
                type: "error",
                text: "Gửi khảo sát thất bại, vui lòng thử lại",
            });
        }
    };

    const renderQuestion = (q: SurveyQuestion) => {
        if (q.type === "rating") {
            const current = Number(answers[q.id] || 0);
            return (
                <Box tw="flex flex-row">
                    {[1, 2, 3, 4, 5].map(n => (
                        <Star
                            key={n}
                            $active={n <= current}
                            onClick={() => setAnswer(q.id, n)}
                        >
                            ★
                        </Star>
                    ))}
                </Box>
            );
        }
        if (q.type === "single_choice") {
            return (
                <Box>
                    {(q.options || []).map(opt => (
                        <Option
                            key={opt}
                            $active={answers[q.id] === opt}
                            onClick={() => setAnswer(q.id, opt)}
                        >
                            {opt}
                        </Option>
                    ))}
                </Box>
            );
        }
        return (
            <TextArea
                placeholder="Nhập ý kiến của bạn"
                value={(answers[q.id] as string) || ""}
                onChange={e => setAnswer(q.id, e.target.value)}
            />
        );
    };

    if (!loading && !survey) {
        return (
            <PageLayout title="Khảo sát hài lòng">
                <EmptyDataContainer emptyText="Hiện chưa có khảo sát nào" />
            </PageLayout>
        );
    }

    if (submitted) {
        return (
            <PageLayout title="Khảo sát hài lòng">
                <Box
                    tw="flex flex-col items-center justify-center text-center"
                    style={{ minHeight: "60vh" }}
                    p={4}
                >
                    <Icon icon="zi-check-circle" tw="text-main" size={64} />
                    <Text.Title tw="mt-4">Cảm ơn quý vị!</Text.Title>
                    <Text tw="text-text_2 mt-2">
                        Ý kiến của quý vị đã được ghi nhận và sẽ giúp chúng tôi
                        nâng cao chất lượng phục vụ.
                    </Text>
                </Box>
            </PageLayout>
        );
    }

    return (
        <PageLayout title="Khảo sát hài lòng" id="survey-page">
            <Box p={3}>
                {survey && (
                    <Card>
                        <Text.Title size="normal">{survey.title}</Text.Title>
                        {survey.description && (
                            <Text tw="text-text_2 mt-2">
                                {survey.description}
                            </Text>
                        )}
                    </Card>
                )}
                {survey?.questions.map((q, idx) => (
                    <Card key={q.id}>
                        <Text tw="text-text_1 font-medium mb-3">
                            {idx + 1}. {q.content}
                            {q.required && (
                                <span style={{ color: "#dc1f18" }}> *</span>
                            )}
                        </Text>
                        {renderQuestion(q)}
                    </Card>
                ))}
                <Box mt={2}>
                    <Button fullWidth loading={submitting} onClick={handleSubmit}>
                        Gửi khảo sát
                    </Button>
                </Box>
            </Box>
        </PageLayout>
    );
};

export default SurveyPage;
