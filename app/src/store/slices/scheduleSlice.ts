import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  AcademicSemester,
  ScheduleFilterCriteria,
  SubjectOption,
  Timetable,
} from '../../types/schedule';
import {
  INITIAL_TIMETABLES,
  mockClasses,
  mockSemesters,
  mockSubjects,
  mockTimetables,
} from '../../services/mockScheduleData';
import {
  cloneTimetableStructure,
  recordSendHistory,
} from '../../utils/scheduleValidation';

export interface ScheduleState {
  timetables: Timetable[];
  semesters: AcademicSemester[];
  subjects: SubjectOption[];
  classes: typeof mockClasses;
  selectedScheduleId: string | null;
  filterCriteria: ScheduleFilterCriteria;
  isFilterDrawerOpen: boolean;
  isSendHistoryModalOpen: boolean;
  isCloneModalOpen: boolean;
  isUploadModalOpen: boolean;
  activeModalScheduleId: string | null;
}

const initialFilterCriteria: ScheduleFilterCriteria = {
  searchQuery: '',
  classId: 'all',
  semesterId: 'all',
  academicYear: 'all',
  type: 'all',
  status: 'all',
};

const initialState: ScheduleState = {
  timetables: INITIAL_TIMETABLES,
  semesters: mockSemesters,
  subjects: mockSubjects,
  classes: mockClasses,
  selectedScheduleId: 'sch-001',
  filterCriteria: initialFilterCriteria,
  isFilterDrawerOpen: false,
  isSendHistoryModalOpen: false,
  isCloneModalOpen: false,
  isUploadModalOpen: false,
  activeModalScheduleId: null,
};

export const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    setFilterCriteria: (
      state,
      action: PayloadAction<Partial<ScheduleFilterCriteria>>
    ) => {
      state.filterCriteria = { ...state.filterCriteria, ...action.payload };
    },
    resetFilters: (state) => {
      state.filterCriteria = initialFilterCriteria;
    },
    setSelectedScheduleId: (state, action: PayloadAction<string | null>) => {
      state.selectedScheduleId = action.payload;
    },
    setFilterDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.isFilterDrawerOpen = action.payload;
    },
    setSendHistoryModalOpen: (
      state,
      action: PayloadAction<{ isOpen: boolean; scheduleId?: string }>
    ) => {
      state.isSendHistoryModalOpen = action.payload.isOpen;
      if (action.payload.scheduleId) {
        state.activeModalScheduleId = action.payload.scheduleId;
      }
    },
    setCloneModalOpen: (
      state,
      action: PayloadAction<{ isOpen: boolean; scheduleId?: string }>
    ) => {
      state.isCloneModalOpen = action.payload.isOpen;
      if (action.payload.scheduleId) {
        state.activeModalScheduleId = action.payload.scheduleId;
      }
    },
    setUploadModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isUploadModalOpen = action.payload;
    },
    createSchedule: (
      state,
      action: PayloadAction<
        Omit<Timetable, 'id' | 'createdAt' | 'updatedAt' | 'sendHistory'> & {
          autoSend?: boolean;
          senderName?: string;
        }
      >
    ) => {
      const now = new Date().toISOString();
      const newId = `sch-${Date.now()}`;
      const { autoSend, senderName, ...scheduleData } = action.payload;

      let newTimetable: Timetable = {
        ...scheduleData,
        id: newId,
        createdAt: now,
        updatedAt: now,
        sendHistory: [],
        status: autoSend ? 'published' : scheduleData.status || 'draft',
        publishedAt: autoSend ? now : undefined,
      };

      if (autoSend) {
        newTimetable = recordSendHistory(
          newTimetable,
          senderName || 'Ban Giám Hiệu',
          'Quản trị viên',
          'all',
          32,
          'Phát hành thời khóa biểu mới'
        );
      }

      state.timetables.unshift(newTimetable);
      state.selectedScheduleId = newId;
    },
    updateSchedule: (
      state,
      action: PayloadAction<{
        id: string;
        changes: Partial<Timetable>;
        andSend?: boolean;
        senderName?: string;
        note?: string;
      }>
    ) => {
      const { id, changes, andSend, senderName, note } = action.payload;
      const index = state.timetables.findIndex((t) => t.id === id);
      if (index === -1) return;

      const current = state.timetables[index];
      const now = new Date().toISOString();

      let updated: Timetable = {
        ...current,
        ...changes,
        updatedAt: now,
      };

      // If user clicked "Cập nhật và gửi" (BR06, BR08)
      if (andSend) {
        updated = recordSendHistory(
          updated,
          senderName || 'Cô Lan Hương (GVCN)',
          'Giáo viên chủ nhiệm',
          'all',
          32,
          note || 'Cập nhật và phát hành thời khóa biểu'
        );
      }

      state.timetables[index] = updated;
    },
    deleteSchedule: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.timetables = state.timetables.filter((t) => t.id !== id);
      if (state.selectedScheduleId === id) {
        state.selectedScheduleId = state.timetables[0]?.id || null;
      }
    },
    cloneSchedule: (
      state,
      action: PayloadAction<{
        sourceId: string;
        targetClassId: string;
        targetClassName: string;
        targetSemesterId: string;
        targetSemesterName: string;
        customTitle?: string;
      }>
    ) => {
      const {
        sourceId,
        targetClassId,
        targetClassName,
        targetSemesterId,
        targetSemesterName,
        customTitle,
      } = action.payload;

      const source = state.timetables.find((t) => t.id === sourceId);
      if (!source) return;

      const cloned = cloneTimetableStructure(
        source,
        targetClassId,
        targetClassName,
        targetSemesterId,
        targetSemesterName,
        customTitle
      );

      state.timetables.unshift(cloned);
      state.selectedScheduleId = cloned.id;
      state.isCloneModalOpen = false;
    },
    sendScheduleNotification: (
      state,
      action: PayloadAction<{
        scheduleId: string;
        senderName: string;
        senderRole: string;
        channel?: 'all' | 'app_notification' | 'zalo' | 'sms';
        recipientsCount?: number;
        note?: string;
      }>
    ) => {
      const {
        scheduleId,
        senderName,
        senderRole,
        channel,
        recipientsCount,
        note,
      } = action.payload;
      const index = state.timetables.findIndex((t) => t.id === scheduleId);
      if (index === -1) return;

      const updated = recordSendHistory(
        state.timetables[index],
        senderName,
        senderRole,
        channel,
        recipientsCount,
        note
      );

      state.timetables[index] = updated;
    },
  },
});

export const {
  setFilterCriteria,
  resetFilters,
  setSelectedScheduleId,
  setFilterDrawerOpen,
  setSendHistoryModalOpen,
  setCloneModalOpen,
  setUploadModalOpen,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  cloneSchedule,
  sendScheduleNotification,
} = scheduleSlice.actions;

export default scheduleSlice.reducer;
