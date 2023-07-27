import { useState, useEffect } from 'react';
import { Button, Table, Modal, message } from "antd";
import { useOrderFunc } from 'src/@core/hooks/use-cart'
import { useRouter } from 'next/router';
import moment from 'moment';

const OrderTable = ({ dataSource, getListData, loading }) => {
    const router = useRouter();

    const columns = [
        { title: "Order customer", key: "recipientName", dataIndex: "recipientName" },
        { title: "Address", key: "address", dataIndex: "address" },
        { title: "PhoneNo", key: "phoneNo", dataIndex: "phoneNo" },
        { title: "Total Price", key: "totalPrice", dataIndex: "totalPrice", render: (text) => {
          return (<>
            ${ text }
          </>)
        }},
        { title: "Paid", key: "isPaid", dataIndex: "isPaid", render: (text) => {
            return (<>
              { text == 1 ? "Not Paid" : "Paided" }
            </>)
          }},
        { title: "Created by", key: "createdBy", dataIndex: "createdBy" },
        { title: "Created date", key: "createdDate", dataIndex: "createdDate", render: (text) => {
          return (<>
            { convertToDate(text) }
          </>)
        }},
        { title: "", key: "action", dataIndex: "orderId", render: (text) => {
            return (<>
                <Button style={{ marginRight: '6px' }} type='primary' onClick={() => handleDetail(text)}>Detail</Button>
            </>)
        }},
    ];
    const { DeleteTechnicalFunc } = useOrderFunc()
    const convertToDate = (timestamp) => {
      console.log(timestamp);
      return moment.unix(timestamp).format("DD/MM/YYYY HH:mm:ss")
    };
    const handleDelete = (id) => {
        Modal.confirm({
            centered: true,
            title: "Are you sure?",
            content: "Are you sure to delete this order?",
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
            loading={loading}
            key="orderId"
            columns={columns}
            dataSource={dataSource}
        >

        </Table>
    </>)
};

export default OrderTable;
