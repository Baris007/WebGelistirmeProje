import { Form, Input, Button, Typography, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';

const { Title } = Typography;

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await axios.get('https://api.sheetbest.com/sheets/0ea0d063-eebf-41ea-8c1c-8bbe43ab01f7');
            const users = response.data;

            const matchedUser = users.find(
                (user) => user.email === values.email && user.password === values.password
            );

            if (matchedUser) {
                localStorage.setItem('auth', 'true');
                localStorage.setItem('user', JSON.stringify(matchedUser));
                message.success('Giriş başarılı!');
                navigate('/flights');
            } else {
                message.error('Email veya şifre yanlış!');
            }
        } catch (error) {
            console.error('Login hatası:', error);
            message.error('Sunucu hatası! Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className='background'
            style={{
                backgroundColor: 'rgba(128, 172, 192, 0.37)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                height: '100vh',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                zIndex: 0
            }}

        >
            <div
                style={{
                    fontFamily: "'Pacifico', cursive",
                    fontSize: '64px',
                    color: 'rgba(145, 48, 48, 0.5)',
                    marginBottom: '20px',
                    textShadow: '2px 2px 6px rgba(41, 25, 25, 0.5)'
                }}
            >
                FlyRes
            </div>
            <div
                style={{
                    fontFamily: '"Playfair Display", serif',
                    fontSize: '24px',
                    color: '#000000',
                    textAlign: 'center',
                    textShadow: '1px 1px 4px rgba(0,0,0,0.6)',
                    marginBottom: 40
                }}
            >
                Gökyüzü seni bekliyor; rüzgar dostun, ufuk yol arkadaşın.
                <br />
                Bir hayaldi belki dün, ama bugün tek bir dokunuşla başlıyor yolculuğun.
            </div>

            <Card style={{ width: 350, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                <Title level={3} style={{ textAlign: 'center' }}>Giriş Yap</Title>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Email zorunludur' },
                            { type: 'email', message: 'Geçerli bir email giriniz' }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Şifre"
                        name="password"
                        rules={[{ required: true, message: 'Şifre zorunludur' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            Giriş Yap
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center' }}>
                        <span>Hesabınız yok mu? </span>
                        <Button type="link" onClick={() => navigate('/register')}>
                            Kayıt Ol
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Login;
