import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Table, Modal, message } from "antd";
import { useCategoryFunc } from 'src/@core/hooks/use-category'
import CategoryModal from "src/Components/category-admin/categoryModal";

const CategoryTable = ({ dataSource, getListCategory }) => {
    const [modal, contextHolder] = Modal.useModal();
    const [openModal, setOpenModal] = useState(false);
    const [categoryDetail, setCategoryDetail] = useState(false);
    const columns = [
        { title: "Category Name", key: "categoryName", dataIndex: "categoryName" },
        { title: "Created by", key: "createdBy", dataIndex: "createdBy" },
        { title: "Modified by", key: "ModifiedBy", dataIndex: "ModifiedBy" },
        { title: "", key: "action", dataIndex: "categoryId", render: (text) => {
            return (<>
                <Button style={{marginRight: '6px'}} type="primary" onClick={() => handleEdit(text)}>Edit</Button>
                <Button type='primary' danger onClick={() => handleDelete(text)}>Delete</Button>
            </>)
        } },
    ];
    const router = useRouter();
    const { DeleteCategoryFunc } = useCategoryFunc()
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const handleDelete = (id) => {
        modal.confirm({
            centered: true,
            title: "Are you sure?",
            content: "Are you sure to delete this category?",
            okText: "Delete",
            okButtonProps: { danger: true },
            onOk: async() => {
                const result = await DeleteCategoryFunc(id);
                if(result) {
                    message.success("Delete category successfully");
                    getListCategory();
                } else {
                    message.error("Delete category failed");
                }
            },
        });
    };

    const handleEdit = (id) => {
        setOpenModal(true);
        const record = dataSource.find(item => item.categoryId == id);
        setCategoryDetail(record);
    };

    return (<>
        <div>{contextHolder}</div>
        <Table
            key="categoryId"
            rowSelection={rowSelection}
            columns={columns}
            dataSource={dataSource}
        >

        </Table>
        <CategoryModal visible={openModal} categoryDetail={categoryDetail} type="Update" setVisible={setOpenModal} getListCategory={getListCategory} />
    </>)
};

export default CategoryTable;
