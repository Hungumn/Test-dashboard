import { useState, useEffect } from 'react';
import { Button, Table, Modal, message } from "antd";
import { useOrderFunc } from 'src/@core/hooks/use-cart'
import { useRouter } from 'next/router';

const OrderTable = ({ dataSource, getListData }) => {
    const router = useRouter();
    
    const columns = [
        { title: "Order customer", key: "recipientName", dataIndex: "recipientName" },
        { title: "Address", key: "address", dataIndex: "address" },
        { title: "PhoneNo", key: "phoneNo", dataIndex: "phoneNo" },
        { title: "Total Price", key: "totalPrice", dataIndex: "totalPrice" },
        { title: "Created by", key: "createdBy", dataIndex: "createdBy" },
        { title: "Modified by", key: "ModifiedBy", dataIndex: "ModifiedBy" },
        { title: "", key: "action", dataIndex: "orderId", render: (text) => {
            return (<>
                <Button style={{ marginRight: '6px' }} type='primary' onClick={() => handleDetail(text)}>Detail</Button>
                <Button type='primary' danger onClick={() => handleDelete(text)}>Delete</Button>
            </>)
        } },
    ];
    const { DeleteTechnicalFunc } = useOrderFunc()
    const handleDelete = (id) => {
        Modal.confirm({
            centered: true,
            title: "Are you sure?",
            content: "Are you sure to delete this technical?",
            okText: "Delete",
            okButtonProps: { danger: true },
            onOk() {
                const result = DeleteTechnicalFunc(id);
                if(result) {
                    message.success("Delete technical successfully");
                    getListData();
                } else {
                    message.error("Delete technical failed");
                }
            },
        });
    };

    const handleDetail = (id) => {
        router.push(`/orders-admin/${id}`)
    };

    return (<>
        <Table
            key="orderId"
            columns={columns}
            dataSource={dataSource}
        >

        </Table>
    </>)
};

export default OrderTable;