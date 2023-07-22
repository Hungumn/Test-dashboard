import { Form, Input, Row, Col, Select, Button } from 'antd';
import { useEffect, useState } from 'react';

const Technical = (props) => {
  const {
    productTechnical,
    setProductTechnical,
    listMaterial,
    listTechnical,
  } = props;

  const setValueProductTechnical = (id, key, value) => {
    let list = [...productTechnical]
    list.map(item => {
      if(item.prodTechId == id) {
        item[key] = value;
        if(key == "techId") {
          const selectedTech = listTechnical.find(i => i.techId == value);
          item.unit = selectedTech?.unit;
        }
      }
    });
    setProductTechnical(list);
  };

  const handleAddNew = () => {
    setProductTechnical([
      ...productTechnical, 
      { prodTechId: productTechnical.length + 1, techId: null, unit: "", materialId: null, parameter: "" }
    ]);
  };

  const handleDelete = (id) => {
    const idx = productTechnical.findIndex(item => item.prodTechId == id);
    if(idx >= 0) {
      let list = [...productTechnical];
      list.splice(idx, 1);
      setProductTechnical(list);
    }
  };

  return (<>
    <Button type="primary" onClick={handleAddNew}>Add new technical</Button>
    {productTechnical.map(item => (
      <Row gutter={[16, 16]} key={item.prodTechId} style={{marginTop: '12px'}}>
        <Col span={6}>
          <Select style={{width: '100%'}} 
            value={item.materialId} 
            options={listMaterial.map(i => ({label: i.materialName, value: i.materialId}))} 
            placeholder="Select product's material" 
            onChange={value => setValueProductTechnical(item.prodTechId, "materialId", value)}
          />
        </Col>
        <Col span={5}>
          <Select 
            style={{width: '100%'}} 
            value={item.techId} 
            options={listTechnical.map(i => ({label: i.techName, value: i.techId}))} 
            placeholder="Select material's technical" 
            onChange={value => setValueProductTechnical(item.prodTechId, "techId", value)}
          />
        </Col>
        <Col span={4}>
          <Input value={item.unit} placeholder="Select material to get unit" disabled />
        </Col>
        <Col span={6}>
          <Input 
            value={item.parameter} 
            placeholder='Input parameter' 
            onChange={e => setValueProductTechnical(item.prodTechId, "parameter", e.target.value)}
          />
        </Col>
        <Col span={3}>
          <Button style={{width: '100%'}} type="primary" danger onClick={() => handleDelete(item.prodTechId)}>Delete</Button>
        </Col>
      </Row>
    ))}
  </>)
};

export default Technical;
