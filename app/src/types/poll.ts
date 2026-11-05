/**
 * Domain Data Contracts for School Polls, Voting & Surveys (Bình Chọn)
 * Module: M5 - Nhà Trường / Bình Chọn
 * Standards: MoET Circular 32/2020, Decision 4998/QĐ-BGDĐT, ECO Design System 1.0
 */

export type PollStatus = 'da_tao' | 'da_gui' | 'da_dong';

export type PollAudienceScope = 'toan_truong' | 'lop_hoc';

export interface PollOption {
  id: string;
  title: string;
  voteCount: number;
  percentage: number; // 0 to 100
  color?: string; // Hex color code for chart visualization
}

export interface PollConfig {
  allowMultipleChoices: boolean; // "Chọn nhiều phương án"
  allowParentViewResults: boolean; // "PH được xem kết quả bình chọn"
}

export interface Poll {
  id: string;
  schoolCode: string;
  title: string; // Chủ đề
  description?: string; // Mô tả
  deadline: string; // Thời hạn bình chọn: ISO datetime YYYY-MM-DDTHH:mm:ss or YYYY-MM-DD HH:mm
  imageUrl?: string; // Hình ảnh minh họa
  options: PollOption[]; // Minimum 2 options
  config: PollConfig;
  status: PollStatus;
  audienceScope?: PollAudienceScope; // Set when dispatched
  targetClassIds?: string[]; // Populated when audienceScope === 'lop_hoc'
  targetClassNames?: string[]; // Denormalized class labels
  totalVotes: number; // Cumulative count of option selections
  voterCount: number; // Distinct participating students/parents
  authorName: string;
  authorRole: string;
  sentAt?: string; // Datetime when dispatched to audience
  closedAt?: string; // Datetime when poll closed (manual or deadline)
  createdAt: string;
  updatedAt: string;
}

export interface VoteHistoryEntry {
  id: string;
  timestamp: string; // ISO datetime
  selectedOptionIds: string[];
  selectedOptionTitles: string[];
  voterName?: string;
}

export interface StudentVoterRecord {
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  classId: string;
  className: string;
  hasVoted: boolean;
  selectedOptionIds?: string[];
  selectedOptionTitles?: string[];
  lastVotedAt?: string;
  voteHistory: VoteHistoryEntry[];
}

export interface PollSummaryKPI {
  totalPolls: number;
  activePollsCount: number; // da_gui
  draftPollsCount: number; // da_tao
  closedPollsCount: number; // da_dong
  totalVotesCast: number;
}

export interface PollFilterState {
  status: 'all' | PollStatus;
  classId: 'all' | string;
  searchQuery: string;
}

export interface CreatePollPayload {
  title: string;
  description?: string;
  deadline: string;
  imageUrl?: string;
  options: string[]; // Minimum 2 option titles
  config: PollConfig;
}

export interface UpdatePollPayload extends Partial<CreatePollPayload> {
  id: string;
}

export interface SendPollPayload {
  pollId: string;
  audienceScope: PollAudienceScope;
  targetClassIds?: string[];
  targetClassNames?: string[];
}

export interface CastVotePayload {
  pollId: string;
  studentId: string;
  selectedOptionIds: string[];
  voterName?: string;
}
