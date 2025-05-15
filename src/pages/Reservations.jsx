import { useEffect, useState } from 'react';
import { Typography, Card, Spin, message, Row, Col, Button, Popconfirm } from 'antd';
import axios from 'axios';
import { DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Reservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchReservations = async () => {
            if (!user?.email) {
                message.error('Oturum bulunamadı.');
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const res = await axios.get('https://api.sheetbest.com/sheets/a5724a0d-a348-4219-99f1-5461be99ee97');
                const userReservations = res.data.filter(
                    r => r.email === user.email && r.deleted !== 'true'
                );
                setReservations(userReservations);
            } catch (err) {
                console.error('Rezervasyon alma hatası:', err);
                message.error('Rezervasyonlar alınamadı.');
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, [user?.email]);

    const handleDelete = async (item) => {
        try {
            await axios.patch(
                `https://api.sheetbest.com/sheets/a5724a0d-a348-4219-99f1-5461be99ee97/email/${encodeURIComponent(item.email)}/seat/${item.seat}/date/${item.date}`,
                {
                    deleted: "TRUE"
                }
            );

            message.success('Rezervasyon silindi.');
            setReservations(prev => prev.filter(r =>
                !(r.email === item.email && r.seat === item.seat && r.date === item.date)
            ));
        } catch (err) {
            console.error('Silme hatası:', err);
            message.error('Silme işlemi başarısız.');
        }
    };


    return (
        <div style={{ maxWidth: 1300, marginLeft: '70px' }}>
            <Title level={3}>Rezervasyonlarım</Title>

            {loading ? (
                <Spin />
            ) : reservations.length === 0 ? (
                <p>Rezervasyon bulunamadı.</p>
            ) : (
                <Row gutter={[16, 16]}>
                    {reservations.map((item, index) => (
                        <Col xs={24} sm={24} md={12} lg={8} key={index}>
                            <Card
                                title={
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24" width="20" height="20">
                                            <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5v2.5l-2 1.5v1l3-1 3 1v-1l-2-1.5V13.5L21 16z" />
                                        </svg>
                                        <span>{item.from} → {item.to}</span>
                                    </div>
                                }
                                extra={
                                    <Popconfirm
                                        title="Bu rezervasyonu silmek istediğinden emin misin?"
                                        onConfirm={() => handleDelete(item)}
                                        okText="Evet"
                                        cancelText="Hayır"
                                    >
                                        <Button danger size="small" icon={<DeleteOutlined />} />
                                    </Popconfirm>
                                }
                            >
                                <p><strong>Tarih / Saat:</strong> {item.date} {item.time}</p>
                                <p><strong>Koltuk:</strong> {item.seat}</p>
                                <p><strong>Havayolu:</strong> {item.airline}</p>
                                <p><strong>Aktarma:</strong> {item.direct}</p>
                                <p><strong>Süre:</strong> {item.duration}</p>
                                <p><strong>Koltuk Değişikliği:</strong> {item.changeSeatOption || 'Yok'}</p>
                                <p><strong>Telefon:</strong> {item.phone || 'Belirtilmemiş'}</p>
                                <p><strong>Fiyat:</strong> {item.price}₺</p>
                                {item.changeSeatOption === 'Evet' && (
                                    <Button
                                        type="default"
                                        style={{ marginTop: 12 }}
                                        onClick={() => navigate(`/flights/${item.flightId || item.id}/seats`, {
                                            state: { ...item, kaynak: 'reservations' }
                                        })}
                                    >
                                        Koltuk Değiştir
                                    </Button>
                                )}
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default Reservations;
