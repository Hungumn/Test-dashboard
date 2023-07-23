import { useState, useEffect } from 'react';
import { Button, Table, Modal, message } from "antd";
import { useMaterialFunc } from 'src/@core/hooks/use-material'
import MaterialModal from "src/Components/material-admin/materialModal";

const MaterialTable = ({ dataSource, getListData }) => {
    const [openModal, setOpenModal] = useState(false);
    const [dataDetail, setDataDetail] = useState(false);
    const columns = [
        { title: "Material Name", key: "materialName", dataIndex: "materialName" },
        { title: "Created by", key: "createdBy", dataIndex: "createdBy" },
        { title: "Modified by", key: "ModifiedBy", dataIndex: "ModifiedBy" },
        { title: "", key: "action", dataIndex: "materialId", render: (text) => {
            return (<>
                <Button style={{marginRight: '6px'}} type="primary" onClick={() => handleEdit(text)}>Edit</Button>
                <Button type='primary' danger onClick={() => handleDelete(text)}>Delete</Button>
            </>)
        } },
    ];
    const { DeleteMaterialFunc } = useMaterialFunc()
    const handleDelete = (id) => {
        Modal.confirm({
            centered: true,
            title: "Are you sure?",
            content: "Are you sure to delete this material?",
            okText: "Delete",
            okButtonProps: { danger: true },
            onOk() {
                const result = DeleteMaterialFunc(id);
                if(result) {
                    message.success("Delete material successfully");
                    getListData();
                } else {
                    message.error("Delete material failed");
                }
            },
        });
    };

    const handleEdit = (id) => {
        setOpenModal(true);
        const record = dataSource.find(item => item.materialId == id);
        setDataDetail(record);
    };

    return (<>
        <Table
            key="materialId"
            columns={columns}
            dataSource={dataSource}
        >

        </Table>
        <MaterialModal visible={openModal} dataDetail={dataDetail} type="Update" setVisible={setOpenModal} getListData={getListData} />
    </>)
};

export default MaterialTable;