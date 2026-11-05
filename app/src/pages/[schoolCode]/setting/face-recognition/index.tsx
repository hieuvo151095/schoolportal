import React from 'react';
import Head from 'next/head';
import { PortalLayout } from '../../../../components/layout/PortalLayout';
import { FaceRecognitionShell } from '../../../../modules/setting/face-recognition/FaceRecognitionShell';

export default function FaceRecognitionPage() {
  return (
    <PortalLayout>
      <Head>
        <title>Đăng ký nhận diện | Eco School</title>
      </Head>
      <FaceRecognitionShell />
    </PortalLayout>
  );
}
