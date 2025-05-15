import { Form, Input, Button, Typography, Card, message, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title } = Typography;
const { Option } = Select;

const Register = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const payload = {
                name: values.name,
                email: values.email,
                password: values.password,
                phone: values.phone,
                gender: values.gender,
                city: values.city,
                country: values.country,
                avatar: '' 
            };

            await axios.post('https://api.sheetbest.com/sheets/0ea0d063-eebf-41ea-8c1c-8bbe43ab01f7', payload);

            message.success('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz.');
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        } catch (error) {
            console.error('Kayıt hatası:', error);
            message.error('Kayıt sırasında bir hata oluştu.');
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Kayıt Hatalı:', errorInfo);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Card style={{ width: 400 }}>
                <Title level={3} style={{ textAlign: 'center' }}>Kayıt Ol</Title>
                <Form
                    name="register"
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item label="Ad Soyad" name="name" rules={[{ required: true, message: 'İsim giriniz' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Email" name="email" rules={[
                        { required: true, message: 'Email giriniz' },
                        { type: 'email', message: 'Geçerli bir email giriniz' }
                    ]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Telefon Numarası" name="phone" rules={[
                        { required: true, message: 'Telefon numarası giriniz' },
                        { pattern: /^\d{10,15}$/, message: 'Geçerli bir telefon numarası girin' }
                    ]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Şifre" name="password" rules={[{ required: true, message: 'Şifre giriniz' }]} hasFeedback>
                        <Input.Password />
                    </Form.Item>

                    <Form.Item label="Şifre Tekrar" name="confirm" dependencies={['password']} hasFeedback
                        rules={[
                            { required: true, message: 'Şifre tekrar zorunlu' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) return Promise.resolve();
                                    return Promise.reject('Şifreler eşleşmiyor!');
                                }
                            })
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item label="Cinsiyet" name="gender" rules={[{ required: true, message: 'Cinsiyet seçiniz' }]}>
                        <Select placeholder="Cinsiyet seçiniz">
                            <Option value="Erkek">Erkek</Option>
                            <Option value="Kadın">Kadın</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Şehir" name="city" rules={[{ required: true, message: 'Şehir giriniz' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Ülke" name="country" rules={[{ required: true, message: 'Ülke giriniz' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Kayıt Ol
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Register;
