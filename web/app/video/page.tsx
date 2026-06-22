import type { Metadata } from 'next';
import '../styles/homepage.css';
import '../styles/subpages.css';
import VideoBody from './VideoBody';

export const metadata: Metadata = {
  title: 'วิดีโอแนะนำวิทยาลัย',
  description:
    'วิดีโอแนะนำวิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย แหลมฉบัง — ทัวร์ 1 นาที รู้จักหลักสูตร 18 สาขา พันธมิตรในเขต EEC สถิติ และปรัชญาของเรา',
  keywords: [
    'วิดีโอแนะนำ วิทยาลัยแหลมฉบัง',
    'ทัวร์ EEC Engineer',
    'หลักสูตร อาชีวศึกษา ศรีราชา',
    'วิทยาลัยเทคโนโลยี ชลบุรี',
  ],
  alternates: { canonical: '/video' },
};

export default function VideoPage() {
  return (
    <>
      {/* Cinematic playback bar uses JetBrains Mono for the time readout; load alongside Prompt. */}
      <link
        href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <VideoBody />
    </>
  );
}
