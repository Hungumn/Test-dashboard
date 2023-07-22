import { Form, Input, Row, Col, Select } from 'antd';
import { useState } from 'react';

const Technical = (props) => {
  const {
    productTechnical,
    setProductTechnical,
    listMaterial,
    listTechnical,
  } = props

  const [material, setMaterial] = useState("");
  const [technical, setTechnical] = useState("");
  const [unit, setUnit] = useState("");
  const [parameter, setParameter] = useState("");

  const handleChangeTechnical = (id) => {
    setTechnical(id);
    listTechnical.find(item => {
      if(item.techId == id) {
        setUnit(item.unit);
      }
    })
  };

  return (<>
    <Row gutter={[16, 16]}>
      <Col span={6}>
        <Select value={material} options={listMaterial} placeholder="Select product's material" onChange={e => setMaterial(e)} />
      </Col>
      <Col span={6}>
        <Select value={technical} options={listTechnical} placeholder="Select material's technical" onChange={handleChangeTechnical} />
      </Col>
      <Col span={6}>
        <Input value={unit} placeholder="Select material's unit" disabled />
      </Col>
      <Col span={6}>
        <Input value={parameter} placeholder='Input parameter' onChange={e => setParameter(e.target.value)} />
      </Col>
    </Row>
  </>)
};

export default Technical;
