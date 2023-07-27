import { AuthGuard } from 'src/@core/hooks/auth-guard'
import UserLayout from 'src/layouts/UserLayout';
import { useOrderFunc } from 'src/@core/hooks/use-cart'

import { Form, Card, Input, Button, Select, Row, Col, Table, message, Avatar } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const OrderDetail = () => {
    const router = useRouter();
    const [form] = Form.useForm();
    const orderId = router.query.orderId;
    const { OrderDetailFunc, UpdateOrderStatus, UpdateOrderIsPaid } = useOrderFunc();
    const [isPaid, setIsPaid] = useState(1);
    const [ switchBtn, setSwitchBtn ] = useState({});
    const columns = [
        { title: "Images", dataIndex: "images", key: "images", render: (text) => {
          const path = process.env.NEXT_PUBLIC_S3_URL;
          let imgSrc = '';
          if(text) {
            if(text.includes("https://")) {
              imgSrc = text;
            } else {
              imgSrc = `${path}${text}`;
            }
          }
          return (<>
            <Avatar shape="square" size="large" src={imgSrc} />
          </>)
        }},
        { title: "Product name", dataIndex: "productName", key: "productName" },
        { title: "Quantity", dataIndex: "quantity", key: "quantity" },
        { title: "Product's price", dataIndex: "price", key: "price" },
    ];
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        getOrderDetail();
    }, []);

    const getOrderDetail = async() => {
        const data = await OrderDetailFunc(orderId);
        if(data) {
            switch (data.status) {
              case 4:
                setSwitchBtn(statusList.find(i => i.value == 5));
                break;
              case 5:
                setSwitchBtn(statusList.find(i => i.value == 2));
                break;
              default:
                setSwitchBtn(statusList.find(i => i.value == 4));
                break;
            }
            setDataSource(data.orderDetails);
            setIsPaid(data.isPaid);
            setForm(data);
        }
    };

    const setForm = (data) => {
        form.setFieldValue("recipientName", data.recipientName);
        form.setFieldValue("address", data.address);
        form.setFieldValue("totalPrice", data.totalPrice);
        form.setFieldValue("isPaid", data.isPaid);
        form.setFieldValue("status", data.status);
    };

    const handleChangeStatus = async(value, key) => {
        if(key == 'status') {
            const result = await UpdateOrderStatus(orderId, value);
            if(result) {
                message.success("Update status successfully");
            } else {
                message.error("Update status failed");
            }
        } else {
            const result = await UpdateOrderIsPaid(orderId, 2);
            if(result) {
                message.success("Update payment status successfully");
                form.setFieldValue("isPaid", 2);
                setIsPaid(2);
            } else {
                message.error("Update payment status failed");
            }
        }
    };

    const statusList = [
      { label: "Switch to the shipping", value: 4, key: "status" },
      { label: "Switch to the delivered", value: 5, key: "status" },
      { label: "Switch to the Paided", value: 2, key: "isPaid" },
    ];

    return (<>
        <Card title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Button type='link' icon={<ArrowLeftOutlined />} size="large" onClick={() => router.push("/orders-admin")} style={{ marginBottom: '8px', padding: '0' }}>
                    Back to list
                  </Button>
                  <div style={{ height: '40px', fontSize: '18px' }}>Order detail</div>
                </div>
                <Button onClick={() => handleChangeStatus(switchBtn.value, switchBtn.key)} disabled={isPaid == 1 ? false : true} type='primary'>{switchBtn.label}</Button>
            </div>
        }>
            <Form layout='vertical' form={form}>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Form.Item
                            label="Recipient"
                            name="recipientName"
                        >
                            <Input size="large" disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Address"
                            name="address"
                        >
                            <Input size="large" disabled />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Form.Item
                            label="Phone Number"
                            name="phoneNo"
                        >
                            <Input size="large" disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Total price"
                            name="totalPrice"
                        >
                            <Input size="large" disabled />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Form.Item
                            label="Paid status"
                            name="isPaid"
                        >
                            <Select options={[
                                { label: "Not Paided", value: 1 },
                                { label: "Paided", value: 2 },
                            ]} showArrow={false} size="large" disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Order status"
                            name="status"
                        >
                            <Select options={[
                                { label: "Pinking up", value: 2 },
                                { label: "Packed", value: 3 },
                                { label: "On going deliveries", value: 4 },
                                { label: "Delivered", value: 5 },
                            ]} showArrow={false} size="large" disabled />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Table
                            pagination={false}
                            columns={columns}
                            dataSource={dataSource}
                        />
                    </Col>
                </Row>
            </Form>
        </Card>
    </>)
}

OrderDetail.getLayout = page => (
    <AuthGuard role={'Admin'}>
      <UserLayout>{page}</UserLayout>
    </AuthGuard>
  )

export default OrderDetail;
