/**
 * Date Utilities
 * ฟังก์ชันสำหรับจัดการวันที่ในระบบ
 */

import { TERM_STATUS, WARNING_DAYS } from '../constants/academicYear';

/**
 * แปลง string เป็น Date object
 */
export const parseDate = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString);
};

/**
 * Format date เป็น DD/MM/YYYY (พ.ศ.)
 */
export const formatDateThai = (date) => {
  if (!date) return '';
  
  const d = typeof date === 'string' ? parseDate(date) : date;
  if (!d || isNaN(d.getTime())) return '';
  
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear() + 543; // แปลงเป็น พ.ศ.
  
  return `${day}/${month}/${year}`;
};

/**
 * Format date เป็น YYYY-MM-DD สำหรับ input type="date"
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  
  const d = typeof date === 'string' ? parseDate(date) : date;
  if (!d || isNaN(d.getTime())) return '';
  
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * คำนวณสถานะของภาคการศึกษา
 * @param {Date|string} endDate - วันสิ้นสุดภาคการศึกษา
 * @returns {string} 'ongoing' | 'ended'
 */
export const calculateTermStatus = (endDate) => {
  if (!endDate) return TERM_STATUS.ENDED;
  
  const end = typeof endDate === 'string' ? parseDate(endDate) : endDate;
  const today = new Date();
  
  // เปรียบเทียบเฉพาะวันที่ (ไม่สนใจเวลา)
  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  return today <= end ? TERM_STATUS.ONGOING : TERM_STATUS.ENDED;
};

/**
 * คำนวณจำนวนวันที่เหลือจนถึง deadline
 * @param {Date|string} deadlineDate
 * @returns {number} จำนวนวัน (เป็นบวก = ยังไม่ถึง, เป็นลบ = เลยแล้ว)
 */
export const getDaysUntilDeadline = (deadlineDate) => {
  if (!deadlineDate) return 0;
  
  const deadline = typeof deadlineDate === 'string' ? parseDate(deadlineDate) : deadlineDate;
  const today = new Date();
  
  // เปรียบเทียบเฉพาะวันที่
  today.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);
  
  const diffTime = deadline - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * คำนวณ deadline สำหรับส่งคำโครงรายวิชา
 * ต้องส่งก่อนสอบกลางภาค 7 วัน
 * @param {Date|string} midtermStartDate - วันเริ่มสอบกลางภาค
 * @returns {Date} วัน deadline
 */
export const calculateSyllabusDeadline = (midtermStartDate) => {
  if (!midtermStartDate) return null;
  
  const midtermStart = typeof midtermStartDate === 'string' 
    ? parseDate(midtermStartDate) 
    : midtermStartDate;
  
  const deadline = new Date(midtermStart);
  deadline.setDate(deadline.getDate() - WARNING_DAYS.SYLLABUS_SUBMIT);
  
  return deadline;
};

/**
 * ตรวจสอบว่าควรแสดงเตือน deadline หรือไม่
 * แสดงเมื่ออยู่ในช่วง 8-15 วันก่อน deadline
 * @param {Date|string} midtermStartDate
 * @returns {Object|null} { show: boolean, deadline: Date, daysRemaining: number }
 */
export const checkSyllabusWarning = (midtermStartDate) => {
  if (!midtermStartDate) return null;
  
  const deadline = calculateSyllabusDeadline(midtermStartDate);
  const daysRemaining = getDaysUntilDeadline(deadline);
  
  // แสดงเตือนเมื่อเหลือ 8-15 วัน
  const shouldShow = daysRemaining >= 8 && daysRemaining <= WARNING_DAYS.SHOW_WARNING_START;
  
  return {
    show: shouldShow,
    deadline,
    daysRemaining,
    deadlineFormatted: formatDateThai(deadline),
  };
};

/**
 * Validate ว่า end date อยู่หลัง start date
 */
export const isDateRangeValid = (startDate, endDate) => {
  if (!startDate || !endDate) return false;
  
  const start = typeof startDate === 'string' ? parseDate(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseDate(endDate) : endDate;
  
  return end >= start;
};

/**
 * Validate ว่าช่วงสอบอยู่ภายในช่วงภาคการศึกษา
 */
export const isExamPeriodWithinTerm = (examStart, examEnd, termStart, termEnd) => {
  const exStart = typeof examStart === 'string' ? parseDate(examStart) : examStart;
  const exEnd = typeof examEnd === 'string' ? parseDate(examEnd) : examEnd;
  const tmStart = typeof termStart === 'string' ? parseDate(termStart) : termStart;
  const tmEnd = typeof termEnd === 'string' ? parseDate(termEnd) : termEnd;
  
  return exStart >= tmStart && exEnd <= tmEnd;
};

/**
 * ดึงปี พ.ศ. จากวันที่
 */
export const getBuddhistYear = (date) => {
  const d = typeof date === 'string' ? parseDate(date) : date;
  if (!d || isNaN(d.getTime())) return null;
  
  return d.getFullYear() + 543;
};

/**
 * สร้าง date range text
 * เช่น "1 ส.ค. 2568 - 15 ธ.ค. 2568"
 */
export const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return '';
  
  const thaiMonths = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];
  
  const start = typeof startDate === 'string' ? parseDate(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseDate(endDate) : endDate;
  
  const startDay = start.getDate();
  const startMonth = thaiMonths[start.getMonth()];
  const startYear = start.getFullYear() + 543;
  
  const endDay = end.getDate();
  const endMonth = thaiMonths[end.getMonth()];
  const endYear = end.getFullYear() + 543;
  
  return `${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}`;
};
