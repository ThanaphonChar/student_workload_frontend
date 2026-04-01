import { useEffect, useMemo, useState } from 'react';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';
import { SubmissionTimeline } from './SubmissionTimeline';
import { getSubmissionHistory } from '../../../services/submission.service';
import VerticalAlignTopRoundedIcon from '@mui/icons-material/VerticalAlignTopRounded';

export const HistoryModal = ({
    isOpen,
    onClose,
    termSubjectId,
    subjectCode,
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
            <div className="max-h-[70vh] flex flex-col overflow-hidden">
                {/* Subject & Document Type Info */}
                <div className="rounded-lg bg-white">
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <p className="text-3xl font-bold text-gray-900">
                                {subjectCode || '-'}
                            </p>
                            <p className="text-2xl text-[#757575]">
                                {subjectName}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex-1 overflow-y-auto pr-1">
                    {loading ? (
                        <div className="py-8 text-center">
                            <p className="text-xl text-gray-600">กำลังโหลดประวัติ...</p>
                        </div>
                    ) : null}

                    {!loading && errorMessage ? <p className="text-lg text-red-600">{errorMessage}</p> : null}

                    {!loading && !errorMessage ? <SubmissionTimeline events={events} totalRounds={totalRounds} /> : null}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-end gap-3 shrink-0 bg-white">
                    {showReupload ? (
                        <Button
                            variant="primary"
                            onClick={() => {
                                onClose();
                                onReupload();
                            }}
                            className=""
                        >
                            <VerticalAlignTopRoundedIcon fontSize="small" className="text-white" />
                            อัปโหลดใหม่
                        </Button>
                    ) : null}

                    <Button
                        type="button"
                        onClick={onClose}
                        className="bg-[#F1F1F1] hover:bg-[#E1E1E1]"
                    >
                        <span className="text-[#3B3B3B] text-xl">ยกเลิก</span>
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default HistoryModal;
