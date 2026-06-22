import { FC } from "react";

// types: Organization, News, Procedure, Document, Hotline, Survey, Project, Bidding, Chat...

export type ResData<T> = {
    data?: T;
    err: number;
    message: string;
};

export type Address = {
    district: string;
    city: string;
};

export type User = {
    id: string;
    name: string;
    avatar: string;
    idByOA?: string;
};

export type OA = {
    oaId: string;
    follow: boolean;
    name: string;
    logoUrl?: string;
};

// eslint-disable-next-line no-shadow
export enum Status {
    INCOMPLETE,
    COMPLETED,
    OVERDUE,
}

export type ProfileNotification = {
    message: string;
    createdAt?: Date;
};

export type Profile = {
    name?: string;
    dueDate?: Date;
    profileCode?: string;
    notifications?: ProfileNotification[];
};

export type Organization = {
    officialAccounts?: OA[];
    id?: string;
    logoUrl?: string;
    description: string;
    name?: string;
};

export type Article = {
    author?: string;
    title?: string;
    desc?: string;
    link?: string;
    createdAt?: Date;
    thumb?: string;
    id?: string;
};

export type Articles = {
    total: number;
    articles: Article[];
    page: number;
    currentPageSize: number;
};

export type AppError = {
    message?: string;
    code?: number;
};

export type FeedbackStatus =
    | "new"
    | "processing"
    | "responded"
    | "rejected"
    | "closed";

export type Feedback = {
    id: number;
    code?: string;
    title: string;
    content: string;
    response: string;
    creationTime: Date;
    responseTime: Date;
    type: string;
    status?: FeedbackStatus;
    imageUrls?: string[];
};

export type InformationGuide = {
    id: number;
    question: string;
    answer: string;
};

export type FeedbackType = {
    id: number;
    title: string;
    order: number;
};

export type Feedbacks = {
    total: number;
    feedbacks: Feedback[];
    page: number;
    currentPageSize: number;
};

export type InformationGuides = {
    total: number;
    informationGuides: InformationGuide[];
    page: number;
    currentPageSize: number;
};

export type ScheduleAppointment = {
    fullName: string;
    number?: number;
    currentNumber?: number;
    date: Date;
    content: string;
    phoneNumber: string;
    citizenId?: string;
    appointmentTime?: string;
    code?: string;
    status: ScheduleAppointmentStatus;
    rejectedInfo?: string;
};

export type ScheduleAppointmentStatus =
    | "pending"
    | "rejected"
    | "approved"
    | "cancelled"
    | "completed";

export type Utinity = {
    key: string;
    label: string;
    icon?: FC<any>;
    iconSrc?: string;
    path?: string;
    link?: string;
    inDevelopment?: boolean;
    phoneNumber?: string;
    navState?: unknown;
};

/* =====================================================================
 * Các module dịch vụ công bổ sung (Phase 1 - mở rộng theo tài liệu)
 * ===================================================================== */

/** Thủ tục hành chính */
export type Procedure = {
    id: string;
    code: string;
    name: string;
    category: string;
    agency?: string;
    fee?: string;
    processingTime?: string;
    dossierRequirements?: string;
    processSteps?: string;
    legalBasis?: string;
    onlineSubmissionUrl?: string;
    formIds?: string[];
};

export type Procedures = {
    procedures: Procedure[];
    total: number;
    page: number;
    currentPageSize: number;
};

/** Loại văn bản trong kho văn bản điện tử / mẫu đơn */
export type PublicDocumentType =
    | "party_resolution"
    | "council_resolution"
    | "form"
    | "planning"
    | "other";

/** Văn bản điện tử / mẫu đơn - tờ khai */
export type PublicDocument = {
    id: string;
    documentNo?: string;
    title: string;
    summary?: string;
    type: PublicDocumentType;
    category?: string;
    issuedDate?: Date;
    fileUrl?: string;
    fileType?: string;
    fileSize?: string;
    /** Ảnh xem trước (vd ảnh bản đồ quy hoạch) */
    imageUrl?: string;
    /** Liên kết bản đồ trực tuyến (WebGIS / Google Maps) */
    mapUrl?: string;
};

export type PublicDocuments = {
    documents: PublicDocument[];
    total: number;
    page: number;
    currentPageSize: number;
};

/** Trạng thái hiệu lực của văn bản pháp luật */
export type LegalDocumentStatus = "active" | "expired" | "amended";

/** Văn bản quy phạm pháp luật (Thư viện pháp luật) */
export type LegalDocument = {
    id: string;
    docNo?: string;
    title: string;
    docType?: string;
    field?: string;
    issuingAgency?: string;
    issuedDate?: Date;
    effectiveDate?: Date;
    status?: LegalDocumentStatus;
    fileType?: string;
    fileUrl?: string;
    summary?: string;
    plainExplanation?: string;
    aiSummary?: string;
};

export type LegalDocuments = {
    legalDocuments: LegalDocument[];
    total: number;
    page: number;
    currentPageSize: number;
};

/** Số liệu tổng hợp cho trang chủ thông minh */
export type HomeStats = {
    procedureCount?: number;
    legalDocumentCount?: number;
    documentCount?: number;
    appointmentCount?: number;
    newsCount?: number;
    feedbackCount?: number;
    reflectionResolvedRate?: number | null;
    population?: number | null;
    satisfactionScore?: number | null;
    onlineServiceRate?: number | null;
};

/** Liên kết điều hướng dịch vụ công (service hub) */
export type ServiceLink = {
    id: string;
    group: string;
    title: string;
    description?: string;
    iconUrl?: string;
    /** Deep link mở app nếu đã cài (đề xuất, hiện chưa dùng) */
    appScheme?: string;
    /** URL web fallback (mở bằng Zalo webview) */
    webUrl: string;
    storeUrl?: string;
    order?: number;
    enabled?: boolean;
};

/** Kết quả upload tệp (ảnh/chứng từ/tài liệu) */
export type UploadResult = {
    url: string;
    name: string;
    size?: number;
    type?: string;
};

/** Đường dây nóng */
export type Hotline = {
    id: string;
    group: string;
    title: string;
    personName?: string;
    role?: string;
    phoneNumber: string;
    order?: number;
};

/** Bản đồ - trụ sở cơ quan */
export type OfficeLocation = {
    id: string;
    name: string;
    address: string;
    mapUrl?: string;
    latitude?: number;
    longitude?: number;
    workingHours?: string;
    phoneNumber?: string;
};

/** Lịch công tác điện tử */
export type WorkScheduleEvent = {
    id: string;
    date: Date;
    startTime?: string;
    endTime?: string;
    title: string;
    location?: string;
    host?: string;
    participants?: string;
    type?: "leadership" | "meeting" | "citizen_reception" | "other";
};

/** Khảo sát mức độ hài lòng */
export type SurveyQuestionType =
    | "rating"
    | "text"
    | "single_choice"
    | "multiple_choice";

export type SurveyQuestion = {
    id: string;
    order: number;
    content: string;
    type: SurveyQuestionType;
    required?: boolean;
    options?: string[];
};

export type Survey = {
    id: string;
    title: string;
    description?: string;
    status?: "draft" | "active" | "closed";
    questions: SurveyQuestion[];
};

export type SurveyAnswer = {
    questionId: string;
    value: string | number | string[];
};

/** Dự án đầu tư công */
export type ProjectStatus =
    | "preparing"
    | "ongoing"
    | "completed"
    | "suspended";

export type Project = {
    id: string;
    name: string;
    field?: string;
    investor?: string;
    totalInvestment?: string;
    location?: string;
    startDate?: Date;
    endDate?: Date;
    progress?: number;
    status?: ProjectStatus;
    description?: string;
};

export type Projects = {
    projects: Project[];
    total: number;
    page: number;
    currentPageSize: number;
};

/** Thông tin đấu thầu */
export type BiddingStatus = "open" | "evaluating" | "awarded" | "cancelled";

export type Bidding = {
    id: string;
    code?: string;
    name: string;
    investor?: string;
    field?: string;
    budget?: string;
    method?: string;
    publishDate?: Date;
    closeDate?: Date;
    status?: BiddingStatus;
    winner?: string;
    link?: string;
    description?: string;
};

export type Biddings = {
    biddings: Bidding[];
    total: number;
    page: number;
    currentPageSize: number;
};

/** Chatbot AI dịch vụ công */
export type ChatRole = "user" | "bot";

export type ChatSuggestion = {
    label: string;
    path?: string;
    link?: string;
    phoneNumber?: string;
};

export type ChatMessage = {
    id: string;
    role: ChatRole;
    content: string;
    createdAt: Date;
    suggestions?: ChatSuggestion[];
};

/* =====================================================================
 * eGov DSS / Resident Group (P0: Cư dân, Hộ dân, Duyệt thông tin)
 * Dữ liệu cư dân/hộ dân là dữ liệu nhạy cảm -> chỉ dùng dữ liệu GIẢ trong repo.
 * ===================================================================== */

/** Trạng thái phê duyệt dùng cho cư dân/hộ dân (khớp WorkflowStatus). */
export type ApprovalStatus = "draft" | "pending" | "approved" | "rejected";

export type Gender = "male" | "female" | "other";

/** Loại cư trú của cư dân */
export type ResidenceType = "permanent" | "temporary";

/** Loại hộ */
export type HouseholdType = "permanent" | "temporary" | "rental";

/** Thông tin đoàn thể của cư dân */
export type UnionInfo = {
    id: string;
    organization: string;
    role?: string;
    joinDate?: string;
    endDate?: string;
    note?: string;
};

/** Khen thưởng */
export type RewardInfo = {
    id: string;
    title: string;
    level?: string;
    decisionNo?: string;
    decisionDate?: string;
    content?: string;
};

/** Kỷ luật */
export type DisciplineInfo = {
    id: string;
    form: string;
    agency?: string;
    decisionNo?: string;
    decisionDate?: string;
    reason?: string;
};

/** Tiền án / tiền sự */
export type CriminalRecord = {
    id: string;
    recordType: "tien_an" | "tien_su";
    content: string;
    recordedDate?: string;
    agency?: string;
};

/** Cư dân */
export type Resident = {
    id: string;
    fullName: string;
    citizenId: string;
    citizenIdIssueDate?: string;
    citizenIdIssuePlace?: string;
    dob?: string;
    gender?: Gender;
    ethnicity?: string;
    religion?: string;
    nationality?: string;
    phone?: string;
    email?: string;
    permanentAddress?: string;
    currentAddress?: string;
    residenceType?: ResidenceType;
    householdId?: string;
    householdCode?: string;
    /** Quan hệ với chủ hộ (Chủ hộ, Vợ, Chồng, Con...) */
    relationToHead?: string;
    /** Tổ dân phố */
    neighborhoodGroup?: string;
    status: ApprovalStatus;
    rejectReason?: string;
    note?: string;
    unionInfos?: UnionInfo[];
    rewards?: RewardInfo[];
    disciplines?: DisciplineInfo[];
    criminalRecords?: CriminalRecord[];
    createdAt?: string;
    updatedAt?: string;
};

export type Residents = {
    residents: Resident[];
    total: number;
    page: number;
    currentPageSize: number;
};

/** Thành viên hộ */
export type HouseholdMember = {
    id: string;
    residentId?: string;
    fullName: string;
    citizenId?: string;
    dob?: string;
    gender?: Gender;
    relationToHead: string;
    phone?: string;
    residenceType?: ResidenceType;
    status?: ApprovalStatus;
};

/** Gia đình văn hóa */
export type CultureTitle = {
    id: string;
    year: number;
    title: string;
    decisionNo?: string;
    recognizedDate?: string;
    note?: string;
};

/** Hộ dân */
export type Household = {
    id: string;
    code: string;
    headResidentId?: string;
    headName: string;
    houseNumber?: string;
    addressDetail: string;
    neighborhoodGroup: string;
    householdType?: HouseholdType;
    memberCount?: number;
    residenceBook?: string;
    residenceStatus?: string;
    note?: string;
    status: ApprovalStatus;
    rejectReason?: string;
    members?: HouseholdMember[];
    cultureTitles?: CultureTitle[];
    createdAt?: string;
    updatedAt?: string;
};

export type Households = {
    households: Household[];
    total: number;
    page: number;
    currentPageSize: number;
};

/** Yêu cầu phê duyệt (cư dân/hộ dân) */
export type ApprovalTargetType = "resident" | "household";
export type ApprovalRequestStatus = "pending" | "approved" | "rejected";

export type ApprovalRequest = {
    id: string;
    targetType: ApprovalTargetType;
    targetId: string;
    /** Tên cư dân/chủ hộ để hiển thị nhanh */
    targetName?: string;
    /** Người gửi yêu cầu */
    requesterName: string;
    neighborhoodGroup?: string;
    /** Tóm tắt nội dung thay đổi */
    summary: string;
    submittedAt: string;
    status: ApprovalRequestStatus;
    rejectReason?: string;
};

export type ApprovalRequests = {
    requests: ApprovalRequest[];
    total: number;
    page: number;
    currentPageSize: number;
};

/* =====================================================================
 * Phản ánh nâng cao (workflow xử lý cho tổ trưởng / cán bộ phường)
 * Tách khỏi luồng Feedback cư dân hiện có để không phá vỡ màn /feedbacks.
 * ===================================================================== */

/** Trạng thái xử lý phản ánh (khớp WorkflowStatus để dùng chung màu badge). */
export type ReflectionStatus =
    | "pending"
    | "processing"
    | "forwarded"
    | "completed"
    | "rejected";

export type ReflectionLogAction =
    | "create"
    | "receive"
    | "forward"
    | "complete"
    | "reject";

export type ReflectionLog = {
    id: string;
    action: ReflectionLogAction;
    note?: string;
    byName?: string;
    toUnit?: string;
    at: string;
};

export type Reflection = {
    id: string;
    code: string;
    title: string;
    typeName: string;
    content: string;
    senderName: string;
    phone?: string;
    neighborhoodGroup?: string;
    location?: string;
    imageUrls?: string[];
    status: ReflectionStatus;
    /** Đơn vị đang xử lý / được chuyển tiếp */
    handlingUnit?: string;
    createdAt: string;
    logs?: ReflectionLog[];
};

export type Reflections = {
    reflections: Reflection[];
    total: number;
    page: number;
    currentPageSize: number;
};

/* =====================================================================
 * Thông báo nhanh
 * ===================================================================== */

export type NotificationLevel = "normal" | "important" | "urgent";

export type QuickNotification = {
    id: string;
    title: string;
    content: string;
    level: NotificationLevel;
    neighborhoodGroup?: string;
    sentAt: string;
    read?: boolean;
    attachmentUrl?: string;
};

export type QuickNotifications = {
    notifications: QuickNotification[];
    total: number;
    page: number;
    currentPageSize: number;
};

/* =====================================================================
 * P1 vận hành khu phố — Cuộc họp & Nhóm cộng đồng
 * ===================================================================== */

export type MeetingStatus =
    | "scheduled"
    | "ongoing"
    | "finished"
    | "cancelled";

export type ConfirmStatus = "pending" | "confirmed" | "declined";

export type MeetingParticipant = {
    id: string;
    name: string;
    residentId?: string;
    confirmStatus: ConfirmStatus;
    reason?: string;
};

export type MeetingDocument = {
    id: string;
    name: string;
    url?: string;
};

export type Meeting = {
    id: string;
    title: string;
    content: string;
    /** ISO datetime, vd 2024-06-18T19:30 */
    startTime: string;
    endTime?: string;
    location: string;
    chairperson?: string;
    status: MeetingStatus;
    neighborhoodGroup?: string;
    participants?: MeetingParticipant[];
    participantCount?: number;
    conclusion?: string;
    documents?: MeetingDocument[];
    note?: string;
    /** Trạng thái xác nhận của người dùng hiện tại (mock) */
    myConfirmStatus?: ConfirmStatus;
    createdAt?: string;
};

export type Meetings = {
    meetings: Meeting[];
    total: number;
    page: number;
    currentPageSize: number;
};

export type GroupStatus = "active" | "inactive";

export type CommunityGroupMember = {
    id: string;
    name: string;
    residentId?: string;
    role?: string;
};

export type CommunityGroup = {
    id: string;
    name: string;
    description?: string;
    topic?: string;
    status: GroupStatus;
    memberCount?: number;
    creatorName?: string;
    members?: CommunityGroupMember[];
    createdAt?: string;
};

export type CommunityGroups = {
    groups: CommunityGroup[];
    total: number;
    page: number;
    currentPageSize: number;
};

/* =====================================================================
 * P1 — Khảo sát (danh sách/tham gia) & Cuộc thi
 * Tách khỏi "khảo sát hài lòng" (Survey/getActiveSurvey) hiện có.
 * ===================================================================== */

export type SurveyStatus = "draft" | "active" | "closed";

/** Một đợt khảo sát (dùng lại SurveyQuestion/SurveyAnswer ở trên). */
export type SurveyCampaign = {
    id: string;
    title: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    status: SurveyStatus;
    questions: SurveyQuestion[];
    participated?: boolean;
    allowRetake?: boolean;
    showResult?: boolean;
    participantCount?: number;
};

export type SurveyCampaigns = {
    surveys: SurveyCampaign[];
    total: number;
    page: number;
    currentPageSize: number;
};

export type SurveyResultOption = {
    value: string;
    count: number;
    percent: number;
};

export type SurveyQuestionResult = {
    questionId: string;
    content: string;
    type: SurveyQuestionType;
    options?: SurveyResultOption[];
    average?: number;
    textAnswers?: string[];
};

export type SurveyResult = {
    surveyId: string;
    total: number;
    questions: SurveyQuestionResult[];
};

/* ------------------------------- Cuộc thi ------------------------------- */

export type ContestStatus = "upcoming" | "active" | "closed";

export type ContestAnswerOption = {
    id: string;
    content: string;
};

export type ContestQuestion = {
    id: string;
    order: number;
    content: string;
    points: number;
    options: ContestAnswerOption[];
    correctOptionIds: string[];
    /** true nếu cho chọn nhiều đáp án */
    multiple?: boolean;
};

export type Contest = {
    id: string;
    title: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    status: ContestStatus;
    durationMinutes?: number;
    maxAttempts?: number;
    questions: ContestQuestion[];
    participated?: boolean;
    participantCount?: number;
};

export type Contests = {
    contests: Contest[];
    total: number;
    page: number;
    currentPageSize: number;
};

export type ContestAnswer = {
    questionId: string;
    optionIds: string[];
};

export type ContestResult = {
    contestId: string;
    score: number;
    maxScore: number;
    correctCount: number;
    totalQuestions: number;
    submittedAt?: string;
    rank?: number;
};

export type ContestRankingEntry = {
    rank: number;
    name: string;
    score: number;
};

/* =====================================================================
 * P1 — Quản lý thu / chi khu phố
 * ===================================================================== */

export type IncomeCampaignStatus = "draft" | "active" | "closed";
export type PaymentStatus = "unpaid" | "paid" | "partial" | "exempt";
export type ExpenseStatus = "recorded" | "approved" | "rejected";

export type HouseholdPayment = {
    id: string;
    householdId?: string;
    householdName: string;
    amountDue: number;
    amountPaid: number;
    paidDate?: string;
    status: PaymentStatus;
    note?: string;
};

export type IncomeCampaign = {
    id: string;
    name: string;
    neighborhoodGroup?: string;
    feeType?: string;
    description?: string;
    amountPerHousehold?: number;
    expectedTotal?: number;
    startDate?: string;
    endDate?: string;
    status: IncomeCampaignStatus;
    households?: HouseholdPayment[];
    /** Tính toán phía service */
    totalHouseholds?: number;
    paidCount?: number;
    unpaidCount?: number;
    collectedAmount?: number;
    createdAt?: string;
};

export type IncomeCampaigns = {
    campaigns: IncomeCampaign[];
    total: number;
    page: number;
    currentPageSize: number;
};

export type ExpenseAttachment = {
    id: string;
    name: string;
    url?: string;
};

export type ExpenseRecord = {
    id: string;
    name: string;
    neighborhoodGroup?: string;
    purpose: string;
    amount: number;
    expenseDate: string;
    performerName?: string;
    fundSource?: string;
    note?: string;
    status: ExpenseStatus;
    attachments?: ExpenseAttachment[];
    createdAt?: string;
};

export type ExpenseRecords = {
    expenses: ExpenseRecord[];
    total: number;
    page: number;
    currentPageSize: number;
};

/* =====================================================================
 * Tin tức nội bộ (có chi tiết + bình luận)
 * Tách khỏi "Article" (tin liên kết ngoài) ở trang chủ.
 * ===================================================================== */

export type NewsArticle = {
    id: string;
    title: string;
    summary?: string;
    content: string;
    thumbnailUrl?: string;
    category?: string;
    author?: string;
    source?: string;
    sourceUrl?: string;
    status?: string;
    featured?: boolean | string;
    publishedAt: string;
    viewCount?: number;
    commentCount?: number;
    allowComment?: boolean;
};

export type HomeSection = {
    id: string;
    key: string;
    label?: string;
    enabled?: boolean;
    order?: number;
    title?: string;
    subtitle?: string;
    imageUrl?: string;
    color1?: string;
    color2?: string;
    link?: string;
    images?: string;
    videoUrl?: string;
};

export type NewsCategory = {
    id: string;
    name: string;
    order?: number;
    description?: string;
    enabled?: boolean;
};

export type EventItem = {
    id: string;
    title: string;
    description?: string;
    location?: string;
    startTime?: string;
    endTime?: string;
    imageUrl?: string;
    link?: string;
    status?: string;
};

export type NewsArticles = {
    articles: NewsArticle[];
    total: number;
    page: number;
    currentPageSize: number;
};

export type NewsComment = {
    id: string;
    articleId: string;
    authorName: string;
    content: string;
    createdAt: string;
    hidden?: boolean;
};
