import React, { useState } from 'react';
import { Calendar, Radio } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { CalendarMode } from 'antd/es/calendar/generateCalendar';

// Đảm bảo đã import locale 'vi'
import 'dayjs/locale/vi';
import Title from 'antd/es/typography/Title';
dayjs.locale('vi'); // Cài đặt locale Tiếng Việt

interface ChooseDateAndTimeProps {
    specialtyId: string;
    onNext: (date: string, timeSlot: string) => void;
    onBack: () => void;
}

const ChooseDateAndTime: React.FC<ChooseDateAndTimeProps> = ({ onNext, onBack }) => {
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [viewingMonth, setViewingMonth] = useState<Dayjs>(dayjs());
    const [mode, setMode] = useState<CalendarMode>('month');
    const [selectedShift, setSelectedShift] = useState<'morning' | 'afternoon'>('morning');
    const [selectedTime, setSelectedTime] = useState<string>('');

    const morningTimes = ['08:00-08:30', '08:30-09:00', '09:00-09:30', '09:30-10:00', '10:00-10:30', '10:30-11:00', '11:00-11:30'];
    const afternoonTimes = ['13:00-13:30', '13:30-14:00', '14:00-14:30', '14:30-15:00', '15:00-15:30', '15:30-16:00', '16:00-16:30'];

    // Hàm vô hiệu hóa ngày trong quá khứ
    const disabledDate = (current: Dayjs) => {
        return current && current.isBefore(dayjs().startOf('day'));
    };

    const handleSelectDate = (value: Dayjs) => {
        if (!disabledDate(value)) {
            setSelectedDate(value);
            setViewingMonth(value);
        }
    };

    const handlePanelChange = (value: Dayjs, newMode: CalendarMode) => {
        setViewingMonth(value);
        setMode(newMode);
    };

    // FIX 2 (Lỗi căn chỉnh) & FIX 3 (Fix warning console)
    // Đổi tên hàm thành 'fullCellRender'
    const fullCellRender = (value: Dayjs) => {
        const isSelected = selectedDate && value.isSame(selectedDate, 'day');
        const isCurrentMonth = value.month() === viewingMonth.month();
        const isPast = disabledDate(value); // Kiểm tra ngày quá khứ

        // Class cho các ngày mờ (ngoài tháng hoặc đã qua)
        const utilityClasses = (!isCurrentMonth || isPast)
            ? 'text-gray-300 pointer-events-none' // Mờ và tắt click
            : 'text-black';

        // Class cho ngày được chọn
        const selectedClass = isSelected
            ? 'bg-blue-500 text-white' // Chỉ style nền/chữ
            : '';

        // SỬA LỖI CĂN CHỈNH:
        // Luôn render một wrapper (div bên ngoài) để căn giữa.
        // Div bên trong (w-8 h-8) nhận style của ngày được chọn.
        return (
            <div className="flex items-center justify-center w-full h-full min-h-[36px]">
                <div
                    className={`
                        flex items-center justify-center w-8 h-8 rounded-full
                        ${utilityClasses} 
                        ${selectedClass}
                    `}
                >
                    {value.date()}
                </div>
            </div>
        );
    };

    const handleShiftChange = (shift: 'morning' | 'afternoon') => {
        setSelectedShift(shift);
        setSelectedTime('');
    };

    const currentTimes = selectedShift === 'morning' ? morningTimes : afternoonTimes;

    // FIX 2: Tạo text hiển thị lựa chọn
    const renderSelectionText = () => {
        if (!selectedDate || !selectedTime) {
            return (
                <p className="text-gray-500 h-6 text-center">
                    Vui lòng chọn ngày và ca khám
                </p>
            );
        }

        // Format (ví dụ: "Thứ hai, ngày 03/11/2025, vào lúc 08:00")
        const formattedString = `${selectedDate.format('dddd, [ngày] DD/MM/YYYY')}, vào lúc ${selectedTime}`;

        return (
            <p className="text-lg font-semibold text-blue-600 h-6 text-center">
                {formattedString}
            </p>
        );
    };

    return (
        <div className="p-4 mx-auto">
            <Title level={3} className="mb-4">2. Chọn Ngày và Ca khám</Title>
            <Calendar
                className="custom-calendar-grid" // Class để style grid (xem CSS bên dưới)
                mode={mode}
                value={selectedDate || viewingMonth}
                onSelect={handleSelectDate}
                onPanelChange={handlePanelChange}
                // FIX 3: Sử dụng prop 'fullCellRender'
                fullCellRender={fullCellRender}
                disabledDate={disabledDate}
            />

            <div className="mt-4">
                <h3 className="font-semibold text-base">Chọn buổi khám</h3>
                <div className="flex space-x-4 mt-2">
                    <label className="inline-flex items-center cursor-pointer">
                        <Radio.Group
                            value={selectedShift}
                            onChange={(e) => handleShiftChange(e.target.value)} // Antd onChange trả về event
                            name="shift"
                        >
                            <Radio value="morning">Buổi sáng</Radio>
                            <Radio value="afternoon">Buổi chiều</Radio>
                        </Radio.Group>
                    </label>
                </div>

                <div className="mt-4">
                    <h3 className="font-semibold text-base">Chọn thời gian ca khám</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {currentTimes.map((time) => (
                            <button
                                key={time}
                                className={`
                                    px-3 py-1.5 border rounded-md transition-colors duration-150
                                    ${selectedTime === time
                                        ? 'bg-blue-500 text-white border-blue-500'
                                        : 'bg-white text-black border-gray-300 hover:bg-gray-50'
                                    }`}
                                onClick={() => setSelectedTime(time)}
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* FIX 2: Thêm dòng hiển thị lựa chọn */}
            <div className="mt-6 text-center">
                {renderSelectionText()}
            </div>

            <div className="mt-6 flex justify-between">
                <button
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md font-medium"
                    onClick={onBack}
                >
                    Quay lại
                </button>
                <button
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium
                               disabled:bg-blue-300 disabled:cursor-not-allowed"
                    onClick={() => {
                        if (selectedDate && selectedTime) {
                            const dateStr = selectedDate.format('YYYY-MM-DD');
                            onNext(dateStr, selectedTime);
                        }
                    }}
                    disabled={!selectedDate || !selectedTime}
                >
                    Tiếp theo
                </button>
            </div>
        </div>
    );
};

export default ChooseDateAndTime;