// TicketModal.jsx
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CheckoutInfoModal from './CheckoutInfoModal';
import api from '../../../util/api';
import swalCustomize from '../../../util/swalCustomize';

const TicketModal = ({ show, onHide, event }) => {
    const navigate = useNavigate();
    const [quantities, setQuantities] = useState(() => {
        if (!event?.ticketTypes) return [];
        return event.ticketTypes.map(() => 0);
    });

    const [showInfoModal, setShowInfoModal] = useState(false);

    if (!event) return null;

    const handleQuantityChange = (index, newValue) => {
        const ticket = event.ticketTypes[index];
        const { maxPerUser, totalQuantity } = ticket;

        // Giới hạn: 0 <= newValue <= min(maxPerUser, totalQuantity)
        const validValue = Math.max(
            0,
            Math.min(newValue, maxPerUser, totalQuantity),
        );

        setQuantities((prev) => {
            const newArr = [...prev];
            newArr[index] = validValue;
            return newArr;
        });
    };

    // Tổng tiền
    const totalPrice = event.ticketTypes.reduce((acc, ticket, i) => {
        return acc + ticket.price * quantities[i];
    }, 0);

    // Có vé free nào được chọn?
    const hasFreeTicketSelected = event.ticketTypes.some(
        (ticket, i) => ticket.price === 0 && quantities[i] > 0,
    );

    // Tổng vé
    const totalQuantity = quantities.reduce((acc, q) => acc + q, 0);
    const isCheckoutDisabled = totalQuantity === 0;

    // Định dạng hiển thị tổng tiền
    const displayPrice = totalPrice.toLocaleString('vi-VN') + 'đ';

    // Mở modal xác nhận thông tin
    const handleCheckout = () => {
        onHide();
        setShowInfoModal(true);
    };

    // Khi user xác nhận info => proceed
    const handleInfoConfirmed = async (buyerInfo) => {
        try {
            const items = event.ticketTypes
                .map((ticket, i) => ({
                    ticketId: ticket._id,
                    name: ticket.name,
                    quantity: quantities[i],
                    price: ticket.price,
                }))
                .filter((item) => item.quantity >= 1); // Lọc những ticket có quantity >= 1

            const formData = new FormData();
            formData.append('items', JSON.stringify(items));
            formData.append('totalPrice', totalPrice);
            formData.append('buyerInfo', JSON.stringify(buyerInfo));

            const res = await api.createOrder(event._id, formData);
            if (res.success) {
                navigate(`/orders/${res.orderId}`);
            } else {
                return swalCustomize.Toast.fire({
                    icon: 'error',
                    title: res.message || 'Tạo đơn hàng thất bại!',
                });
            }
        } catch (error) {
            return swalCustomize.Toast.fire({
                icon: 'error',
                title: error.message || 'Server Error!',
            });
        }
    };

    // Hàm tăng/giảm
    const handleDecrement = (index) => {
        handleQuantityChange(index, quantities[index] - 1);
    };
    const handleIncrement = (index) => {
        handleQuantityChange(index, quantities[index] + 1);
    };

    return (
        <>
            <Modal show={show} onHide={onHide} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Chọn vé cho: {event.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark text-white">
                    {/* Desktop/tablet view: hiển thị table */}
                    <div className="d-none d-sm-block">
                        <div className="table-responsive">
                            <table className="table table-dark ticket-table align-middle">
                                <thead>
                                    <tr>
                                        <th style={{ width: '40%' }}>
                                            Loại vé
                                        </th>
                                        <th style={{ width: '20%' }}>Giá</th>
                                        <th
                                            style={{ width: '40%' }}
                                            className="text-center"
                                        >
                                            Số lượng
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {event.ticketTypes.map((ticket, index) => {
                                        const quantity = quantities[index];
                                        return (
                                            <tr key={ticket._id || index}>
                                                <td>
                                                    <strong>
                                                        {ticket.name}
                                                    </strong>
                                                </td>
                                                <td>
                                                    {ticket.price.toLocaleString(
                                                        'vi-VN',
                                                    ) + 'đ'}
                                                </td>
                                                <td>
                                                    <div className="quantity-group d-flex justify-content-center align-items-center">
                                                        {/* Nếu hết vé thì hiển hết vé */}
                                                        {ticket.totalQuantity -
                                                            ticket.quantitySold <=
                                                            0 && (
                                                            <span className="text-danger">
                                                                Hết vé
                                                            </span>
                                                        )}
                                                        {/* Nếu còn vé thì hiển thị nút tăng/giảm */}
                                                        {ticket.totalQuantity -
                                                            ticket.quantitySold >
                                                            0 && (
                                                            <>
                                                                <button
                                                                    className="btn btn-outline-light btn-sm rounded-circle me-2"
                                                                    onClick={() =>
                                                                        handleDecrement(
                                                                            index,
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        quantity <=
                                                                        0
                                                                    }
                                                                >
                                                                    <i className="bi bi-dash"></i>
                                                                </button>
                                                                <input
                                                                    type="number"
                                                                    min={0}
                                                                    max={Math.min(
                                                                        ticket.maxPerUser,
                                                                        ticket.totalQuantity -
                                                                            ticket.quantitySold,
                                                                    )}
                                                                    value={
                                                                        quantity
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        handleQuantityChange(
                                                                            index,
                                                                            +e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    className="quantity-input"
                                                                />
                                                                <button
                                                                    className="btn btn-outline-light btn-sm rounded-circle ms-2"
                                                                    onClick={() =>
                                                                        handleIncrement(
                                                                            index,
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        quantity >=
                                                                        Math.min(
                                                                            ticket.maxPerUser,
                                                                            ticket.totalQuantity -
                                                                                ticket.quantitySold,
                                                                        )
                                                                    }
                                                                >
                                                                    <i className="bi bi-plus"></i>
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan={2}>
                                            <strong>Tổng tiền:</strong>
                                        </td>
                                        <td className="text-end text-danger fw-bold">
                                            {displayPrice}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Mobile view: card layout */}
                    <div className="d-block d-sm-none">
                        {event.ticketTypes.map((ticket, index) => {
                            const quantity = quantities[index];
                            return (
                                <div
                                    key={ticket._id || index}
                                    className="border p-3 mb-3 rounded text-white"
                                    style={{ background: '#31353e' }}
                                >
                                    <div className="d-flex justify-content-between mb-2">
                                        <strong>{ticket.name}</strong>
                                        <span>
                                            {ticket.price.toLocaleString(
                                                'vi-VN',
                                            ) + 'đ'}
                                        </span>
                                    </div>
                                    <div
                                        className="text-white mb-2"
                                        style={{ fontSize: '0.9rem' }}
                                    >
                                        (Tối đa{' '}
                                        {Math.min(
                                            ticket.maxPerUser,
                                            ticket.totalQuantity -
                                                ticket.quantitySold,
                                        )}{' '}
                                        vé)
                                    </div>
                                    <div className="quantity-group d-flex justify-content-center align-items-center">
                                        <button
                                            className="btn btn-outline-light btn-sm rounded-circle me-2"
                                            onClick={() =>
                                                handleDecrement(index)
                                            }
                                            disabled={quantity <= 0}
                                        >
                                            <i className="bi bi-dash"></i>
                                        </button>
                                        <input
                                            type="number"
                                            min={0}
                                            max={Math.min(
                                                ticket.maxPerUser,
                                                ticket.totalQuantity -
                                                    ticket.quantitySold,
                                            )}
                                            value={quantity}
                                            onChange={(e) =>
                                                handleQuantityChange(
                                                    index,
                                                    +e.target.value,
                                                )
                                            }
                                            className="quantity-input"
                                        />
                                        <button
                                            className="btn btn-outline-light btn-sm rounded-circle ms-2"
                                            onClick={() =>
                                                handleIncrement(index)
                                            }
                                            disabled={
                                                quantity >=
                                                Math.min(
                                                    ticket.maxPerUser,
                                                    ticket.totalQuantity -
                                                        ticket.quantitySold,
                                                )
                                            }
                                        >
                                            <i className="bi bi-plus"></i>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Tổng tiền trên mobile */}
                        <div className="text-end text-danger fw-bold">
                            Tổng tiền: {displayPrice}
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer className="bg-dark">
                    <button className="btn btn-secondary" onClick={onHide}>
                        Đóng
                    </button>
                    <button
                        className="btn btn-success"
                        onClick={handleCheckout}
                        disabled={isCheckoutDisabled}
                    >
                        Thanh toán
                    </button>
                </Modal.Footer>
            </Modal>
            {/* Modal cập nhật thông tin */}
            <CheckoutInfoModal
                show={showInfoModal}
                onHide={() => setShowInfoModal(false)}
                onConfirm={handleInfoConfirmed}
            />
        </>
    );
};

export default TicketModal;
