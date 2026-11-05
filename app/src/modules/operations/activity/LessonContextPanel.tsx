import React from 'react';
import { LessonRef } from '../../../types/activity';
import { SentenceTemplate } from '../../../services/mockActivityData';
import { Icon, Button } from '@/components/ds';

interface LessonContextPanelProps {
  lessons: LessonRef[];
  sentenceTemplates: SentenceTemplate[];
  onSelectTemplate?: (content: string) => void;
  onSelectLessonTag?: (tag: string) => void;
}

export const LessonContextPanel: React.FC<LessonContextPanelProps> = ({
  lessons,
  sentenceTemplates,
  onSelectTemplate,
  onSelectLessonTag,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
      {/* BR08: Today's Lessons Context Widget */}
      <div className="ecomd-table-card" style={{ padding: 'var(--space-16)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', marginBottom: 'var(--space-12)' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: 'var(--radius-6)',
              background: 'var(--semantic-info-soft)',
              color: 'var(--eco-blue-strong)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="book-open" size={14} color="var(--eco-blue-strong)" />
          </div>
          <span className="body-sm-bold" style={{ color: 'var(--text-heading)' }}>
            Thông tin Bài học hôm nay
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
          {lessons.slice(0, 2).map((lesson) => (
            <div
              key={lesson.id}
              style={{
                padding: 'var(--space-12)',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-8)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-8)' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--eco-blue-strong)',
                    background: 'var(--semantic-info-soft)',
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-4)',
                  }}
                >
                  {lesson.subject}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Icon name="calendar-days" size={10} color="var(--text-muted)" />
                  {lesson.date}
                </span>
              </div>

              <div className="body-xs-bold" style={{ color: 'var(--text-heading)', marginTop: '6px' }}>{lesson.title}</div>
              <div className="body-xs" style={{ color: 'var(--text-subtle)', marginTop: '2px' }}>{lesson.unit}</div>

              {/* Objectives */}
              <div style={{ marginTop: 'var(--space-8)', paddingTop: 'var(--space-8)', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Mục tiêu cần đạt:
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {lesson.objectives.map((obj, idx) => (
                    <li key={idx} style={{ fontSize: '12px', color: 'var(--text-body)', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                      <Icon name="check" size={12} color="var(--semantic-success)" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {onSelectLessonTag && (
                <div style={{ marginTop: 'var(--space-10)' }}>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon="tag"
                    onClick={() => onSelectLessonTag(`#${lesson.subject.replace(/\s+/g, '')}`)}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    Gắn thẻ môn học vào bài
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Quick Templates Widget */}
      <div className="ecomd-table-card" style={{ padding: 'var(--space-16)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', marginBottom: 'var(--space-12)' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: 'var(--radius-6)',
              background: 'var(--semantic-success-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="quote-left" size={14} color="var(--semantic-success)" />
          </div>
          <span className="body-sm-bold" style={{ color: 'var(--text-heading)' }}>
            Mẫu câu gợi ý ($)
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          {sentenceTemplates.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => onSelectTemplate && onSelectTemplate(tpl.content)}
              style={{
                padding: 'var(--space-10)',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-8)',
                cursor: 'pointer',
                transition: 'border-color .15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--eco-blue-strong)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-default)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="body-xs-bold" style={{ color: 'var(--text-heading)' }}>
                  {tpl.title}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {tpl.code}
                </span>
              </div>
              <p
                style={{
                  fontSize: '12px',
                  color: 'var(--text-subtle)',
                  marginTop: '4px',
                  marginBottom: 0,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: 1.4,
                }}
              >
                {tpl.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Teacher pedagogical guideline tip */}
      <div
        style={{
          background: 'var(--semantic-warning-soft)',
          border: '1px solid var(--border-warning-soft)',
          borderRadius: 'var(--radius-12)',
          padding: 'var(--space-16)',
          fontSize: '12px',
          color: 'var(--semantic-warning-strong)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, marginBottom: '4px' }}>
          <Icon name="info" size={14} color="var(--semantic-warning-strong)" />
          <span>Gợi ý truyền thông lớp học</span>
        </div>
        <p style={{ margin: 0, lineHeight: 1.5, color: 'var(--text-body)', fontSize: '12px' }}>
          Hình ảnh sinh động kết hợp lời khen ngợi cụ thể sẽ giúp phụ huynh an tâm và tăng mức độ tương tác với nhà trường lên 85%.
        </p>
      </div>
    </div>
  );
};

export default LessonContextPanel;
