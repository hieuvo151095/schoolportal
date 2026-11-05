import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { PortalLayout } from '../../../../../components/layout/PortalLayout';
import { StudentDetailHub } from '../../../../../modules/school/student/StudentDetailHub';
import { ClassTransferModal } from '../../../../../modules/school/student/ClassTransferModal';
import { StudentNotesModal } from '../../../../../modules/school/student/StudentNotesModal';
import { PhysicalGrowthModal } from '../../../../../modules/school/student/PhysicalGrowthModal';
import { TuitionOverrideModal } from '../../../../../modules/school/student/TuitionOverrideModal';
import { useAppSelector } from '../../../../../store';

import type { GetServerSideProps } from 'next';

interface StudentDetailPageProps {
  initialStudentId?: string;
  initialSchoolCode?: string;
}

export default function StudentDetailPage({
  initialStudentId,
  initialSchoolCode = 'demo',
}: StudentDetailPageProps) {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || initialSchoolCode;
  const currentSchoolCode = typeof schoolCode === 'string' ? schoolCode : 'demo';
  const studentId = (router.query.id as string) || initialStudentId || '';

  const student = useAppSelector((state) =>
    state.student.students.find((s) => s.id === studentId)
  );

  // Modals state
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isGrowthOpen, setIsGrowthOpen] = useState(false);
  const [isTuitionOpen, setIsTuitionOpen] = useState(false);

  return (
    <PortalLayout schoolCode={currentSchoolCode}>
      <Head>
        <title>
          {student ? `${student.fullName} | Hồ Sơ Học Sinh` : 'Chi Tiết Học Sinh'}
        </title>
      </Head>

      <div className="space-y-6">
        {!student ? (
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-12 text-center space-y-4">
            <h2 className="text-lg font-bold text-slate-800">Không tìm thấy thông tin học sinh</h2>
            <p className="text-xs text-slate-500">
              Học sinh có mã &quot;{studentId}&quot; không tồn tại hoặc đã được chuyển vào lưu trữ.
            </p>
            <Link
              href={`/${currentSchoolCode}/school/kid`}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#0070CE] rounded-lg hover:bg-[#005ba8]"
            >
              Quay lại danh sách
            </Link>
          </div>
        ) : (
          <>
            <StudentDetailHub
              student={student}
              schoolCode={currentSchoolCode}
              onOpenTransfer={() => setIsTransferOpen(true)}
              onOpenGrowth={() => setIsGrowthOpen(true)}
              onOpenNotes={() => setIsNotesOpen(true)}
              onOpenTuition={() => setIsTuitionOpen(true)}
            />

            {/* Modals */}
            <ClassTransferModal
              isOpen={isTransferOpen}
              onClose={() => setIsTransferOpen(false)}
              students={[student]}
            />

            <StudentNotesModal
              isOpen={isNotesOpen}
              onClose={() => setIsNotesOpen(false)}
              student={student}
            />

            <PhysicalGrowthModal
              isOpen={isGrowthOpen}
              onClose={() => setIsGrowthOpen(false)}
              student={student}
            />

            <TuitionOverrideModal
              isOpen={isTuitionOpen}
              onClose={() => setIsTuitionOpen(false)}
              student={student}
            />
          </>
        )}
      </div>
    </PortalLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const rawId = context.params?.id || context.query?.id || null;
  const rawSchool = context.params?.schoolCode || context.query?.schoolCode || 'demo';
  return {
    props: {
      initialStudentId: typeof rawId === 'string' ? rawId : null,
      initialSchoolCode: typeof rawSchool === 'string' ? rawSchool : 'demo',
    },
  };
};
