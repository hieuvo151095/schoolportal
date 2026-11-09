import React, { useState } from 'react';
import { ActivityPost } from '../../../types/activity';
import { Icon, Avatar, StatusTag, Button, IconButton } from '@/components/ds';

interface ActivityFeedProps {
  posts: ActivityPost[];
  onToggleLike: (postId: string) => void;
  onTogglePin: (postId: string) => void;
  onReplacePin?: (postId: string) => void;
  onApprove: (postId: string) => void;
  onDelete: (postId: string) => void;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  posts,
  onToggleLike,
  onTogglePin,
  onReplacePin,
  onApprove,
  onDelete,
}) => {
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);
  const [activeMenuPostId, setActiveMenuPostId] = useState<string | null>(null);
  const [pinConflict, setPinConflict] = useState<{
    currentPinned: ActivityPost;
    targetPost: ActivityPost;
  } | null>(null);

  const handleTriggerPin = (post: ActivityPost) => {
    if (post.isPinned) {
      onTogglePin(post.id);
      return;
    }

    const existingPinned = posts.find((p) => p.isPinned && p.id !== post.id);
    if (existingPinned) {
      setPinConflict({ currentPinned: existingPinned, targetPost: post });
    } else {
      onTogglePin(post.id);
    }
  };

  const formatTimestamp = (isoDate: string) => {
    try {
      const date = new Date(isoDate);
      return date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
      });
    } catch {
      return isoDate;
    }
  };

  // Content renderer with highlighted @mentions (full student names) and #hashtags
  const renderFormattedContent = (content: string) => {
    const tokens = content.split(/(@[A-ZÀ-Ỹa-zà-ỹ0-9_]+(?:\s+[A-ZÀ-Ỹ][a-zà-ỹ0-9_]*)*|#[A-ZÀ-Ỹa-zà-ỹ0-9_]+)/g);
    return tokens.map((token, index) => {
      if (token.startsWith('@')) {
        return (
          <span
            key={index}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              color: 'var(--eco-blue-strong)',
              fontWeight: 700,
              background: 'var(--semantic-info-soft)',
              border: '1px solid var(--border-info-soft)',
              padding: '1px 6px',
              borderRadius: 'var(--radius-4)',
              fontSize: '12px',
              margin: '0 2px',
              cursor: 'pointer',
            }}
          >
            {token}
          </span>
        );
      }
      if (token.startsWith('#')) {
        return (
          <span
            key={index}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              color: 'var(--semantic-warning-strong)',
              fontWeight: 600,
              background: 'var(--semantic-warning-soft)',
              border: '1px solid var(--border-warning-soft)',
              padding: '1px 6px',
              borderRadius: 'var(--radius-4)',
              fontSize: '12px',
              margin: '0 2px',
              cursor: 'pointer',
            }}
          >
            {token}
          </span>
        );
      }
      return token;
    });
  };

  if (posts.length === 0) {
    return (
      <div
        className="ecomd-table-card"
        style={{ padding: 'var(--space-48) var(--space-20)', textAlign: 'center' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-8)' }}>
          <Icon name="search" size={32} color="var(--text-muted)" />
          <span className="title-md" style={{ color: 'var(--text-heading)' }}>
            Không tìm thấy hoạt động nào
          </span>
          <span className="body-xs" style={{ color: 'var(--text-subtle)', maxWidth: '400px' }}>
            Không có hoạt động nào phù hợp với bộ lọc hoặc từ khóa tìm kiếm của bạn. Hãy thử thay đổi bộ lọc hoặc đăng hoạt động mới.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
      {posts.map((post) => {
        const isApproved = post.status === 'approved';

        return (
          <div
            key={post.id}
            className="ecomd-table-card"
            style={{
              border: post.isPinned
                ? '1px solid var(--eco-yellow-strong)'
                : '1px solid var(--border-default)',
              boxShadow: post.isPinned ? '0 0 0 1px var(--eco-yellow-strong)' : undefined,
              overflow: 'visible',
            }}
          >
            {/* Pinned banner if post is pinned (BR07) */}
            {post.isPinned && (
              <div
                style={{
                  background: 'var(--semantic-warning-soft)',
                  color: 'var(--semantic-warning-strong)',
                  padding: 'var(--space-8) var(--space-20)',
                  borderTopLeftRadius: 'var(--radius-12)',
                  borderTopRightRadius: 'var(--radius-12)',
                  fontSize: '12px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid var(--border-warning-soft)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Icon name="book-bookmark" size={14} color="var(--semantic-warning-strong)" />
                  <span>Bài viết đã ghim đầu trang lớp học</span>
                </div>
                <button
                  type="button"
                  onClick={() => onTogglePin(post.id)}
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--semantic-warning-strong)',
                    background: 'transparent',
                    border: 0,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                >
                  Bỏ ghim
                </button>
              </div>
            )}

            <div className="p-3.5 sm:p-5">
              {/* Header Row */}
              <div className="flex items-start justify-between gap-2.5 sm:gap-3">
                <div className="flex items-start gap-2.5 sm:gap-3 min-w-0 flex-1">
                  <Avatar
                    src={post.authorAvatarUrl}
                    name={post.authorName}
                    size="md"
                    className="shrink-0 mt-0.5"
                  />
                  <div className="min-w-0 flex-1">
                    {/* Row 1: Tên người đăng nằm trên 1 hàng riêng biệt */}
                    <div className="body-sm-bold text-[var(--text-heading)] leading-snug">
                      {post.authorName}
                    </div>

                    {/* Row 2: Thông tin lớp, bộ môn/vai trò và thời gian cùng hàng dưới tên người đăng */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-1 text-xs text-[var(--text-subtle)] leading-normal">
                      <span
                        className="whitespace-nowrap font-semibold text-[11px] px-1.5 py-0.5 rounded shrink-0"
                        style={{
                          color: 'var(--eco-blue-strong)',
                          background: 'var(--semantic-info-soft)',
                        }}
                      >
                        {post.scopeLabel || (post.audienceScope === 'whole_school' ? 'Toàn trường' : 'Lớp 1A1')}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span
                        className="whitespace-nowrap font-medium text-[11px] px-1.5 py-0.5 rounded shrink-0"
                        style={{
                          background: 'var(--bg-muted)',
                          color: 'var(--text-body)',
                        }}
                      >
                        {post.authorRole}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="whitespace-nowrap text-[11px] text-[var(--text-subtle)]" suppressHydrationWarning>
                        {formatTimestamp(post.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right badges & menu */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  {/* Status Badge (BR06) */}
                  {isApproved ? (
                    <StatusTag tone="success" label="Đã duyệt" icon />
                  ) : (
                    <StatusTag tone="warning" label="Chờ duyệt" icon />
                  )}

                  {/* Actions Dropdown Button */}
                  <div style={{ position: 'relative' }}>
                    <IconButton
                      icon="ellipsis"
                      label="Tùy chọn bài viết"
                      size="sm"
                      onClick={() => setActiveMenuPostId(activeMenuPostId === post.id ? null : post.id)}
                    />

                    {/* Popover Menu */}
                    {activeMenuPostId === post.id && (
                      <div
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: '100%',
                          marginTop: '4px',
                          width: '180px',
                          background: 'var(--bg-surface)',
                          border: '1px solid var(--border-default)',
                          borderRadius: 'var(--radius-8)',
                          boxShadow: 'var(--shadow-lg)',
                          padding: '4px',
                          zIndex: 30,
                        }}
                      >
                        {!isApproved && (
                          <button
                            type="button"
                            onClick={() => {
                              onApprove(post.id);
                              setActiveMenuPostId(null);
                            }}
                            style={{
                              width: '100%',
                              textAlign: 'left',
                              padding: '8px 12px',
                              fontSize: '12px',
                              fontWeight: 600,
                              color: 'var(--semantic-success-strong)',
                              background: 'transparent',
                              border: 0,
                              borderRadius: 'var(--radius-4)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              cursor: 'pointer',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--semantic-success-soft)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            <Icon name="check" size={14} color="var(--semantic-success-strong)" />
                            <span>Phê duyệt bài</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            handleTriggerPin(post);
                            setActiveMenuPostId(null);
                          }}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '8px 12px',
                            fontSize: '12px',
                            color: 'var(--text-body)',
                            background: 'transparent',
                            border: 0,
                            borderRadius: 'var(--radius-4)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-subtle)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          <Icon name="book-bookmark" size={14} color="var(--eco-yellow-strong)" />
                          <span>{post.isPinned ? 'Bỏ ghim bài viết' : 'Ghim lên đầu'}</span>
                        </button>
                        <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '4px 0' }} />
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('Bạn có chắc chắn muốn xóa hoạt động này không?')) {
                              onDelete(post.id);
                            }
                            setActiveMenuPostId(null);
                          }}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '8px 12px',
                            fontSize: '12px',
                            color: 'var(--semantic-danger-strong)',
                            background: 'transparent',
                            border: 0,
                            borderRadius: 'var(--radius-4)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--semantic-danger-soft)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          <Icon name="trash" size={14} color="var(--semantic-danger-strong)" />
                          <span>Xóa hoạt động</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div
                style={{
                  marginTop: 'var(--space-12)',
                  fontSize: '14px',
                  color: 'var(--text-body)',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                  overflowWrap: 'anywhere',
                }}
              >
                {renderFormattedContent(post.content)}
              </div>

              {/* Media Gallery Grid (BR05) */}
              {post.media && post.media.length > 0 && (
                <div
                  style={{
                    marginTop: 'var(--space-12)',
                    borderRadius: 'var(--radius-8)',
                    overflow: 'hidden',
                    border: '1px solid var(--border-default)',
                  }}
                >
                  {post.media.length === 1 && (
                    <div
                      style={{ cursor: 'pointer', maxHeight: '380px', overflow: 'hidden', background: '#000' }}
                      onClick={() => setLightboxImageUrl(post.media[0].url)}
                    >
                      <img
                        src={post.media[0].url}
                        alt="Ảnh hoạt động"
                        style={{ width: '100%', height: 'auto', maxHeight: '380px', objectFit: 'cover' }}
                      />
                    </div>
                  )}

                  {post.media.length === 2 && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', background: 'var(--bg-muted)' }}>
                      {post.media.map((img) => (
                        <div
                          key={img.id}
                          style={{ aspectRatio: '4/3', cursor: 'pointer', overflow: 'hidden' }}
                          onClick={() => setLightboxImageUrl(img.url)}
                        >
                          <img
                            src={img.url}
                            alt="Ảnh hoạt động"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {post.media.length === 3 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px', background: 'var(--bg-muted)' }}>
                      {post.media.map((img) => (
                        <div
                          key={img.id}
                          style={{ aspectRatio: '1', cursor: 'pointer', overflow: 'hidden' }}
                          onClick={() => setLightboxImageUrl(img.url)}
                        >
                          <img
                            src={img.url}
                            alt="Ảnh hoạt động"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {post.media.length >= 4 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px', background: 'var(--bg-muted)' }}>
                      {post.media.slice(0, 4).map((img, idx) => (
                        <div
                          key={img.id}
                          style={{ aspectRatio: '1', position: 'relative', cursor: 'pointer', overflow: 'hidden' }}
                          onClick={() => setLightboxImageUrl(img.url)}
                        >
                          <img
                            src={img.url}
                            alt="Ảnh hoạt động"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          {idx === 3 && post.media.length > 4 && (
                            <div
                              style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'rgba(0,0,0,0.6)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontWeight: 700,
                                fontSize: '18px',
                              }}
                            >
                              +{post.media.length - 4}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Quick approve callout banner if status is 'cho_duyet' */}
              {!isApproved && (
                <div
                  style={{
                    marginTop: 'var(--space-12)',
                    background: 'var(--semantic-warning-soft)',
                    border: '1px solid var(--border-warning-soft)',
                    borderRadius: 'var(--radius-8)',
                    padding: 'var(--space-10) var(--space-16)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 'var(--space-12)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--semantic-warning-strong)' }}>
                    <Icon name="clock" size={14} color="var(--semantic-warning-strong)" />
                    <span>Bài viết đang chờ phê duyệt trước khi phụ huynh có thể nhìn thấy trên ứng dụng.</span>
                  </div>
                  <Button
                    variant="primary"
                    icon="check"
                    size="sm"
                    onClick={() => onApprove(post.id)}
                  >
                    Duyệt ngay
                  </Button>
                </div>
              )}

              {/* Interaction Counters Bar (BR04) */}
              <div
                style={{
                  marginTop: 'var(--space-16)',
                  paddingTop: 'var(--space-12)',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '12px',
                  color: 'var(--text-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-20)' }}>
                  {/* Like Button */}
                  <button
                    type="button"
                    onClick={() => onToggleLike(post.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'transparent',
                      border: 0,
                      color: post.isLikedByCurrentUser ? 'var(--semantic-danger)' : 'var(--text-subtle)',
                      fontWeight: post.isLikedByCurrentUser ? 700 : 500,
                      cursor: 'pointer',
                    }}
                  >
                    <Icon
                      name="heart"
                      size={14}
                      color={post.isLikedByCurrentUser ? 'var(--semantic-danger)' : 'var(--text-subtle)'}
                    />
                    <span>{post.likesCount}</span>
                  </button>

                  {/* Views Counter */}
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Icon name="eye" size={14} color="var(--text-muted)" />
                    <span>{post.viewsCount} lượt xem</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Lightbox Modal */}
      {lightboxImageUrl && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-16)',
          }}
          onClick={() => setLightboxImageUrl(null)}
        >
          <div style={{ position: 'relative', maxWidth: '900px', maxHeight: '90vh' }}>
            <button
              type="button"
              onClick={() => setLightboxImageUrl(null)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: 0,
                background: 'transparent',
                border: 0,
                color: '#fff',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              <Icon name="xmark" size={24} color="#fff" />
            </button>
            <img
              src={lightboxImageUrl}
              alt="Chi tiết ảnh hoạt động"
              style={{ width: 'auto', height: 'auto', maxHeight: '85vh', maxWidth: '100%', objectFit: 'contain', borderRadius: 'var(--radius-8)' }}
            />
          </div>
        </div>
      )}

      {/* Pinned Post Conflict Confirmation Modal */}
      {pinConflict && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-16)',
          }}
        >
          <div
            className="ecomd-table-card"
            style={{ maxWidth: '440px', width: '100%', padding: 'var(--space-24)', borderRadius: 'var(--radius-16)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)', marginBottom: 'var(--space-16)' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-8)',
                  background: 'var(--semantic-warning-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="book-bookmark" size={18} color="var(--semantic-warning-strong)" />
              </div>
              <div>
                <h3 className="title-md" style={{ color: 'var(--text-heading)' }}>
                  Thay đổi bài viết ghim
                </h3>
                <p className="body-xs" style={{ color: 'var(--text-subtle)' }}>
                  Chỉ cho phép ghim tối đa 1 bài viết cùng lúc
                </p>
              </div>
            </div>

            <p className="body-xs" style={{ color: 'var(--text-body)', lineHeight: 1.5 }}>
              Hiện tại bài viết của <strong>{pinConflict.currentPinned.authorName}</strong> đang được ghim ở đầu trang:
            </p>

            <div
              style={{
                margin: 'var(--space-12) 0',
                padding: 'var(--space-12)',
                background: 'var(--semantic-warning-soft)',
                borderRadius: 'var(--radius-8)',
                border: '1px solid var(--border-warning-soft)',
                fontSize: '12px',
                color: 'var(--text-body)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--semantic-warning-strong)', marginBottom: '4px' }}>
                <Icon name="book-bookmark" size={12} color="var(--semantic-warning-strong)" />
                <span>Bài viết đang ghim hiện tại:</span>
              </div>
              <p style={{ fontStyle: 'italic', margin: 0 }}>
                &ldquo;{pinConflict.currentPinned.content}&rdquo;
              </p>
            </div>

            <p className="body-xs" style={{ color: 'var(--text-body)' }}>
              Bạn có đồng ý <em>bỏ ghim bài viết trên</em> để ghim bài viết mới này lên đầu trang không?
            </p>

            <div style={{ marginTop: 'var(--space-20)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 'var(--space-8)' }}>
              <Button variant="secondary" onClick={() => setPinConflict(null)}>
                Hủy bỏ
              </Button>
              <Button
                variant="primary"
                icon="book-bookmark"
                onClick={() => {
                  if (onReplacePin) {
                    onReplacePin(pinConflict.targetPost.id);
                  } else {
                    onTogglePin(pinConflict.targetPost.id);
                  }
                  setPinConflict(null);
                }}
              >
                Đồng ý & Ghim bài mới
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
