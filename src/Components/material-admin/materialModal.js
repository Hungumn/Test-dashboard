import { Button, Modal, Form, Input, Select, message } from "antd";
import { useEffect } from "react";
import { useState } from 'react';
import { useMaterialFunc } from 'src/@core/hooks/use-material'

const CategoryForm = (props) => {
    const {
        visible,
        setVisible,
        type,
        dataDetail,
        getListData
    } = props;
    const [form] = Form.useForm();
    const materialFunc = useMaterialFunc();
    const [listMaterial, setListMaterial] = useState([]);

    useEffect(async() => {
        if(visible) {
            const result = await materialFunc.ListMaterialFunc();
            if(result) {
                setListMaterial(result);
            }
        }
    }, [visible]);

    useEffect(async() => {
        form.setFieldValue("name", dataDetail?.materialName);
        form.setFieldValue("parentId", dataDetail?.parentId);
    }, [dataDetail]);

    const handleSubmit = () => {
        form.validateFields()
            .then(async(res) => {
                let formData = {
                    materialName: res.name,
                    parentId: res.parentId,
                    createdBy: "admin",
                    modifiedBy: "admin",
                };
                const result = await materialFunc[`${type}MaterialFunc`](formData, dataDetail?.materialId);  
                if(result) {
                    message.success(`${type} material successfully`);
                    setVisible(false);
                    getListData();
                } else {
                    message.error(`${type} material failed`);
                }
            })
            .catch(err => console.log(err))
    };

    return (<>
        <Modal open={visible} okText={type} onOk={handleSubmit} title="Material Form" onCancel={() => setVisible(false)}>
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Material Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input material name!' }]}
                >
                    <Input placeholder="Enter the material's name" />
                </Form.Item>
                <Form.Item
                    label="Material parent"
                    name="parentId"
                >
                    <Select allowClear options={listMaterial.map(i => ({label: i.materialName, value: i.materialId}))} placeholder="Enter the category's name" />
                </Form.Item>
            </Form>
        </Modal>
    </>)
};

export default CategoryForm;