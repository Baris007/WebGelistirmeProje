import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Input, message, Avatar, Upload, Row, Col } from 'antd';
import axios from 'axios';
import { UploadOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const [editName, setEditName] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [editPassword, setEditPassword] = useState('');
    const [editGender, setEditGender] = useState('');
    const [editCity, setEditCity] = useState('');
    const [editCountry, setEditCountry] = useState('');

    const [avatarUrl, setAvatarUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const [isEditing, setIsEditing] = useState({
        name: false,
        phone: false,
        password: false,
        gender: false,
        city: false,
        country: false,
    });

    useEffect(() => {
        const isAuth = localStorage.getItem('auth');
        const userData = localStorage.getItem('user');

        if (!isAuth || !userData) {
            navigate('/login');
        } else {
            const parsed = JSON.parse(userData);
            setUser(parsed);
            setEditName(parsed.name || '');
            setEditPhone(parsed.phone || '');
            setEditGender(parsed.gender || '');
            setEditCity(parsed.city || '');
            setEditCountry(parsed.country || '');
            setAvatarUrl(parsed.avatar || 'https://i.pravatar.cc/100');
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const updateField = async (fieldName, value, successMsg, key) => {
        try {
            await axios.patch(
                `https://api.sheetbest.com/sheets/0ea0d063-eebf-41ea-8c1c-8bbe43ab01f7/email/${user.email}`,
                { [fieldName]: value }
            );
            const updatedUser = { ...user, [fieldName]: value };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setIsEditing((prev) => ({ ...prev, [key]: false }));
            message.success(successMsg);
        } catch (error) {
            console.error(`${fieldName} güncelleme hatası:`, error);
            message.error('Google Sheet güncellenemedi.');
        }
    };

    const handleAvatarUpload = async (file) => {
        setIsUploading(true);
        const reader = new FileReader();
        reader.onload = async (e) => {
            const base64 = e.target.result;
            await updateField('avatar', base64, 'Profil fotoğrafı güncellendi!', null);
            setAvatarUrl(base64);
            setIsUploading(false);
        };
        reader.readAsDataURL(file);
        return false;
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}>
            <div style={{
                display: 'flex',
                background: 'white',
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                width: 900,
                marginTop: 100
            }}>

                <div style={{ background: '#f0f2f5', padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', width: 250 }}>
                    <Avatar size={120} src={avatarUrl} style={{ marginTop: 80 }} />
                    <Upload showUploadList={false} beforeUpload={handleAvatarUpload}>
                        <Button icon={<UploadOutlined />} loading={isUploading} style={{ marginTop: 16 }}>
                            Profil Fotoğrafı Yükle
                        </Button>
                    </Upload>
                </div>


                <div style={{ flex: 1, padding: 24 }}>
                    <Title level={3}>Profil Bilgileri</Title>

                    <InfoRow label="Ad Soyad" value={editName} editing={isEditing.name}
                        onChange={setEditName} onEdit={() => setIsEditing(p => ({ ...p, name: true }))}
                        onSave={() => updateField('name', editName, 'İsim güncellendi!', 'name')}
                        onCancel={() => { setEditName(user.name); setIsEditing(p => ({ ...p, name: false })); }}
                    />

                    <InfoRow label="Telefon" value={editPhone} editing={isEditing.phone}
                        onChange={setEditPhone} onEdit={() => setIsEditing(p => ({ ...p, phone: true }))}
                        onSave={() => updateField('phone', editPhone, 'Telefon güncellendi!', 'phone')}
                        onCancel={() => { setEditPhone(user.phone); setIsEditing(p => ({ ...p, phone: false })); }}
                    />

                    <InfoRow
                        label="Şifre"
                        value={editPassword}
                        editing={isEditing.password}
                        isPassword={true}
                        onChange={setEditPassword}
                        onEdit={() => setIsEditing((p) => ({ ...p, password: true }))}
                        onSave={() => updateField('password', editPassword, 'Şifre güncellendi!', 'password')}
                        onCancel={() => {
                            setEditPassword('');
                            setIsEditing((p) => ({ ...p, password: false }));
                        }}
                    />

                    <InfoRow label="Cinsiyet" value={editGender} editing={isEditing.gender}
                        onChange={setEditGender} onEdit={() => setIsEditing(p => ({ ...p, gender: true }))}
                        onSave={() => updateField('gender', editGender, 'Cinsiyet güncellendi!', 'gender')}
                        onCancel={() => { setEditGender(user.gender); setIsEditing(p => ({ ...p, gender: false })); }}
                    />

                    <InfoRow label="Şehir" value={editCity} editing={isEditing.city}
                        onChange={setEditCity} onEdit={() => setIsEditing(p => ({ ...p, city: true }))}
                        onSave={() => updateField('city', editCity, 'Şehir güncellendi!', 'city')}
                        onCancel={() => { setEditCity(user.city); setIsEditing(p => ({ ...p, city: false })); }}
                    />

                    <InfoRow label="Ülke" value={editCountry} editing={isEditing.country}
                        onChange={setEditCountry} onEdit={() => setIsEditing(p => ({ ...p, country: true }))}
                        onSave={() => updateField('country', editCountry, 'Ülke güncellendi!', 'country')}
                        onCancel={() => { setEditCountry(user.country); setIsEditing(p => ({ ...p, country: false })); }}
                    />

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 30 }}>
                        <Button onClick={() => navigate('/flights')}>Ana Sayfa</Button>
                        <Button type="primary" danger onClick={handleLogout}>Çıkış Yap</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InfoRow = ({ label, value, editing, isPassword, onChange, onEdit, onSave, onCancel }) => (
    <div style={{ marginBottom: 12 }}>
        <strong>{label}:</strong>{' '}
        {editing ? (
            <>
                <Input
                    type={isPassword ? 'password' : 'text'}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    style={{ width: 200, marginRight: 8 }}
                />
                <Button size="small" type="primary" onClick={onSave}>Kaydet</Button>
                <Button size="small" onClick={onCancel} style={{ marginLeft: 8 }}>İptal</Button>
            </>
        ) : (
            <>
                {value || 'Belirtilmemiş'}{' '}
                <Button type="link" onClick={onEdit}>Düzenle</Button>
            </>
        )}
    </div>
);

export default Profile;
