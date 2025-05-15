import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Typography, Button } from 'antd';

const { Title, Paragraph } = Typography;

const FlightDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div style={{ textAlign: 'center', marginTop: 100 }}>
        <Title level={4}>Uçuş bilgisi bulunamadı.</Title>
        <Button onClick={() => navigate('/flights')}>Uçuşlara Dön</Button>
      </div>
    );
  }

  const { from, to, date, time, airline, price, direct, duration } = state;

  return (
    <div style={{ maxWidth: 600, margin: '50px auto' , marginTop: 150 }}>
      <Card>
        <Title level={3}>Uçuş Detayı</Title>
        <Paragraph><strong>Kalkış:</strong> {from}</Paragraph>
        <Paragraph><strong>Varış:</strong> {to}</Paragraph>
        <Paragraph><strong>Tarih:</strong> {date}</Paragraph>
        <Paragraph><strong>Saat:</strong> {time}</Paragraph>
        <Paragraph><strong>Havayolu:</strong> {airline}</Paragraph>
        <Paragraph><strong>Fiyat:</strong> {price}₺</Paragraph>
        <Paragraph><strong>Aktarma:</strong> {direct ? 'Aktarmasız' : 'Aktarmalı'}</Paragraph>
        <Paragraph><strong>Uçuş Süresi:</strong> {duration} dakika</Paragraph>

        <Button
          type="primary"
          block
          style={{ marginTop: 20 }}
          onClick={() => navigate(`/flights/${state.id}/seats`, { state })}
        >
          Koltuk Seç
        </Button>

        <div style={{ height: 12 }} />

        <Button type="primary" block onClick={() => navigate('/flights')}>
          Başka Uçuş Seç
        </Button>
      </Card>
    </div>
  );
};

export default FlightDetail;
