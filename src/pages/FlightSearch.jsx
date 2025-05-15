import { useState } from 'react';
import {
  Form,
  Select,
  DatePicker,
  Input,
  InputNumber,
  Button,
  Card,
  Typography,
  message,
  Row,
  Col
} from 'antd';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Option } = Select;

const mockFlights = [
  {
    id: 1,
    from: 'İstanbul',
    to: 'Ankara',
    date: '2025-06-01',
    time: '09:30',
    airline: 'THY',
    price: 950,
    direct: true,
    duration: 75
  },
  {
    id: 2,
    from: 'İzmir',
    to: 'Antalya',
    date: '2025-06-01',
    time: '14:00',
    airline: 'Pegasus',
    price: 750,
    direct: false,
    duration: 140
  },
  {
    id: 3,
    from: 'İstanbul',
    to: 'Ankara',
    date: '2025-06-01',
    time: '18:15',
    airline: 'AnadoluJet',
    price: 800,
    direct: false,
    duration: 80
  },
  {
    id: 4,
    from: 'Antalya',
    to: 'İzmir',
    date: '2025-06-02',
    time: '11:45',
    airline: 'Pegasus',
    price: 690,
    direct: true,
    duration: 95
  },
  {
    id: 5,
    from: 'İstanbul',
    to: 'İzmir',
    date: '2025-06-03',
    time: '10:00',
    airline: 'SunExpress',
    price: 720,
    direct: false,
    duration: 110
  },
  {
    id: 6,
    from: 'Ankara',
    to: 'İstanbul',
    date: '2025-06-02',
    time: '08:00',
    airline: 'THY',
    price: 880,
    direct: true,
    duration: 80
  },
  {
    id: 7,
    from: 'Antalya',
    to: 'Ankara',
    date: '2025-06-03',
    time: '16:20',
    airline: 'AnadoluJet',
    price: 810,
    direct: true,
    duration: 100
  },
  {
    id: 8,
    from: 'İzmir',
    to: 'Ankara',
    date: '2025-06-04',
    time: '13:30',
    airline: 'SunExpress',
    price: 760,
    direct: false,
    duration: 120
  },
  {
    id: 9,
    from: 'İstanbul',
    to: 'Antalya',
    date: '2025-06-01',
    time: '07:00',
    airline: 'FlyBag',
    price: 690,
    direct: true,
    duration: 70
  },
  {
    id: 10,
    from: 'Ankara',
    to: 'İzmir',
    date: '2025-06-02',
    time: '15:30',
    airline: 'SunExpress',
    price: 850,
    direct: false,
    duration: 125
  },
  {
    id: 11,
    from: 'İzmir',
    to: 'İstanbul',
    date: '2025-06-03',
    time: '19:00',
    airline: 'Pegasus',
    price: 715,
    direct: true,
    duration: 90
  },
  {
    id: 12,
    from: 'Ankara',
    to: 'Antalya',
    date: '2025-06-04',
    time: '06:30',
    airline: 'THY',
    price: 980,
    direct: true,
    duration: 95
  },
  {
    id: 13,
    from: 'Antalya',
    to: 'İstanbul',
    date: '2025-06-03',
    time: '21:00',
    airline: 'THY',
    price: 640,
    direct: false,
    duration: 130
  },
  {
    id: 14,
    from: 'İzmir',
    to: 'Antalya',
    date: '2025-06-04',
    time: '17:10',
    airline: 'AnadoluJet',
    price: 770,
    direct: true,
    duration: 105
  }
];


const FlightSearch = () => {
  const [filteredFlights, setFilteredFlights] = useState([]);
  const navigate = useNavigate();

  const onFinish = (values) => {
    if (!values.date) {
      message.warning('Lütfen tarih seçin!');
      return;
    }

    const selectedDate = values.date.format('YYYY-MM-DD');

    const results = mockFlights.filter((flight) => {
      const matchFrom = flight.from === values.from;
      const matchTo = flight.to === values.to;
      const matchDate = flight.date === selectedDate;
      const matchAirline = values.airline ? flight.airline === values.airline : true;
      const matchDirect = values.direct !== undefined
        ? flight.direct === (values.direct === 'true')
        : true;
      const matchDuration = values.maxDuration
        ? flight.duration <= parseInt(values.maxDuration)
        : true;
      const matchPrice =
        (values.minPrice ? flight.price >= values.minPrice : true) &&
        (values.maxPrice ? flight.price <= values.maxPrice : true);

      return matchFrom && matchTo && matchDate && matchAirline && matchDirect && matchDuration && matchPrice;
    });

    setFilteredFlights(results);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '50px auto' }}>
      <Row gutter={24}>
        <Col xs={24} md={12}>
          <Card>
            <Title level={3}>Uçuş Ara</Title>
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item label="Kalkış Noktası" name="from" rules={[{ required: true }]}>
                <Select placeholder="Seçiniz">
                  <Option value="Ankara">Ankara</Option>
                  <Option value="İstanbul">İstanbul</Option>
                  <Option value="İzmir">İzmir</Option>
                  <Option value="Antalya">Antalya</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Varış Noktası" name="to" rules={[{ required: true }]}>
                <Select placeholder="Seçiniz">
                  <Option value="Ankara">Ankara</Option>
                  <Option value="İstanbul">İstanbul</Option>
                  <Option value="Antalya">Antalya</Option>
                  <Option value="İzmir">İzmir</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Uçuş Tarihi" name="date" rules={[{ required: true }]}>
                <DatePicker format="YYYY-MM-DD" disabledDate={(d) => d.isBefore(dayjs(), 'day')} />
              </Form.Item>

              <Form.Item label="Havayolu Şirketi" name="airline">
                <Select placeholder="Seçiniz" allowClear>
                  <Option value="THY">THY</Option>
                  <Option value="Pegasus">Pegasus</Option>
                  <Option value="AnadoluJet">AnadoluJet</Option>
                  <Option value="SunExpress">SunExpress</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Aktarma" name="direct">
                <Select placeholder="Seçiniz" allowClear>
                  <Option value="true">Aktarmasız</Option>
                  <Option value="false">Aktarmalı</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Maksimum Uçuş Süresi (dakika)" name="maxDuration">
                <InputNumber min={1} style={{ width: '100%' }} placeholder="örn. 120" />
              </Form.Item>

              <Form.Item label="Fiyat Aralığı">
                <Input.Group compact>
                  <Form.Item name="minPrice" noStyle>
                    <InputNumber style={{ width: '48%' }} placeholder="Min ₺" min={0} />
                  </Form.Item>
                  <Form.Item name="maxPrice" noStyle>
                    <InputNumber style={{ width: '48%', marginLeft: '4%' }} placeholder="Max ₺" min={0} />
                  </Form.Item>
                </Input.Group>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Uçuşları Göster
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          {filteredFlights.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <Title level={4}>Uygun Uçuşlar</Title>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {filteredFlights.map((flight) => (
                  <Card
                    key={flight.id}
                    hoverable
                    onClick={() => navigate(`/flights/${flight.id}`, { state: flight })}
                    style={{ cursor: 'pointer', borderRadius: 8 }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <strong>{flight.from} → {flight.to}</strong>
                      <span style={{ fontWeight: '500', color: '#555' }}>{flight.airline}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 13, color: '#666' }}>
                      <span>{flight.date} {flight.time}</span>
                      <span>{flight.duration} dk</span>
                      <span style={{ fontWeight: 'bold', color: flight.direct ? '#28a745' : '#d9534f' }}>
                        {flight.direct ? 'Aktarmasız' : 'Aktarmalı'}
                      </span>
                    </div>

                    <div style={{ marginTop: 10, fontWeight: 'bold', fontSize: 16 }}>
                      {flight.price}₺
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default FlightSearch;
