import React, { useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  createPost,
  togglePinPost,
  pinPostReplace,
  toggleLikePost,
  approvePost,
  deletePost,
  setStatusFilter,
  setSearchQuery,
} from '@/store/slices/activitySlice';
import PortalLayout from '@/components/layout/PortalLayout';
import { ActivityToolbar } from '@/modules/operations/activity/ActivityToolbar';
import { ActivityComposer } from '@/modules/operations/activity/ActivityComposer';
import { ActivityFeed } from '@/modules/operations/activity/ActivityFeed';
import { LessonContextPanel } from '@/modules/operations/activity/LessonContextPanel';
import { filterActivityPosts } from '@/utils/activityValidation';
import { AudienceScope, ActivityMedia } from '@/types/activity';
import { CLASSES_LIST, CLASS_STUDENTS_REGISTRY } from '@/services/mockAttendanceData';
import { PageHeader } from '@/components/ds';

export default function ActivityPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const classId = (router.query.classId as string) || 'lop-1a1';

  const dispatch = useAppDispatch();
  const {
    posts,
    statusFilter,
    searchQuery,
    lessons,
    sentenceTemplates,
    mentionableStudents,
  } = useAppSelector((state) => state.activity);

  const currentClassInfo = useMemo(() => {
    return CLASSES_LIST.find((c) => c.id === classId) || CLASSES_LIST[0];
  }, [classId]);

  // Provide class student roster for @ mention autocomplete
  const currentMentionableStudents = useMemo(() => {
    const roster = CLASS_STUDENTS_REGISTRY[classId] || CLASS_STUDENTS_REGISTRY['lop-1a1'] || [];
    if (roster.length > 0) {
      return roster.map((s) => ({
        id: s.studentCode || s.studentId,
        name: s.fullName,
        avatarUrl:
          s.avatarUrl ||
          'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=100&auto=format&fit=crop&q=80',
      }));
    }
    return mentionableStudents;
  }, [classId, mentionableStudents]);

  // Filtered and sorted posts according to BR07 (pinned first) & BR09 (class & status)
  const filteredPosts = useMemo(() => {
    return filterActivityPosts(posts, classId, statusFilter, searchQuery);
  }, [posts, classId, statusFilter, searchQuery]);

  // Breakdown counts
  const totalCount = useMemo(() => {
    return posts.filter((p) => p.classId === classId || p.audienceScope === 'whole_school').length;
  }, [posts, classId]);

  const approvedCount = useMemo(() => {
    return posts.filter(
      (p) => (p.classId === classId || p.audienceScope === 'whole_school') && p.status === 'approved'
    ).length;
  }, [posts, classId]);

  const pendingCount = useMemo(() => {
    return posts.filter(
      (p) => (p.classId === classId || p.audienceScope === 'whole_school') && p.status === 'cho_duyet'
    ).length;
  }, [posts, classId]);

  const pinnedCount = useMemo(() => {
    return posts.filter(
      (p) => (p.classId === classId || p.audienceScope === 'whole_school') && p.isPinned
    ).length;
  }, [posts, classId]);

  const handleCreatePost = (postData: {
    content: string;
    audienceScope: AudienceScope;
    media: ActivityMedia[];
    taggedStudents: string[];
    taggedLessons: string[];
  }) => {
    dispatch(
      createPost({
        classId,
        authorId: 'tch-001',
        authorName: 'Cô Nguyễn Thu Mai',
        authorAvatarUrl:
          'https://images.unsplash.com/photo-1544717305-2782549b5136?w=120&auto=format&fit=crop&q=80',
        authorRole: 'Giáo viên chủ nhiệm',
        content: postData.content,
        audienceScope: postData.audienceScope,
        scopeLabel: postData.audienceScope === 'whole_school' ? 'Toàn trường' : 'Lớp 1A1',
        media: postData.media,
        taggedStudents: postData.taggedStudents,
        taggedLessons: postData.taggedLessons,
      })
    );
  };

  return (
    <PortalLayout schoolCode={schoolCode}>
      <Head>
        <title>Hoạt động Lớp học | School Operating Portal</title>
        <meta
          name="description"
          content="Nhật ký hoạt động lớp học, chia sẻ hình ảnh và thông báo cho phụ huynh - ECO School Portal"
        />
      </Head>

      <div className="space-y-5">
        {/* Page Header */}
        <PageHeader
          title={`Hoạt Động ${currentClassInfo?.name || 'Lớp 1A1'}`}
          description="Dòng thời gian hoạt động, bài học trong ngày và chia sẻ hình ảnh với phụ huynh"
        />

        {/* Toolbar & Filter Bar */}
        <ActivityToolbar
          statusFilter={statusFilter}
          onStatusFilterChange={(s) => dispatch(setStatusFilter(s))}
          searchQuery={searchQuery}
          onSearchQueryChange={(q) => dispatch(setSearchQuery(q))}
          totalCount={totalCount}
          approvedCount={approvedCount}
          pendingCount={pendingCount}
          pinnedCount={pinnedCount}
        />

        {/* Two-column layout: Feed & Composer (left) + Context Panel (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main Feed Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Rich Composer */}
            <ActivityComposer
              currentClassId={classId}
              classNameLabel={currentClassInfo?.name || 'Lớp 1A1'}
              sentenceTemplates={sentenceTemplates}
              mentionableStudents={currentMentionableStudents}
              onSubmitPost={handleCreatePost}
            />

            {/* Activity Feed List */}
            <ActivityFeed
              posts={filteredPosts}
              onToggleLike={(id) => dispatch(toggleLikePost(id))}
              onTogglePin={(id) => dispatch(togglePinPost(id))}
              onReplacePin={(id) => dispatch(pinPostReplace(id))}
              onApprove={(id) => dispatch(approvePost(id))}
              onDelete={(id) => dispatch(deletePost(id))}
            />
          </div>

          {/* Right Sidebar: BR08 Lesson Info & Templates */}
          <div className="lg:col-span-1 sticky top-20">
            <LessonContextPanel
              lessons={lessons}
              sentenceTemplates={sentenceTemplates}
            />
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
