import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import '../../styles/homepage.css';
import '../../styles/subpages.css';
import '../../styles/about-cinematic.css';
import '../../styles/course-detail-cinematic.css';
import CourseDetailBody from './CourseDetailBody';
import { getCourse, getCourseDetail, COURSE_SLUGS } from './course-data';
import VIDEOS from '../../../public/assets/courses/videos/videos.json';

const DEPT_VIDEO = VIDEOS as Record<string, { src: string; poster: string }>;
const SITE_URL = 'https://eec.example';
const COLLEGE_NAME = 'วิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย แหลมฉบัง';

export function generateStaticParams() {
  return COURSE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) return {};
  const detail = getCourseDetail(slug, course);
  const title = `${course.code} ${course.name}`;
  return {
    title,
    description: detail.overview,
    alternates: { canonical: `/courses/${slug}` },
    openGraph: {
      title: `${title} · วิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย แหลมฉบัง`,
      description: detail.overview,
      images: course.img ? [course.img] : ['/assets/logo.png'],
      locale: 'th_TH',
      url: `/courses/${slug}`,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();
  const detail = getCourseDetail(slug, course);
  const courseUrl = `${SITE_URL}/courses/${slug}`;

  const courseJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: `${course.code} ${course.name}`,
    description: detail.overview,
    url: courseUrl,
    provider: {
      '@type': 'CollegeOrUniversity',
      name: COLLEGE_NAME,
      sameAs: `${SITE_URL}/`,
    },
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'หน้าแรก', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'หลักสูตร', item: `${SITE_URL}/courses` },
      { '@type': 'ListItem', position: 3, name: course.name, item: courseUrl },
    ],
  };

  const video = DEPT_VIDEO[slug];
  const videoJsonLd = video && {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: `รีวิวแผนก ${course.name} · ${COLLEGE_NAME}`,
    description: `บรรยากาศการเรียนและการฝึกปฏิบัติจริงของสาขา${course.name} ${course.code}`,
    thumbnailUrl: `${SITE_URL}${video.poster}`,
    contentUrl: `${SITE_URL}${video.src}`,
    uploadDate: '2025-06-01',
    publisher: { '@type': 'Organization', name: COLLEGE_NAME, logo: { '@type': 'ImageObject', url: `${SITE_URL}/assets/logo.png` } },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {videoJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }} />}
      <CourseDetailBody course={course} />
    </>
  );
}
