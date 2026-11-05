import React, { useState, useRef, useMemo } from 'react';
import { AudienceScope, ActivityMedia } from '../../../types/activity';
import {
  SentenceTemplate,
  MentionableStudent,
  MOCK_HASHTAGS,
} from '../../../services/mockActivityData';
import { validatePostContent } from '../../../utils/activityValidation';
import { Icon, Avatar, Button } from '@/components/ds';

interface ActivityComposerProps {
  currentClassId: string;
  classNameLabel?: string;
  sentenceTemplates: SentenceTemplate[];
  mentionableStudents: MentionableStudent[];
  onSubmitPost: (postData: {
    content: string;
    audienceScope: AudienceScope;
    media: ActivityMedia[];
    taggedStudents: string[];
    taggedLessons: string[];
  }) => void;
}

const SAMPLE_ACTIVITY_IMAGES = [
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
];

export const ActivityComposer: React.FC<ActivityComposerProps> = ({
  currentClassId,
  classNameLabel = 'Lớp 1A1',
  sentenceTemplates,
  mentionableStudents,
  onSubmitPost,
}) => {
  const [content, setContent] = useState('');
  const [audienceScope, setAudienceScope] = useState<AudienceScope>('current_class');
  const [mediaList, setMediaList] = useState<ActivityMedia[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState(false);

  // Inline @ mention autocomplete state
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionStartIndex, setMentionStartIndex] = useState<number>(-1);
  const [selectedMentionIndex, setSelectedMentionIndex] = useState<number>(0);

  // Popover menus
  const [activePopover, setActivePopover] = useState<'none' | 'student' | 'hashtag' | 'template'>('none');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Filter students for inline @ autocomplete
  const filteredMentionStudents = useMemo(() => {
    if (mentionQuery === null) return [];
    const q = mentionQuery.toLowerCase().trim();
    if (!q) return mentionableStudents;
    return mentionableStudents.filter((stu) =>
      stu.name.toLowerCase().includes(q)
    );
  }, [mentionQuery, mentionableStudents]);

  // Check mention trigger on text change or cursor movement
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    if (validationError) setValidationError(null);

    const cursorPos = e.target.selectionStart;
    const textBefore = val.slice(0, cursorPos);
    // Detect trigger: @ at start or preceded by whitespace, followed by up to 25 characters without linebreaks
    const match = textBefore.match(/(?:^|\s)@([a-zA-ZÀ-ỹ0-9_\s]{0,25})$/);
    if (match) {
      setMentionQuery(match[1]);
      const atIndex = textBefore.lastIndexOf('@');
      setMentionStartIndex(atIndex);
      setSelectedMentionIndex(0);
    } else {
      setMentionQuery(null);
      setMentionStartIndex(-1);
    }
  };

  // Keyboard navigation inside textarea for @ mention autocomplete
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (mentionQuery !== null && filteredMentionStudents.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedMentionIndex((prev) => (prev + 1) % filteredMentionStudents.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedMentionIndex((prev) =>
          prev <= 0 ? filteredMentionStudents.length - 1 : prev - 1
        );
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        const selected = filteredMentionStudents[selectedMentionIndex];
        if (selected) {
          handleSelectMentionStudent(selected);
        }
      } else if (e.key === 'Escape') {
        setMentionQuery(null);
        setMentionStartIndex(-1);
      }
    }
  };

  // Insert mention into textarea at current trigger position
  const handleSelectMentionStudent = (student: MentionableStudent) => {
    if (mentionStartIndex === -1) {
      insertText(`@${student.name}`);
      return;
    }

    const before = content.slice(0, mentionStartIndex);
    const after = content.slice(mentionStartIndex + (mentionQuery?.length || 0) + 1);
    const newContent = `${before}@${student.name} ${after}`;
    setContent(newContent);
    setMentionQuery(null);
    setMentionStartIndex(-1);

    setTimeout(() => {
      if (textareaRef.current) {
        const nextPos = before.length + student.name.length + 2;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(nextPos, nextPos);
      }
    }, 50);
  };

  const insertText = (textToInsert: string) => {
    setContent((prev) => {
      if (prev.endsWith(' ') || prev.length === 0) {
        return prev + textToInsert + ' ';
      }
      return prev + ' ' + textToInsert + ' ';
    });
    setActivePopover('none');
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  };

  const handleAddSampleImage = () => {
    const nextIndex = mediaList.length % SAMPLE_ACTIVITY_IMAGES.length;
    const newMedia: ActivityMedia = {
      id: `media-${Date.now()}-${mediaList.length}`,
      url: SAMPLE_ACTIVITY_IMAGES[nextIndex],
      type: 'image',
      caption: `Ảnh hoạt động ${mediaList.length + 1}`,
    };
    setMediaList((prev) => [...prev, newMedia]);
    setValidationError(null);
  };

  const handleRemoveMedia = (id: string) => {
    setMediaList((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // BR02 validation rule
    const validation = validatePostContent(content, mediaList.length);
    if (!validation.valid) {
      setValidationError(validation.error || 'Vui lòng nhập nội dung hoặc đính kèm ảnh.');
      return;
    }

    // Extract tagged students
    const taggedStudents = mentionableStudents
      .filter((s) => content.includes(`@${s.name}`))
      .map((s) => s.id);

    // Call submit
    onSubmitPost({
      content,
      audienceScope,
      media: mediaList,
      taggedStudents,
      taggedLessons: [],
    });

    // Reset composer state
    setContent('');
    setMediaList([]);
    setValidationError(null);
    setActivePopover('none');
    setMentionQuery(null);
    setMentionStartIndex(-1);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 4000);
  };

  return (
    <div className="ecomd-table-card" style={{ padding: 'var(--space-20)', position: 'relative' }}>
      {/* Header bar: Author & Scope selector (BR01) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-12)',
          paddingBottom: 'var(--space-16)',
          borderBottom: '1px solid var(--border-default)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)' }}>
          <Avatar
            src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=120&auto=format&fit=crop&q=80"
            name="Cô Nguyễn Thu Mai"
            size="md"
          />
          <div>
            <div className="body-sm-bold" style={{ color: 'var(--text-heading)' }}>Cô Nguyễn Thu Mai</div>
            <div className="body-xs" style={{ color: 'var(--text-subtle)' }}>Giáo viên chủ nhiệm</div>
          </div>
        </div>

        {/* BR01 Audience Scope Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
          <Icon name="users" size={14} color="var(--text-subtle)" />
          <select
            value={audienceScope}
            onChange={(e) => setAudienceScope(e.target.value as AudienceScope)}
            style={{
              fontSize: '12px',
              fontWeight: 600,
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-8)',
              padding: '6px 12px',
              color: 'var(--text-heading)',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="current_class">Phạm vi: {classNameLabel}</option>
            <option value="whole_school">Phạm vi: Toàn trường</option>
            <option value="custom_classes">Phạm vi: Khối 1 (Tất cả các lớp)</option>
          </select>
        </div>
      </div>

      {/* Composer Textarea */}
      <form onSubmit={handleSubmit} style={{ marginTop: 'var(--space-16)' }}>
        <div style={{ position: 'relative' }}>
          <textarea
            ref={textareaRef}
            rows={3}
            value={content}
            onChange={handleContentChange}
            onKeyDown={handleKeyDown}
            placeholder="Chia sẻ hoạt động lớp hôm nay... (Gõ @ để gắn thẻ học sinh, # môn học, $ chèn mẫu câu có sẵn)"
            style={{
              width: '100%',
              fontSize: '14px',
              color: 'var(--text-heading)',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-8)',
              padding: 'var(--space-12) var(--space-16)',
              outline: 'none',
              resize: 'none',
              lineHeight: 1.5,
              transition: 'border-color .15s',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--eco-blue-strong)';
              e.currentTarget.style.background = 'var(--bg-surface)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-default)';
              e.currentTarget.style.background = 'var(--bg-subtle)';
            }}
          />

          {/* Inline @ Mention Autocomplete Popover */}
          {mentionQuery !== null && (
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: '100%',
                marginTop: 'var(--space-6)',
                zIndex: 50,
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-12)',
                boxShadow: 'var(--shadow-lg)',
                padding: 'var(--space-10)',
                maxHeight: '240px',
                overflowY: 'auto',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: 'var(--space-8)',
                  marginBottom: 'var(--space-6)',
                  borderBottom: '1px solid var(--border-subtle)',
                  fontSize: '12px',
                  color: 'var(--text-subtle)',
                  fontWeight: 600,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--eco-blue-strong)' }}>
                  <Icon name="tag" size={12} color="var(--eco-blue-strong)" />
                  <span>Gợi ý nhắc tên học sinh ({filteredMentionStudents.length})</span>
                </div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Dùng ↑ ↓ và Enter để chọn</span>
              </div>

              {filteredMentionStudents.length === 0 ? (
                <div style={{ padding: 'var(--space-12)', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
                  Không tìm thấy học sinh nào phù hợp với &quot;{mentionQuery}&quot;
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {filteredMentionStudents.map((stu, index) => {
                    const isSelected = index === selectedMentionIndex;
                    return (
                      <button
                        key={stu.id}
                        type="button"
                        onMouseEnter={() => setSelectedMentionIndex(index)}
                        onClick={() => handleSelectMentionStudent(stu)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: 'var(--space-8) var(--space-12)',
                          borderRadius: 'var(--radius-8)',
                          textAlign: 'left',
                          background: isSelected ? 'var(--semantic-info-soft)' : 'transparent',
                          color: isSelected ? 'var(--eco-blue-strong)' : 'var(--text-heading)',
                          border: 0,
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-10)' }}>
                          <Avatar
                            src={stu.avatarUrl}
                            name={stu.name}
                            size="sm"
                          />
                          <div>
                            <div className="body-xs-bold">{stu.name}</div>
                            <div className="body-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{stu.id}</div>
                          </div>
                        </div>

                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-4)',
                            background: 'var(--bg-muted)',
                            border: '1px solid var(--border-default)',
                            color: 'var(--text-body)',
                          }}
                        >
                          @{stu.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Validation Error Alert */}
          {validationError && (
            <div
              style={{
                marginTop: 'var(--space-8)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-6)',
                fontSize: '12px',
                color: 'var(--semantic-danger-strong)',
                background: 'var(--semantic-danger-soft)',
                border: '1px solid var(--border-danger-soft)',
                padding: 'var(--space-8) var(--space-12)',
                borderRadius: 'var(--radius-8)',
              }}
            >
              <Icon name="circle-xmark" size={14} color="var(--semantic-danger-strong)" />
              <span>{validationError}</span>
            </div>
          )}
        </div>

        {/* Attached Media Preview (BR05) */}
        {mediaList.length > 0 && (
          <div
            style={{
              marginTop: 'var(--space-12)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: 'var(--space-10)',
            }}
          >
            {mediaList.map((m, idx) => (
              <div
                key={m.id}
                style={{
                  position: 'relative',
                  borderRadius: 'var(--radius-8)',
                  overflow: 'hidden',
                  border: '1px solid var(--border-default)',
                  aspectRatio: '16/10',
                  background: 'var(--bg-subtle)',
                }}
              >
                <img src={m.url} alt={`Ảnh đính kèm ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  type="button"
                  onClick={() => handleRemoveMedia(m.id)}
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    width: '24px',
                    height: '24px',
                    background: 'rgba(0,0,0,0.6)',
                    color: '#fff',
                    borderRadius: 'var(--radius-full)',
                    border: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  title="Xóa ảnh này"
                >
                  <Icon name="xmark" size={12} color="#fff" />
                </button>
                <div
                  style={{
                    position: 'absolute',
                    bottom: '6px',
                    left: '6px',
                    background: 'rgba(0,0,0,0.6)',
                    color: '#fff',
                    fontSize: '10px',
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-4)',
                  }}
                >
                  Ảnh {idx + 1}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Trigger Bar (BR03) & Action Row */}
        <div
          style={{
            marginTop: 'var(--space-16)',
            paddingTop: 'var(--space-12)',
            borderTop: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-12)',
          }}
        >
          {/* BR03 Trigger Shortcut Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-8)', position: 'relative' }}>
            {/* Student Mention Button */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setActivePopover(activePopover === 'student' ? 'none' : 'student')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-8)',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: activePopover === 'student' ? '1px solid var(--eco-blue-strong)' : '1px solid var(--border-default)',
                  background: activePopover === 'student' ? 'var(--semantic-info-soft)' : 'var(--bg-subtle)',
                  color: activePopover === 'student' ? 'var(--eco-blue-strong)' : 'var(--text-body)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <Icon name="users" size={12} color="var(--eco-blue-strong)" />
                <span>Học sinh</span>
              </button>

              {/* Student Popover */}
              {activePopover === 'student' && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '100%',
                    marginTop: '6px',
                    width: '240px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-12)',
                    boxShadow: 'var(--shadow-lg)',
                    padding: 'var(--space-8)',
                    zIndex: 40,
                  }}
                >
                  <div className="body-xs-bold" style={{ color: 'var(--text-subtle)', padding: '4px 8px', textTransform: 'uppercase' }}>
                    Gắn thẻ học sinh
                  </div>
                  <div style={{ maxHeight: '190px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {mentionableStudents.map((stu) => (
                      <button
                        key={stu.id}
                        type="button"
                        onClick={() => insertText(`@${stu.name}`)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-8)',
                          padding: '6px 8px',
                          borderRadius: 'var(--radius-6)',
                          background: 'transparent',
                          border: 0,
                          textAlign: 'left',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-subtle)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <Avatar src={stu.avatarUrl} name={stu.name} size="xs" />
                        <span className="body-xs-semibold" style={{ color: 'var(--text-heading)' }}>{stu.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Hashtag / Subject Button */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setActivePopover(activePopover === 'hashtag' ? 'none' : 'hashtag')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-8)',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: activePopover === 'hashtag' ? '1px solid var(--eco-blue-strong)' : '1px solid var(--border-default)',
                  background: activePopover === 'hashtag' ? 'var(--semantic-info-soft)' : 'var(--bg-subtle)',
                  color: activePopover === 'hashtag' ? 'var(--eco-blue-strong)' : 'var(--text-body)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <Icon name="tag" size={12} color="var(--semantic-warning)" />
                <span>Môn học / Chủ đề</span>
              </button>

              {/* Hashtag Popover */}
              {activePopover === 'hashtag' && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '100%',
                    marginTop: '6px',
                    width: '230px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-12)',
                    boxShadow: 'var(--shadow-lg)',
                    padding: 'var(--space-8)',
                    zIndex: 40,
                  }}
                >
                  <div className="body-xs-bold" style={{ color: 'var(--text-subtle)', padding: '4px 8px', textTransform: 'uppercase' }}>
                    Chủ đề môn học
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', padding: '4px', maxHeight: '190px', overflowY: 'auto' }}>
                    {MOCK_HASHTAGS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => insertText(tag)}
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: 'var(--eco-blue-strong)',
                          background: 'var(--semantic-info-soft)',
                          border: '1px solid var(--border-info-soft)',
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-6)',
                          cursor: 'pointer',
                        }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Template Sentence Button */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setActivePopover(activePopover === 'template' ? 'none' : 'template')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-8)',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: activePopover === 'template' ? '1px solid var(--eco-blue-strong)' : '1px solid var(--border-default)',
                  background: activePopover === 'template' ? 'var(--semantic-info-soft)' : 'var(--bg-subtle)',
                  color: activePopover === 'template' ? 'var(--eco-blue-strong)' : 'var(--text-body)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <Icon name="quote-left" size={12} color="var(--semantic-success)" />
                <span>Mẫu câu nhanh ($)</span>
              </button>

              {/* Template Popover */}
              {activePopover === 'template' && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '100%',
                    marginTop: '6px',
                    width: '300px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-12)',
                    boxShadow: 'var(--shadow-lg)',
                    padding: 'var(--space-8)',
                    zIndex: 40,
                  }}
                >
                  <div className="body-xs-bold" style={{ color: 'var(--text-subtle)', padding: '4px 8px', textTransform: 'uppercase' }}>
                    Mẫu câu soạn sẵn
                  </div>
                  <div style={{ maxHeight: '240px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {sentenceTemplates.map((tpl) => (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => insertText(tpl.content)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: 'var(--space-8)',
                          borderRadius: 'var(--radius-8)',
                          background: 'transparent',
                          border: 0,
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-subtle)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <div className="body-xs-bold" style={{ color: 'var(--text-heading)' }}>{tpl.title}</div>
                        <div className="body-xs" style={{ color: 'var(--text-subtle)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginTop: '2px' }}>
                          {tpl.content}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Add Photo Button */}
            <button
              type="button"
              onClick={handleAddSampleImage}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-8)',
                fontSize: '12px',
                fontWeight: 600,
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-body)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              <Icon name="image" size={12} color="var(--semantic-danger)" />
              <span>Thêm ảnh ({mediaList.length})</span>
            </button>
          </div>

          {/* Submit Action & Queue Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)' }}>
            <div className="body-xs" style={{ color: 'var(--text-subtle)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Icon name="info" size={12} color="var(--text-subtle)" />
              <span>Duyệt trước khi gửi PH</span>
            </div>

            <Button
              variant="primary"
              icon="paper-plane"
              type="submit"
            >
              Đăng hoạt động
            </Button>
          </div>
        </div>
      </form>

      {/* Success Notification Toast */}
      {successToast && (
        <div
          style={{
            position: 'absolute',
            bottom: '-48px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--semantic-success)',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 600,
            padding: '8px 16px',
            borderRadius: 'var(--radius-8)',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 50,
          }}
        >
          <Icon name="check" size={14} color="#fff" />
          <span>Đã đăng hoạt động! Bài viết đang ở hàng chờ duyệt (Chờ duyệt).</span>
        </div>
      )}
    </div>
  );
};

export default ActivityComposer;
