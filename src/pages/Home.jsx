import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button } from 'antd';

const { Title } = Typography;

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuth = localStorage.getItem('auth');
    if (!isAuth) {
      navigate('/login');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth');
    navigate('/login');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: 100 }}>
      <Title>Hoş Geldin!</Title>
      <p>Burası Ana Sayfa. Giriş başarılı </p>
      <Button type="primary" danger onClick={handleLogout}>
        Çıkış Yap
      </Button>
    </div>
  );
};

export default Home;
