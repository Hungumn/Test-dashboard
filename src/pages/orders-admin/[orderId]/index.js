import { AuthGuard } from 'src/@core/hooks/auth-guard'
import UserLayout from 'src/layouts/UserLayout';
import { useOrderFunc } from 'src/@core/hooks/use-cart'

import { Form, Card, Input, Button, Select, Row, Col, Table, message } from 'antd';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const OrderDetail = () => {
    const router = useRouter();
    const [form] = Form.useForm();
    const orderId = router.query.orderId;
    const { OrderDetailFunc, UpdateOrderStatus } = useOrderFunc();
    const columns = [
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
            setDataSource(data.orderDetails);
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

    const handleChangeStatus = async() => {
        const result = await UpdateOrderStatus(orderId, "3");
        if(result) {
            message.success("Update status successfully");
        } else {
            message.error("Update status failed");
        }
    };

    return (<>
        <Card title={
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>Order detail</div>
                <Button onClick={handleChangeStatus} type='primary'>Đánh dấu là đang vận chuyển</Button>
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