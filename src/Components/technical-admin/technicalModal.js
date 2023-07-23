import { Button, Modal, Form, Input, Select, message } from "antd";
import { useEffect } from "react";
import { useState } from 'react';
import { useTechnicalFunc } from 'src/@core/hooks/use-technical'

const TechnicalForm = (props) => {
    const {
        visible,
        setVisible,
        type,
        dataDetail,
        getListData
    } = props;
    const [form] = Form.useForm();
    const technicalFunc = useTechnicalFunc();

    useEffect(async() => {
        form.setFieldValue("name", dataDetail?.techName);
        form.setFieldValue("unit", dataDetail?.unit);
    }, [dataDetail]);

    const handleSubmit = () => {
        form.validateFields()
            .then(async(res) => {
                let formData = {
                    techName: res.name,
                    unit: res.unit,
                    createdBy: "admin",
                    modifiedBy: "admin",
                };
                const result = await technicalFunc[`${type}TechnicalFunc`](formData, dataDetail?.techId);  
                if(result) {
                    message.success(`${type} technical successfully`);
                    setVisible(false);
                    getListData();
                } else {
                    message.error(`${type} technical failed`);
                }
            })
            .catch(err => console.log(err))
    };

    return (<>
        <Modal open={visible} okText={type} onOk={handleSubmit} title="Technical Form" onCancel={() => setVisible(false)}>
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Technical Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input technical name!' }]}
                >
                    <Input placeholder="Enter the technical's name" />
                </Form.Item>
                <Form.Item
                    label="Unit"
                    name="unit"
                    rules={[{ required: true, message: 'Please input technical unit!' }]}
                >
                    <Input placeholder="Enter the technical's unit" />
                </Form.Item>
            </Form>
        </Modal>
    </>)
};

export default TechnicalForm;