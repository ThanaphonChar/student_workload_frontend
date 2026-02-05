/**
 * Academic Year Constants
 * ค่าคงที่สำหรับระบบจัดการปีการศึกษา
 */

// สถานะของภาคการศึกษา (computed จากวันที่)
export const TERM_STATUS = {
  ONGOING: 'ongoing',    // ดำเนินการ
  ENDED: 'ended',        // สิ้นสุด
};

// ชื่อสถานะภาษาไทย
export const TERM_STATUS_LABEL = {
  [TERM_STATUS.ONGOING]: 'ดำเนินการ',
  [TERM_STATUS.ENDED]: 'สิ้นสุด',
};

// สีของ badge ตามสถานะ
export const TERM_STATUS_COLOR = {
  [TERM_STATUS.ONGOING]: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
  },
  [TERM_STATUS.ENDED]: {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
  },
};

// ภาคการศึกษา
export const SEMESTERS = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3 (ฤดูร้อน)' },
];

// ตัวเลือกปีการศึกษา (สร้างจากปีปัจจุบัน)
const currentYear = new Date().getFullYear();
const buddhistYear = currentYear + 543;

export const ACADEMIC_YEARS = Array.from({ length: 5 }, (_, i) => ({
  value: buddhistYear - i,
  label: `${buddhistYear - i}`,
}));

// ตัวเลือกสำหรับ dropdown filter
export const FILTER_ALL_OPTION = {
  YEAR: { value: null, label: 'ทั้งหมด' },
  SEMESTER: { value: null, label: 'เทอม' },
};

// สถานะการอนุมัติ (สำหรับ outline และ report เท่านั้น)
export const APPROVAL_STATUS = {
  PENDING: 'pending',      // รออนุมัติ
  APPROVED: 'approved',    // อนุมัติแล้ว
  REJECTED: 'rejected',    // ไม่อนุมัติ
};

// ชื่อสถานะการอนุมัติภาษาไทย
export const APPROVAL_STATUS_LABEL = {
  [APPROVAL_STATUS.PENDING]: 'รออนุมัติ',
  [APPROVAL_STATUS.APPROVED]: 'อนุมัติแล้ว',
  [APPROVAL_STATUS.REJECTED]: 'ไม่อนุมัติ',
};

// สีของ badge การอนุมัติ
export const APPROVAL_STATUS_COLOR = {
  [APPROVAL_STATUS.PENDING]: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
  },
  [APPROVAL_STATUS.APPROVED]: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
  },
  [APPROVAL_STATUS.REJECTED]: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
  },
};

// จำนวนวันเตือนก่อน deadline
export const WARNING_DAYS = {
  SYLLABUS_SUBMIT: 7,      // ต้องส่งคำโครงก่อนสอบกลางภาค 7 วัน
  SHOW_WARNING_START: 15,  // เริ่มแสดงเตือนก่อน deadline 15 วัน
};

// ข้อความ labels
export const LABELS = {
  // ข้อมูลพื้นฐาน
  ACADEMIC_YEAR: 'ปีการศึกษา',
  SEMESTER: 'ภาคการศึกษา',
  START_DATE: 'วันเริ่มภาคการศึกษา',
  END_DATE: 'วันสิ้นสุดภาคการศึกษา',

  // ช่วงสอบ
  EXAM_PERIODS: 'กำหนดช่วงสอบ',
  MIDTERM_PERIOD: 'ช่วงสอบกลางภาค',
  FINAL_PERIOD: 'ช่วงสอบปลายภาค',
  EXAM_START: 'เริ่ม',
  EXAM_END: 'สิ้นสุด',

  // รายวิชา
  SUBJECTS: 'รายวิชา',
  SUBJECT_CODE: 'รหัสวิชา',
  SUBJECT_NAME: 'ชื่อวิชา',
  CREDITS: 'หน่วยกิต',
  YEAR_LEVEL: 'ชั้นปี',

  // อาจารย์
  INSTRUCTORS: 'อาจารย์',
  RESPONSIBLE_INSTRUCTOR: 'อาจารย์ผู้รับผิดชอบ',

  // สถานะ
  SYLLABUS_STATUS: 'คำโครงรายวิชา',
  WORKLOAD_STATUS: 'ภาระงาน',
  REPORT_STATUS: 'รายงานผล',

  // Actions
  MANAGE: 'จัดการ',
  CREATE: 'สร้าง',
  EDIT: 'แก้ไข',
  DELETE: 'ลบ',
  SAVE: 'บันทึก',
  CANCEL: 'ยกเลิก',
  SELECT: 'เลือก',
  REMOVE: 'ลบออก',

  // Buttons
  CREATE_NEW_TERM: 'เริ่มภาคการศึกษาใหม่',
  SELECT_SUBJECTS: 'เลือกรายวิชา',
  ADD_INSTRUCTOR: 'เพิ่มอาจารย์',

  // Messages
  NO_DATA: 'ไม่พบข้อมูล',
  LOADING: 'กำลังโหลด...',
  SUCCESS: 'สำเร็จ',
  ERROR: 'เกิดข้อผิดพลาด',
  CONFIRM_DELETE: 'คุณต้องการลบข้อมูลนี้หรือไม่?',
};

// Table column widths
export const COLUMN_WIDTHS = {
  CHECKBOX: '60px',
  SUBJECT_CODE: '120px',
  CREDITS: '100px',
  YEAR_LEVEL: '100px',
  INSTRUCTOR_COUNT: '100px',
  STATUS_ICON: '80px',
  ACTIONS: '100px',
};
