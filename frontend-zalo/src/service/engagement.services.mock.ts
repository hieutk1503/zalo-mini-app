/**
 * Mock service cho Khảo sát (danh sách/tham gia) và Cuộc thi.
 * In-memory; tự chấm điểm cuộc thi và tổng hợp kết quả khảo sát (mô phỏng).
 * Nguồn dữ liệu GIẢ: @mock/engagement.json.
 * Tên hàm tránh trùng với khảo sát hài lòng hiện có (getActiveSurvey/submitSurvey).
 */
import {
    SurveyCampaign,
    SurveyCampaigns,
    SurveyResult,
    SurveyQuestionResult,
    SurveyAnswer,
    Contest,
    Contests,
    ContestAnswer,
    ContestResult,
    ContestRankingEntry,
} from "@dts";
import db from "@mock/engagement.json";
import { matchKeyword } from "@utils/string";

const delay = <T>(data: T, ms = 300): Promise<T> =>
    new Promise(resolve => {
        setTimeout(() => resolve(data), ms);
    });

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const surveys: SurveyCampaign[] = clone(db.surveys) as SurveyCampaign[];
const contests: Contest[] = clone(db.contests) as Contest[];
const rankings: Record<string, ContestRankingEntry[]> = clone(
    db.rankings,
) as Record<string, ContestRankingEntry[]>;

const today = () => new Date().toISOString().slice(0, 10);

const paginate = <T>(list: T[], page: number, limit: number) => ({
    total: list.length,
    page,
    currentPageSize: limit,
    slice: list.slice(page * limit, page * limit + limit),
});

const withSurveyCount = (s: SurveyCampaign): SurveyCampaign => ({
    ...s,
    participantCount: s.participantCount ?? 0,
});

/* --------------------------------- Khảo sát --------------------------------- */

export interface GetSurveyCampaignsParams {
    organizationId?: string;
    page?: number;
    limit?: number;
    keyword?: string;
    status?: string;
}

export const getSurveyCampaigns = async (
    params: GetSurveyCampaignsParams = {},
): Promise<SurveyCampaigns> => {
    const { page = 0, limit = 10, keyword = "", status } = params;
    let list = [...surveys];
    if (status) {
        list = list.filter(s => s.status === status);
    }
    if (keyword) {
        list = list.filter(s =>
            matchKeyword(keyword, [s.title, s.description]),
        );
    }
    const { slice, ...meta } = paginate(list.map(withSurveyCount), page, limit);
    return delay({ surveys: slice, ...meta });
};

export const getSurveyCampaignDetail = async (params: {
    id: string;
    organizationId?: string;
}): Promise<SurveyCampaign | null> =>
    delay(clone(surveys.find(s => s.id === params.id) || null));

/** Tổng hợp kết quả mô phỏng theo cấu trúc câu hỏi. */
const computeSurveyResult = (survey: SurveyCampaign): SurveyResult => {
    const total = survey.participantCount || 30;
    const questions: SurveyQuestionResult[] = survey.questions.map(q => {
        if (q.type === "single_choice" || q.type === "multiple_choice") {
            const opts = q.options || [];
            // Phân bố giảm dần cho có dữ liệu hiển thị.
            const weights = opts.map((_, i) => opts.length - i);
            const sumW = weights.reduce((a, b) => a + b, 0) || 1;
            const options = opts.map((value, i) => {
                const count = Math.round((weights[i] / sumW) * total);
                return {
                    value,
                    count,
                    percent: Math.round((count / total) * 100),
                };
            });
            return {
                questionId: q.id,
                content: q.content,
                type: q.type,
                options,
            };
        }
        if (q.type === "rating") {
            return {
                questionId: q.id,
                content: q.content,
                type: q.type,
                average: 4.2,
            };
        }
        return {
            questionId: q.id,
            content: q.content,
            type: q.type,
            textAnswers: [
                "Mong khu phố tổ chức thêm hoạt động cho thiếu nhi.",
                "Cảm ơn ban điều hành đã lắng nghe ý kiến.",
            ],
        };
    });
    return { surveyId: survey.id, total, questions };
};

export const submitSurveyCampaign = async (params: {
    id: string;
    answers: SurveyAnswer[];
    organizationId?: string;
}): Promise<SurveyResult | null> => {
    const s = surveys.find(x => x.id === params.id);
    if (!s) return delay(null);
    s.participated = true;
    s.participantCount = (s.participantCount || 0) + 1;
    return delay(computeSurveyResult(s), 500);
};

export const getSurveyCampaignResults = async (params: {
    id: string;
    organizationId?: string;
}): Promise<SurveyResult | null> => {
    const s = surveys.find(x => x.id === params.id);
    if (!s) return delay(null);
    return delay(computeSurveyResult(s));
};

/* -------------------------------- Cuộc thi -------------------------------- */

export interface GetContestsParams {
    organizationId?: string;
    page?: number;
    limit?: number;
    keyword?: string;
    status?: string;
}

export const getContests = async (
    params: GetContestsParams = {},
): Promise<Contests> => {
    const { page = 0, limit = 10, keyword = "", status } = params;
    let list = [...contests];
    if (status) {
        list = list.filter(c => c.status === status);
    }
    if (keyword) {
        list = list.filter(c =>
            matchKeyword(keyword, [c.title, c.description]),
        );
    }
    const { slice, ...meta } = paginate(list, page, limit);
    return delay({ contests: slice, ...meta });
};

export const getContestDetail = async (params: {
    id: string;
    organizationId?: string;
}): Promise<Contest | null> =>
    delay(clone(contests.find(c => c.id === params.id) || null));

const sameSet = (a: string[], b: string[]) => {
    if (a.length !== b.length) return false;
    const sb = new Set(b);
    return a.every(x => sb.has(x));
};

export const submitContest = async (params: {
    id: string;
    answers: ContestAnswer[];
    organizationId?: string;
}): Promise<ContestResult | null> => {
    const c = contests.find(x => x.id === params.id);
    if (!c) return delay(null);
    let score = 0;
    let correctCount = 0;
    let maxScore = 0;
    c.questions.forEach(q => {
        maxScore += q.points;
        const ans = params.answers.find(a => a.questionId === q.id);
        if (ans && sameSet(ans.optionIds, q.correctOptionIds)) {
            score += q.points;
            correctCount += 1;
        }
    });
    c.participated = true;
    c.participantCount = (c.participantCount || 0) + 1;
    const list = rankings[c.id] || [];
    const rank = 1 + list.filter(r => r.score > score).length;
    return delay(
        {
            contestId: c.id,
            score,
            maxScore,
            correctCount,
            totalQuestions: c.questions.length,
            submittedAt: today(),
            rank,
        },
        500,
    );
};

export const getContestRanking = async (params: {
    id: string;
    organizationId?: string;
}): Promise<ContestRankingEntry[]> => delay(clone(rankings[params.id] || []));
