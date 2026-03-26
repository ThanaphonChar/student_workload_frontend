import { useEffect, useMemo, useState } from 'react';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';
import { SubmissionTimeline } from './SubmissionTimeline';
import { getSubmissionHistory } from '../../../services/submission.service';

export const HistoryModal = ({
    isOpen,
    onClose,
    termSubjectId,
    subjectName,
    documentType,
    onReupload,
}) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const documentTypeLabel = documentType === 'outline' ? 'เค้าโครงรายวิชา' : 'รายงานผล';

    useEffect(() => {
        let isMounted = true;

        const loadHistory = async () => {
            if (!isOpen || !termSubjectId || !documentType) return;

            setLoading(true);
            setErrorMessage('');
            try {
                const historyData = await getSubmissionHistory(termSubjectId, documentType);
                if (isMounted) {
                    setEvents(Array.isArray(historyData) ? historyData : []);
                }
            } catch (error) {
                if (isMounted) {
                    setErrorMessage(error?.data?.message || error?.message || 'ไม่สามารถโหลดประวัติการส่งเอกสารได้');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadHistory();

        return () => {
            isMounted = false;
        };
    }, [isOpen, termSubjectId, documentType]);

    const totalRounds = useMemo(() => {
        const uniqueRounds = new Set(events.map((event) => event.round_number));
        return uniqueRounds.size;
    }, [events]);

    const latestReview = useMemo(() => {
        return [...events].filter((event) => event.event_type === 'reviewed').pop() || null;
    }, [events]);

    const showReupload = latestReview?.action === 'rejected';

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="ประวัติการส่งเอกสาร"
            size="md"
        >
            <div className="space-y-4">
                <div>
                    <p className="text-2xl text-gray-900">{subjectName || '-'}</p>
                    <p className="text-xl text-gray-600">{documentTypeLabel}</p>
                </div>

                {loading ? (
                    <div className="py-8 text-center">
                        <p className="text-xl text-gray-600">กำลังโหลดประวัติ...</p>
                    </div>
                ) : null}

                {!loading && errorMessage ? <p className="text-lg text-red-600">{errorMessage}</p> : null}

                {!loading && !errorMessage ? <SubmissionTimeline events={events} totalRounds={totalRounds} /> : null}

                {!loading && !errorMessage ? (
                    <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                        <p className="text-lg text-gray-600">ส่งมาแล้ว {totalRounds} รอบ</p>
                        <div className="flex gap-3">
                            {showReupload ? (
                                <Button
                                    variant="primary"
                                    onClick={() => {
                                        onClose();
                                        onReupload();
                                    }}
                                >
                                    อัปโหลดใหม่
                                </Button>
                            ) : null}
                            <Button variant="secondary" onClick={onClose}>
                                ปิด
                            </Button>
                        </div>
                    </div>
                ) : null}
            </div>
        </Modal>
    );
};

export default HistoryModal;
