import { Table } from "antd";

const TechnicalTable = ({ dataSource }) => {
  const columns = [
    { title: "Material", dataIndex: "materialName", key: "materialName"},
    { title: "Technical", dataIndex: "techName", key: "techName" },
    { title: "Parameter", dataIndex: "parameter", key: "parameter" },
    { title: "Unit", dataIndex: "unit", key: "unit" }
  ];

  return (<>
    <Table
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      bordered
    >

    </Table>
  </>)
};

export default TechnicalTable;
