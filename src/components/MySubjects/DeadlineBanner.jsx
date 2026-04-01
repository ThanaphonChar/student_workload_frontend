import { calcDeadline, daysUntil, formatThaiDate, parseDate } from '../../utils/dateUtils';

export const DeadlineBanner = ({ termStartDate, offsetDays = 7 }) => {
    if (!termStartDate) return null;

    const startDate = parseDate(termStartDate);
    if (!startDate || Number.isNaN(startDate.getTime())) return null;

    const deadline = calcDeadline(termStartDate, offsetDays);
    const daysLeft = daysUntil(deadline);

    const startDateText = formatThaiDate(startDate);
    const deadlineText = formatThaiDate(deadline);

    return (
        <div className="rounded-lg border-2 border-[#FFC407] bg-white p-4 mx-10">
            <div className="flex items-center justify-between gap-4">
                <div className="pl-4">
                    <p className="text-2xl font-bold text-black">
                        ส่งเค้าโครงรายวิชาภายใน {deadlineText}
                    </p>
                    <p className="text-xl text-[#989898]">
                        ส่งเอกสารเค้าโครงรายวิชาภายใน {offsetDays} วันนับจากวันเปิดเทอม วันที่ {startDateText} ถึง {deadlineText}
                    </p>
                </div>

                <div className="shrink-0">
                    {daysLeft > 0 ? (
                        <div className="min-w-[72px] rounded-lg bg-[#FFC407] p-3 text-center">
                            <p className="text-4xl font-bold text-black">{daysLeft}</p>
                            <p className="text-lg text-black">วันที่เหลือ</p>
                        </div>
                    ) : (
                        <div className="min-w-[72px] rounded-lg bg-[#db2627] p-3 text-center">
                            <p className="text-xl font-bold text-white">เลยกำหนดแล้ว</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DeadlineBanner;
