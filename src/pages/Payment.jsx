import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, Typography, message, Descriptions } from 'antd';
import axios from 'axios';
import emailjs from '@emailjs/browser';

const { Title } = Typography;

const Payment = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state) {
        return (
            <div style={{ textAlign: 'center', marginTop: 100 }}>
                <Title level={4}>Ödeme bilgisi eksik.</Title>
                <Button onClick={() => navigate('/flights')}>Uçuşlara Dön</Button>
            </div>
        );
    }

    const onFinish = async (values) => {
        try {
            const fullReservation = {
                ...state,
                phone: values.phone
            };

            await axios.post(
                'https://api.sheetbest.com/sheets/a5724a0d-a348-4219-99f1-5461be99ee97',
                fullReservation
            );

            await emailjs.send(
                'service_ecekx9j',
                'template_epx9jym',
                {
                    name: values.name,
                    email: state.email,
                    flight_details: `${state.from} → ${state.to} | ${state.date} ${state.time} | ${state.airline} | Koltuk: ${state.seat}`,
                    change_seat: state.changeSeatOption === 'Evet' ? 'Evet' : 'Hayır',
                    phone: values.phone
                },
                '65v7zZc2OWG5txJre'
            );

            message.success('Ödeme ve e-posta başarıyla tamamlandı!');
            navigate('/payment-success', { state: fullReservation });
        } catch (error) {
            console.error('Hata:', error);
            message.error('İşlem sırasında bir hata oluştu.');
        }
    };


    return (
        <div style={{ maxWidth: 500, margin: '50px auto' }}>
            <Card>
                <Title level={3} style={{ textAlign: 'center' }}>Ödeme Yap</Title>


                <Descriptions column={1} bordered style={{ marginBottom: 24 }}>
                    <Descriptions.Item label="Uçuş">
                        {state.from} → {state.to}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tarih">{state.date}</Descriptions.Item>
                    <Descriptions.Item label="Saat">{state.time}</Descriptions.Item>
                    <Descriptions.Item label="Havayolu">{state.airline}</Descriptions.Item>
                    <Descriptions.Item label="Koltuk">{state.seat}</Descriptions.Item>
                    <Descriptions.Item label="Değişiklik Hakkı">
                        {state.changeSeatOption === 'Evet' ? 'Evet (+50₺)' : 'Hayır'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Toplam Ücret">{state.price}₺</Descriptions.Item>
                </Descriptions>

                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item label="Kart Üzerindeki İsim" name="name" rules={[{ required: true }]}>
                        <Input placeholder="Ad Soyad" />
                    </Form.Item>
                    <Form.Item
                        label="Telefon Numarası"
                        name="phone"
                        rules={[{ required: true, message: 'Lütfen telefon numaranızı girin!' }]}
                    >
                        <Input placeholder="05xxxxxxxxx" />
                    </Form.Item>
                    <Form.Item label="Kart Numarası" name="cardNumber" rules={[{ required: true }]}>
                        <Input placeholder="1234 5678 9012 3456" maxLength={16} />
                    </Form.Item>
                    <Form.Item
                        label="Son Kullanma Tarihi"
                        name="expiry"
                        rules={[
                            { required: true, message: 'Lütfen kartın son kullanma tarihini girin!' },
                            {
                                validator: (_, value) => {
                                    if (!value) return Promise.resolve();

                                    const [month, year] = value.split('/');
                                    if (!month || !year || isNaN(month) || isNaN(year)) {
                                        return Promise.reject('Geçerli bir format girin (MM/YY)');
                                    }

                                    const inputMonth = parseInt(month, 10);
                                    const inputYear = parseInt('20' + year, 10); // "25" -> 2025 gibi

                                    if (inputMonth < 1 || inputMonth > 12) {
                                        return Promise.reject('Ay 01 ile 12 arasında olmalı');
                                    }

                                    const now = new Date();
                                    const currentMonth = now.getMonth() + 1;
                                    const currentYear = now.getFullYear();

                                    if (inputYear < currentYear || (inputYear === currentYear && inputMonth < currentMonth)) {
                                        return Promise.reject('Geçmiş bir tarih olamaz');
                                    }

                                    return Promise.resolve();
                                }
                            }
                        ]}
                    >
                        <Input placeholder="MM/YY" maxLength={5} />
                    </Form.Item>
                    <Form.Item label="CVV" name="cvv" rules={[{ required: true }]}>
                        <Input placeholder="123" maxLength={3} />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Ödemeyi Tamamla
                    </Button>
                </Form>
            </Card>
        </div>
    );
};

export default Payment;
