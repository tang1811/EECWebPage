import { COURSES, getCourse, getCourseDetail, type Course, type CoursePhoto } from './course-data';
import photos from './course-department-photos.json';

const departmentPhotos = photos as { [Key in keyof typeof photos]: CoursePhoto };

// Source pages and original asset metadata remain in research/canva-departments.
export const CANVA_SOURCE = 'https://www.canva.com/design/DAGD2vsgA_g/HYv35U7NJk1JuDL6CuzJuw/view';
export const COLLEGE_PHOTO = {
  src: '/assets/courses/canva/college/college-building.jpg',
  alt: 'อาคารวิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย แหลมฉบังและบริเวณด้านหน้า',
  width: 1479,
  height: 1109,
  sourcePages: [2, 97],
};

export const ABOUT_LEVELS = [
  { code: 'ปวช.', name: 'ประกาศนียบัตรวิชาชีพ', duration: '3 ปี', admission: 'สำหรับผู้จบ ม.3', description: 'เรียนพื้นฐานวิชาชีพควบคู่กับการฝึกปฏิบัติในสาขาที่สนใจ', pages: [3, 29] },
  { code: 'ปวส.', name: 'ประกาศนียบัตรวิชาชีพชั้นสูง', duration: '2 ปี', admission: 'ปวช. สายตรง หรือ ม.6 / เทียบเท่า', description: 'พัฒนาความรู้และทักษะในสายวิชาชีพ สอบถามเงื่อนไขของสาขาที่สนใจ', pages: [3, 29] },
  { code: 'ป.ตรี', name: 'ปริญญาตรีต่อเนื่อง · เทคโนโลยีไฟฟ้า', duration: '2 ปี', admission: 'สำหรับผู้จบ ปวส. สายที่เกี่ยวข้อง', description: 'รูปแบบเรียนเสาร์–อาทิตย์ เหมาะกับผู้มีงานประจำที่ต้องการต่อยอดวุฒิการศึกษา', pages: [19, 24] },
].map((level) => ({ ...level, courses: COURSES.filter((course) => course.code === level.code) }))
  .filter((level) => level.courses.length > 0);

const departmentGroups = [
  { name: 'ช่างยนต์', group: 'ช่างอุตสาหกรรม', slugs: ['yon', 'ps-mech'], photo: departmentPhotos['automotive/engine-workshop.jpg'], illustration: false },
  { name: 'ไฟฟ้ากำลัง', group: 'ช่างอุตสาหกรรม', slugs: ['faifaa', 'ps-electrical'], photo: departmentPhotos['electrical/electrical-workbenches.jpg'], illustration: false },
  { name: 'ช่างกลโรงงานและเทคนิคการผลิต', group: 'ช่างอุตสาหกรรม', slugs: ['gear', 'ps-production'], photo: departmentPhotos['production/cnc-router.jpg'], illustration: false },
  { name: 'เมคคาทรอนิกส์และหุ่นยนต์', group: 'ช่างอุตสาหกรรม', slugs: ['mecha', 'ps-mecha'], photo: departmentPhotos['mechatronics/robot-lab.jpg'], illustration: false },
  { name: 'การจัดการโลจิสติกส์', group: 'พาณิชยกรรม', slugs: ['ps-logistics'], photo: departmentPhotos['logistics/warehouse-packages.jpg'], illustration: true },
  { name: 'การบัญชี', group: 'พาณิชยกรรม', slugs: ['accounting', 'ps-accounting'], photo: departmentPhotos['accounting/accounting-practice.jpg'], illustration: true },
  { name: 'ดิจิทัลกราฟิก', group: 'ศิลปกรรม', slugs: ['graphic', 'ps-graphic'], photo: departmentPhotos['digital-graphic/graphic-student.png'], illustration: true },
  { name: 'เทคโนโลยีธุรกิจดิจิทัล', group: 'พาณิชยกรรม', slugs: ['biz-digital'], photo: departmentPhotos['digital-business/computer-hardware.jpg'], illustration: true },
];

export const ABOUT_DEPARTMENTS = departmentGroups.map((department) => {
  const courses = department.slugs.map(getCourse).filter((course): course is Course => !!course);
  if (courses.length === 0) return null;
  const detail = getCourseDetail(courses[0].slug, courses[0]);
  return { ...department, courses, labs: detail.labs ?? [], source: detail.source };
}).filter((department) => department !== null);

export const PRACTICE_PHOTO = departmentPhotos['automotive/underbody-practice.jpg'];
export const BACHELOR_PHOTO = departmentPhotos['bachelor-electrical/plc-training-kit.jpg'];
export const BACHELOR_COURSE = getCourse('pt-electrical');
export const BACHELOR_DETAIL = BACHELOR_COURSE && getCourseDetail(BACHELOR_COURSE.slug, BACHELOR_COURSE);
