import { useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    SearchOutlined,
    UserOutlined,
    BookOutlined,
    LogoutOutlined
} from '@ant-design/icons';

const { Sider, Header, Content } = Layout;

const MainLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [user, setUser] = useState(() => {
        const data = localStorage.getItem('user');
        return data ? JSON.parse(data) : null;
    });

    useEffect(() => {
        const updateUser = () => {
            const updatedUser = JSON.parse(localStorage.getItem('user'));
            setUser(updatedUser);
        };

        updateUser();
        const interval = setInterval(updateUser, 1000);
        return () => clearInterval(interval);
    }, [location.pathname]);

    const menuItems = [
        { key: 'flights', icon: <SearchOutlined />, label: 'Uçuş Ara' },
        { key: 'profile', icon: <UserOutlined />, label: 'Profilim' },
        { key: 'reservations', icon: <BookOutlined />, label: 'Rezervasyonlarım' },
        { key: 'logout', icon: <LogoutOutlined />, label: 'Çıkış Yap' }
    ];

    const selectedKey =
        ['flights', 'profile', 'reservations'].find((key) =>
            location.pathname.includes(key)
        ) || '';

    const handleClick = ({ key }) => {
        if (key === 'logout') {
            localStorage.clear();
            navigate('/login');
        } else {
            navigate(`/${key}`);
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                width={200}
                theme="light"
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    borderRight: '1px solid #f0f0f0',
                    zIndex: 100
                }}
            >
                <div
                    style={{
                        padding: 16,
                        textAlign: 'center',
                        borderBottom: '1px solid #eee'
                    }}
                >
                    <img
                        src={user?.avatar || 'https://i.pravatar.cc/100'}
                        alt="Avatar"
                        style={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            marginBottom: 8
                        }}
                    />
                    <div style={{ fontWeight: 'bold', color: 'black' }}>
                        {user?.name || 'Kullanıcı'}
                    </div>
                </div>

                <Menu
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    onClick={handleClick}
                    items={[{ type: 'group', label: 'Menü' }, ...menuItems]}
                />
            </Sider>

            <Layout style={{ marginLeft: 200 }}>
                <Header
                    style={{
                        backgroundColor: '#c62828',
                        color: 'white',
                        fontFamily: 'Pacifico, cursive',
                        fontSize: 26,
                        padding: '10px 0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                    }}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: 28 }}>
                        flight_takeoff
                    </span>
                    FlyRes
                </Header>

                <Content style={{ margin: '24px', marginTop: 10 }}>
                    <div
                        style={{
                            background: '#fff',
                            padding: 24,
                            minHeight: 'calc(100vh - 112px)',
                            borderRadius: 8,
                            boxShadow: '0 2px 8px rgba(56, 55, 55, 0.12)'
                        }}
                    >
                        {children}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
