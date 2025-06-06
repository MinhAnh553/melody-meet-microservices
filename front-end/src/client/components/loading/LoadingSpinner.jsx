import React from 'react';
import { useLoading } from '../../context/LoadingContext';

const LoadingSpinner = () => {
    const { isLoading } = useLoading();
    if (!isLoading) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 1)', // Background mờ
                zIndex: 9999,
            }}
        >
            <div className="text-center my-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                </div>
                <p className="mt-2">Đang tải...</p>
            </div>
        </div>
    );
};

export default LoadingSpinner;
