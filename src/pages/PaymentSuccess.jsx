import { Typography, Button, Card } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  return (
    <div style={{ maxWidth: 500, margin: '100px auto' }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center' }}>Ödeme Başarılı!</Title>
        <Paragraph style={{ textAlign: 'center' }}>
          Rezervasyonunuz başarıyla tamamlandı. Teşekkür ederiz.
        </Paragraph>

        {state && (
          <div style={{ marginTop: 20 }}>
            <Text strong>Uçuş:</Text> {state.from} → {state.to}<br />
            <Text strong>Tarih:</Text> {state.date}<br />
            <Text strong>Saat:</Text> {state.time}<br />
            <Text strong>Koltuk:</Text> {state.seat}<br />
            <Text strong>Toplam Ücret:</Text> {state.price}₺<br />
            <Text strong>Değişiklik Hakkı:</Text>{' '}
            {state.changeSeatOption === 'Evet' ? 'Evet (+50₺)' : 'Hayır'}
          </div>
        )}

        <Button type="primary" style={{ marginTop: 24 }} block onClick={() => navigate('/flights')}>
          Uçuşlara Dön
        </Button>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
