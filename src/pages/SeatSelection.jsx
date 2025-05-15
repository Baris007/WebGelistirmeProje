import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, message, Checkbox } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';

const { Title } = Typography;

const SeatSelection = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [reservedSeats, setReservedSeats] = useState([]);
    const [changeSeatOption, setChangeSeatOption] = useState(false);

    const rows = 6;
    const seatCols = ['A', 'B', 'C', 'D'];

    if (!state) {
        return (
            <div style={{ textAlign: 'center', marginTop: 100 }}>
                <Title level={4}>Uçuş bilgisi eksik.</Title>
                <Button onClick={() => navigate('/flights')}>Uçuşlara Dön</Button>
            </div>
        );
    }

    useEffect(() => {
        const fetchReservedSeats = async () => {
            try {
                const res = await axios.get('https://api.sheetbest.com/sheets/a5724a0d-a348-4219-99f1-5461be99ee97');
                const currentFlightSeats = res.data
                    .filter((item) => item.flightId === String(state.id))
                    .map((item) => item.seat);
                setReservedSeats(currentFlightSeats);
            } catch (error) {
                console.error('Dolu koltuklar alınamadı:', error);
            }
        };

        fetchReservedSeats();
    }, [state.id]);

    const handleSeatSelect = (seat) => {
        setSelectedSeat(seat);
    };

    const handleConfirm = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            message.error('Giriş yapmanız gerekiyor.');
            navigate('/login');
            return;
        }

        const newPrice = changeSeatOption ? state.price + 50 : state.price;

        const payload = {
            email: user.email,
            flightId: state.flightId || state.id,
            from: state.from,
            to: state.to,
            date: state.date,
            time: state.time,
            airline: state.airline,
            price: newPrice,
            seat: selectedSeat,
            direct: state.direct ? 'Aktarmasız' : 'Aktarmalı',
            duration: state.duration + ' dk',
            changeSeatOption: changeSeatOption ? 'Evet' : 'Hayır'
        };

        if (state.kaynak === 'reservations') {
            try {
                await axios.patch(
                    `https://api.sheetbest.com/sheets/a5724a0d-a348-4219-99f1-5461be99ee97/email/${encodeURIComponent(user.email)}/flightId/${state.flightId}/seat/${state.seat}`,
                    { seat: selectedSeat }
                );

                message.success('Koltuk başarıyla değiştirildi.');
                navigate('/reservations');
            } catch (error) {
                console.error('Koltuk güncelleme hatası:', error);
                message.error('Koltuk değiştirilemedi.');
            }
        } else {
            navigate('/payment', { state: payload });
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: '50px auto' }}>
            <Card>
                <Title level={3}>Koltuk Seçimi</Title>

                <Button type="default" onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>
                    ← Geri Dön
                </Button>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {Array.from({ length: rows }).map((_, rowIdx) => {
                        const row = rowIdx + 1;
                        const left = ['A', 'B'].map((col) => `${row}${col}`);
                        const right = ['C', 'D'].map((col) => `${row}${col}`);

                        return (
                            <div
                                key={row}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: 10,
                                    alignItems: 'center'
                                }}
                            >
                                {left.map((seat) => {
                                    const isReserved = reservedSeats.includes(seat);
                                    const isSelected = selectedSeat === seat;
                                    return (
                                        <Button
                                            key={seat}
                                            type={isSelected ? 'primary' : 'default'}
                                            danger={isReserved}
                                            disabled={isReserved}
                                            onClick={() => !isReserved && handleSeatSelect(seat)}
                                        >
                                            {seat}
                                        </Button>
                                    );
                                })}

                                <div style={{ width: 40 }} />

                                {right.map((seat) => {
                                    const isReserved = reservedSeats.includes(seat);
                                    const isSelected = selectedSeat === seat;
                                    return (
                                        <Button
                                            key={seat}
                                            type={isSelected ? 'primary' : 'default'}
                                            danger={isReserved}
                                            disabled={isReserved}
                                            onClick={() => !isReserved && handleSeatSelect(seat)}
                                        >
                                            {seat}
                                        </Button>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>

                <div style={{ marginTop: 20 }}>
                    <Checkbox checked={changeSeatOption} onChange={(e) => setChangeSeatOption(e.target.checked)}>
                        Koltuk değiştirme hakkı ekle (+50₺)
                    </Checkbox>
                </div>

                <div style={{ marginTop: 30 }}>
                    <Button
                        type="primary"
                        block
                        disabled={!selectedSeat}
                        onClick={handleConfirm}
                    >
                        Koltuğu Onayla ({selectedSeat || 'Seçilmedi'})
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default SeatSelection;
