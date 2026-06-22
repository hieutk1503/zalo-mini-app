import { create } from "zustand";
import { devtools } from "zustand/middleware";
import createAppStore, { AppSlice } from "./appSlice";
import createAuthStore, { AuthSlice } from "./authSlice";
import createFeedbackSlide, { FeedbackSlice } from "./feedbackSlice";
import createInformationGuideSlide, {
    InformationGuideSlice,
} from "./informationGuideSlice";
import createOrganizationSlide, {
    OrganizationSlice,
} from "./organizationSlice";
import createScheduleSlide, { ScheduleSlice } from "./scheduleSlice";
import createProfileSlice, { ProfileSlice } from "./profileSlice";
import createEgovSlice, { EgovSlice } from "./egovSlice";
import createResidentGroupSlice, {
    ResidentGroupSlice,
} from "./residentGroupSlice";
import createCommunitySlice, { CommunitySlice } from "./communitySlice";
import createNeighborhoodSlice, {
    NeighborhoodSlice,
} from "./neighborhoodSlice";
import createEngagementSlice, { EngagementSlice } from "./engagementSlice";
import createFinanceSlice, { FinanceSlice } from "./financeSlice";
import createNewsSlice, { NewsSlice } from "./newsSlice";

type State = AppSlice &
    AuthSlice &
    FeedbackSlice &
    InformationGuideSlice &
    OrganizationSlice &
    ScheduleSlice &
    ProfileSlice &
    EgovSlice &
    ResidentGroupSlice &
    CommunitySlice &
    NeighborhoodSlice &
    EngagementSlice &
    FinanceSlice &
    NewsSlice;

export const useStore = create<State>()(
    devtools((...a) => ({
        ...createAppStore(...a),
        ...createAuthStore(...a),
        ...createFeedbackSlide(...a),
        ...createInformationGuideSlide(...a),
        ...createOrganizationSlide(...a),
        ...createScheduleSlide(...a),
        ...createProfileSlice(...a),
        ...createEgovSlice(...a),
        ...createResidentGroupSlice(...a),
        ...createCommunitySlice(...a),
        ...createNeighborhoodSlice(...a),
        ...createEngagementSlice(...a),
        ...createFinanceSlice(...a),
        ...createNewsSlice(...a),
    })),
);
