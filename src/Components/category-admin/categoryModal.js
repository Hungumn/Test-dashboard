import { Button, Modal, Form, Input, Select, message } from "antd";
import { useEffect } from "react";
import { useState } from 'react';
import { useCategoryFunc } from 'src/@core/hooks/use-category'

const CategoryForm = (props) => {
    const {
        visible,
        setVisible,
        type,
        categoryDetail,
        getListCategory
    } = props;
    const [form] = Form.useForm();
    const categoryFunc = useCategoryFunc();
    const [listCategory, setListCategory] = useState([]);

    useEffect(async() => {
        const result = await categoryFunc.ListCategoryFunc();
        if(result) {
            setListCategory(result.data);
        }
    }, [visible]);

    useEffect(async() => {
        form.setFieldValue("name", categoryDetail?.categoryName);
        form.setFieldValue("parentId", categoryDetail?.parentId);
    }, [categoryDetail]);

    const handleSubmit = () => {
        form.validateFields()
            .then(async(res) => {
                let formData = {
                    categoryName: res.name,
                    parentId: res.parentId,
                    createdBy: "admin",
                    modifiedBy: "admin",
                };
                const result = await categoryFunc[`${type}CategoryFunc`](formData, categoryDetail?.categoryId);  
                if(result) {
                    message.success(`${type} category successfully`);
                    setVisible(false);
                    getListCategory();
                } else {
                    message.error(`${type} category failed`);
                }
            })
            .catch(err => console.log(err))
    };

    return (<>
        <Modal open={visible} okText={type} onOk={handleSubmit} title="Category Form" onCancel={() => setVisible(false)}>
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Category Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input category name!' }]}
                >
                    <Input placeholder="Enter the category's name" />
                </Form.Item>
                <Form.Item
                    label="Category parent"
                    name="parentId"
                >
                    <Select allowClear options={listCategory.map(i => ({label: i.categoryName, value: i.categoryId}))} placeholder="Enter the category's name" />
                </Form.Item>
            </Form>
        </Modal>
    </>)
};

export default CategoryForm;