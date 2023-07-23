import { useState, useEffect } from 'react';
import { Button, Table, Modal, message } from "antd";
import { useTechnicalFunc } from 'src/@core/hooks/use-technical'
import TechModal from "src/Components/technical-admin/technicalModal";

const MaterialTable = ({ dataSource, getListData }) => {
    const [openModal, setOpenModal] = useState(false);
    const [dataDetail, setDataDetail] = useState(false);
    const columns = [
        { title: "Technical Name", key: "techName", dataIndex: "techName" },
        { title: "Unit", key: "unit", dataIndex: "unit" },
        { title: "Created by", key: "createdBy", dataIndex: "createdBy" },
        { title: "Modified by", key: "ModifiedBy", dataIndex: "ModifiedBy" },
        { title: "", key: "action", dataIndex: "techId", render: (text) => {
            return (<>
                <Button style={{marginRight: '6px'}} type="primary" onClick={() => handleEdit(text)}>Edit</Button>
                <Button type='primary' danger onClick={() => handleDelete(text)}>Delete</Button>
            </>)
        } },
    ];
    const { DeleteTechnicalFunc } = useTechnicalFunc()
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

    const handleEdit = (id) => {
        setOpenModal(true);
        const record = dataSource.find(item => item.techId == id);
        setDataDetail(record);
    };

    return (<>
        <Table
            key="techId"
            columns={columns}
            dataSource={dataSource}
        >

        </Table>
        <TechModal visible={openModal} dataDetail={dataDetail} type="Update" setVisible={setOpenModal} getListData={getListData} />
    </>)
};

export default MaterialTable;