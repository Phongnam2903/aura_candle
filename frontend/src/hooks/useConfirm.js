import { useState, useCallback } from 'react';

/**
 * Custom hook để thay thế window.confirm
 * Trả về confirm dialog đẹp hơn với toast
 */
export const useConfirm = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [config, setConfig] = useState({
        title: '',
        message: '',
        onConfirm: () => {},
        onCancel: () => {},
        confirmText: 'Xác nhận',
        cancelText: 'Hủy',
        type: 'warning' // 'warning', 'danger', 'info'
    });

    const confirm = useCallback((options) => {
        return new Promise((resolve) => {
            setConfig({
                title: options.title || 'Xác nhận',
                message: options.message || 'Bạn có chắc chắn?',
                confirmText: options.confirmText || 'Xác nhận',
                cancelText: options.cancelText || 'Hủy',
                type: options.type || 'warning',
                onConfirm: () => {
                    setIsOpen(false);
                    resolve(true);
                    options.onConfirm?.();
                },
                onCancel: () => {
                    setIsOpen(false);
                    resolve(false);
                    options.onCancel?.();
                }
            });
            setIsOpen(true);
        });
    }, []);

    const ConfirmDialog = useCallback(() => {
        if (!isOpen) return null;

        const typeColors = {
            warning: {
                bg: 'bg-yellow-50',
                border: 'border-yellow-200',
                icon: '⚠️',
                button: 'bg-yellow-500 hover:bg-yellow-600'
            },
            danger: {
                bg: 'bg-red-50',
                border: 'border-red-200',
                icon: '🚨',
                button: 'bg-red-500 hover:bg-red-600'
            },
            info: {
                bg: 'bg-blue-50',
                border: 'border-blue-200',
                icon: 'ℹ️',
                button: 'bg-blue-500 hover:bg-blue-600'
            }
        };

        const colors = typeColors[config.type] || typeColors.warning;

        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] animate-fadeIn">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-slideUp">
                    <div className={`${colors.bg} ${colors.border} border-b p-6 rounded-t-2xl`}>
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">{colors.icon}</span>
                            <h3 className="text-xl font-bold text-gray-800">{config.title}</h3>
                        </div>
                    </div>
                    
                    <div className="p-6">
                        <p className="text-gray-700 leading-relaxed">{config.message}</p>
                    </div>
                    
                    <div className="flex gap-3 p-6 pt-0">
                        <button
                            onClick={config.onCancel}
                            className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                        >
                            {config.cancelText}
                        </button>
                        <button
                            onClick={config.onConfirm}
                            className={`flex-1 px-4 py-3 ${colors.button} text-white rounded-xl font-semibold transition-colors`}
                        >
                            {config.confirmText}
                        </button>
                    </div>
                </div>
            </div>
        );
    }, [isOpen, config]);

    return { confirm, ConfirmDialog };
};

