/**
 * DateInputField Component
 * Input field สำหรับเลือกวันที่พร้อม Calendar Popover
 * 
 * Props:
 * - label: string - ข้อความ label
 * - value: Date | undefined - ค่าวันที่ที่เลือก
 * - onChange: (date: Date) => void - callback เมื่อเลือกวันที่
 * - required: boolean - แสดง * สีแดงหรือไม่
 * - placeholder: string - ข้อความ placeholder
 * - error: boolean - แสดง error state หรือไม่
 */

import { useState, useEffect } from 'react';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { formatThaiDate } from '../../utils/dateUtils';

export function DateInputField({
    label,
    value,
    onChange,
    required = false,
    placeholder = 'เลือกวันที่',
    error = false
}) {
    const [open, setOpen] = useState(false);
    const [timeZone, setTimeZone] = useState(undefined);

    // Set timezone for Calendar component (timezone-safe)
    useEffect(() => {
        setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }, []);

    const handleSelect = (date) => {
        onChange(date);
        setOpen(false);
    };

    return (
        <div className="space-y-1">
            {/* Label */}
            {label && (
                <label className="block text-2xl font-bold text-gray-700">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            {/* Input Container */}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        className={`
                            w-full
                            flex items-center justify-between
                            px-4 py-2
                            bg-white
                            border rounded-lg
                            text-2xl
                            transition-colors duration-200
                            hover:border-gray-400
                            focus:outline-none
                            ${error ? 'border-red-500' : 'border-gray-300'}
                            ${!value ? 'text-[#ADADAD]' : 'text-gray-900'}
                        `}
                    >
                        <span>
                            {value ? formatThaiDate(value) : placeholder}
                        </span>
                        <span className="material-symbols-outlined text-[#050C9C] text-2xl">
                            calendar_month
                        </span>
                    </button>
                </PopoverTrigger>
                <PopoverContent
                    side="bottom"
                    align="start"
                    sideOffset={6}
                    collisionPadding={12}
                    className="w-auto p-0"
                >
                    <Calendar
                        mode="single"
                        selected={value}
                        onSelect={handleSelect}
                        timeZone={timeZone}
                        initialFocus
                        className="rounded-lg border"
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}

export default DateInputField;
