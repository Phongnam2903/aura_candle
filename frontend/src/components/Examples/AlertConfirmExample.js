import React from 'react';
import { useConfirm } from '../../hooks/useConfirm';
import { toast } from 'react-toastify';

/**
 * Example Component - Demo cách sử dụng Toast và Confirm Dialog
 * Component này chỉ để demo, có thể xóa sau khi đã apply vào production
 */
export default function AlertConfirmExample() {
    const { confirm, ConfirmDialog } = useConfirm();

    // ===== TOAST EXAMPLES =====
    
    const showSuccessToast = () => {
        toast.success('Thao tác thành công! 🎉');
    };

    const showErrorToast = () => {
        toast.error('Có lỗi xảy ra! ❌');
    };

    const showWarningToast = () => {
        toast.warning('Cảnh báo: Kiểm tra lại thông tin! ⚠️');
    };

    const showInfoToast = () => {
        toast.info('Thông tin: Hệ thống sẽ bảo trì vào 2h sáng 📢');
    };

    // ===== CONFIRM EXAMPLES =====
    
    const handleWarningConfirm = async () => {
        const result = await confirm({
            title: '⚠️ Cảnh báo',
            message: 'Bạn có chắc muốn thực hiện hành động này?',
            type: 'warning',
            confirmText: 'Xác nhận',
            cancelText: 'Hủy'
        });

        if (result) {
            toast.success('Đã xác nhận!');
        } else {
            toast.info('Đã hủy');
        }
    };

    const handleDangerConfirm = async () => {
        const result = await confirm({
            title: '🚨 Nguy hiểm',
            message: 'Bạn có chắc muốn xóa? Hành động này không thể hoàn tác!',
            type: 'danger',
            confirmText: 'Xóa',
            cancelText: 'Hủy'
        });

        if (result) {
            toast.success('Đã xóa thành công!');
        }
    };

    const handleInfoConfirm = async () => {
        const result = await confirm({
            title: 'ℹ️ Thông tin',
            message: 'Bạn có muốn tiếp tục?',
            type: 'info',
            confirmText: 'Tiếp tục',
            cancelText: 'Quay lại'
        });

        if (result) {
            toast.info('Đang tiếp tục...');
        }
    };

    const handleComplexAction = async () => {
        // Step 1: Confirm trước khi thực hiện
        const shouldProceed = await confirm({
            title: 'Xác nhận lưu',
            message: 'Bạn có muốn lưu tất cả thay đổi?',
            type: 'warning',
            confirmText: 'Lưu',
            cancelText: 'Hủy'
        });

        if (!shouldProceed) return;

        // Step 2: Show loading toast
        const toastId = toast.loading('Đang lưu...');

        // Step 3: Simulate API call
        setTimeout(() => {
            // Step 4: Update toast to success
            toast.update(toastId, {
                render: 'Lưu thành công!',
                type: 'success',
                isLoading: false,
                autoClose: 2000
            });
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-3xl shadow-lg">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">
                📚 Toast & Confirm Dialog Examples
            </h1>

            {/* Toast Examples */}
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                    🎨 Toast Notifications
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button
                        onClick={showSuccessToast}
                        className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                        ✅ Success
                    </button>
                    <button
                        onClick={showErrorToast}
                        className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        ❌ Error
                    </button>
                    <button
                        onClick={showWarningToast}
                        className="px-4 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                        ⚠️ Warning
                    </button>
                    <button
                        onClick={showInfoToast}
                        className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        ℹ️ Info
                    </button>
                </div>
            </section>

            {/* Confirm Dialog Examples */}
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                    💬 Confirm Dialogs
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={handleWarningConfirm}
                        className="px-4 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                        ⚠️ Warning Confirm
                    </button>
                    <button
                        onClick={handleDangerConfirm}
                        className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        🚨 Danger Confirm
                    </button>
                    <button
                        onClick={handleInfoConfirm}
                        className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        ℹ️ Info Confirm
                    </button>
                </div>
            </section>

            {/* Complex Example */}
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                    🎯 Complex Action (Loading Toast)
                </h2>
                <button
                    onClick={handleComplexAction}
                    className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all text-lg font-semibold"
                >
                    🚀 Save with Loading
                </button>
            </section>

            {/* Code Examples */}
            <section className="bg-gray-50 p-6 rounded-xl">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                    💻 Code Examples
                </h2>
                
                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Toast:</h3>
                        <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`toast.success('Message');
toast.error('Message');
toast.warning('Message');
toast.info('Message');`}
                        </pre>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Confirm:</h3>
                        <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`const { confirm, ConfirmDialog } = useConfirm();

const result = await confirm({
  title: 'Title',
  message: 'Message',
  type: 'warning', // warning, danger, info
  confirmText: 'OK',
  cancelText: 'Cancel'
});

if (result) {
  // User clicked OK
}`}
                        </pre>
                    </div>
                </div>
            </section>

            {/* Important: Render ConfirmDialog */}
            <ConfirmDialog />
        </div>
    );
}

