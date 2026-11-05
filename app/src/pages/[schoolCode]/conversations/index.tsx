import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { useAppSelector, useAppDispatch } from '@/store';
import { setActiveConversation } from '@/store/slices/conversationSlice';
import { ConversationList } from '@/modules/operations/conversation/ConversationList';
import { ChatThread } from '@/modules/operations/conversation/ChatThread';
import { CreateConversationModal } from '@/modules/operations/conversation/CreateConversationModal';
import { ImportantMessagesModal } from '@/modules/operations/conversation/ImportantMessagesModal';
import { GroupDetailsModal } from '@/modules/operations/conversation/GroupDetailsModal';

const PageWrapper = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  min-height: 0;
  background: #f8fafc;
  overflow: hidden;
`;

export default function ConversationsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const schoolCode = (router.query.schoolCode as string) || 'demo';

  const { activeConversationId } = useAppSelector((state) => state.conversation);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isImportantModalOpen, setIsImportantModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <PortalLayout schoolCode={schoolCode} noPadding>
      <Head>
        <title>Trao Đổi & Nhắn Tin Phụ Huynh | ECO School Portal</title>
        <meta
          name="description"
          content="Kênh nhắn tin và trao đổi trực tiếp giữa giáo viên, nhà trường và phụ huynh học sinh"
        />
      </Head>

      <PageWrapper>
        {(!isMobile || !activeConversationId) && (
          <div className="w-full md:w-[360px] md:min-w-[320px] h-full flex flex-col flex-none">
            <ConversationList onOpenCreateModal={() => setIsCreateModalOpen(true)} />
          </div>
        )}

        {(!isMobile || activeConversationId) && (
          <div className="flex-1 h-full min-w-0">
            <ChatThread
              onOpenGroupDetails={() => setIsGroupModalOpen(true)}
              onOpenImportantAlerts={() => setIsImportantModalOpen(true)}
              onBack={() => dispatch(setActiveConversation(''))}
            />
          </div>
        )}
      </PageWrapper>

      <CreateConversationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <ImportantMessagesModal
        isOpen={isImportantModalOpen}
        onClose={() => setIsImportantModalOpen(false)}
        conversationId={activeConversationId}
      />

      <GroupDetailsModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        conversationId={activeConversationId}
      />
    </PortalLayout>
  );
}
