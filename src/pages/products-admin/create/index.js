import { AuthGuard } from 'src/@core/hooks/auth-guard'
import { useProductFunc } from 'src/@core/hooks/use-product'
import { useCategoryFunc } from 'src/@core/hooks/use-category'
import { useMaterialFunc } from 'src/@core/hooks/use-material'
import { useTechnicalFunc } from 'src/@core/hooks/use-technical'

import UserLayout from 'src/layouts/UserLayout'

// ** React Imports
import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { useS3Upload } from 'next-s3-upload'
import _ from 'lodash'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { Button, CardContent, Chip, Grid, TextField, Typography } from '@mui/material'
import StepBackward2 from 'mdi-material-ui/StepBackward2'
import { styled } from '@mui/material/styles'

// antd import
import { Form, Input, Row, Col, Select, Button as AButton } from 'antd';

// import component 
import Technical from "../../../Components/product-single/technical/index.js"
import { v4 as uuidv4 } from 'uuid';

const ImgStyled = styled('img')(({ theme }) => ({
  width: 200,
  height: 'auto',
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(4.5),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))

const CreateProductAdmin = () => {
  const { CreateProductFunc } = useProductFunc();
  const { ListCategoryFunc } = useCategoryFunc();
  const { ListMaterialFunc } = useMaterialFunc();
  const { ListTechincalFunc } = useTechnicalFunc();

  // ** State
  const [form] = Form.useForm();
  const [imgSrc, setImgSrc] = useState('/images/avatars/1.png')
  const [user, setUser] = useState()
  const [date, setDate] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [avatarFile, setAvatarFile] = useState()
  const [avatarURL, setAvatarURL] = useState()
  const router = useRouter()
  const productId = uuidv4();
  const { uploadToS3 } = useS3Upload()
  const path = process.env.NEXT_PUBLIC_S3_URL
  const [listCategory, setListCategory] = useState([]);
  const [listMaterial, setListMaterial] = useState([]);
  const [listTechnical, setListTechnical] = useState([]);
  const [productTechnicals, setProductTechnicals] = useState([]);

  const [product, setProduct] = useState({});

  const getListMaterial = async() => {
    const result = await ListMaterialFunc();
    if(result) setListMaterial(result);
  };

  const getListCategory = async() => {
    const result = await ListCategoryFunc();
    if(result) setListCategory(result);
  };

  const getListTechnical = async() => {
    const result = await ListTechincalFunc();
    if(result) setListTechnical(result);
  };

  useEffect(async() => {
    getListCategory();
    getListMaterial();
    getListTechnical();
    setImgSrc('/images/avatars/1.png');
    
    setProductTechnicals([{ prodTechId: 1, techId: null, unit: "", materialId: null, parameter: "" }]);
  }, []);

  const formatProductTechnical = () => {
    const listKey = ["techId", "materialId", "parameter"];
    let list = [];
    for (let i = 0; i < productTechnicals.length; i++) {
      const element = productTechnicals[i];
      let isError = false;
      listKey.forEach(key => {
        if(!element[key]) isError = true;
      });

      if(isError) continue;
       
      let item = {};
      listKey.forEach(key => {
        item[key] = element[key];
      })
      list.push(item);
    }

    return list;
  };

  const handleSubmit = () => {
    setIsLoading(true);
    form.validateFields()
      .then(async(res) => {
        const key = await handleUpload();
        const listProductTechs = formatProductTechnical();
        let data = {
          productName: res.name,
          categoryId: res.category,
          images: key,
          quantity: 15,
          price: res.price,
          description: res.description,
          productTechnicals: listProductTechs,
          createdBy: "Admin"
        };
        
        const result = await CreateProductFunc(data);
        if(result) {
          toast.success("Create product success");
          router.push(`/products-admin/${result}`);
        } else {
          toast.error("Create product failed");
        }
      })
      .catch(err => console.log(err))
      .finally(() => setIsLoading(false));
  };
   
  const handleUpload = async () => {
    try {
      let { key } = await uploadToS3(avatarFile, {
        endpoint: {
          request: {
            body: {
              projectId: productId,
              folder: 'image product'
            }
          }
        }
      })
      console.log('Image uploaded:', key)
      return key
    } catch (error) {
      console.error(error)
    }
  }

  const onChange = file => {
    const reader = new FileReader()
    const { files } = file.target
    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result)
      reader.readAsDataURL(files[0])
    }
    setAvatarFile(files[0])
    console.log('file', files[0])
  }

  return (<>
     <Card>
      <CardContent>
          <Grid item xs={12} sx={{ marginTop: 10, marginBottom: 3 }}>
            <Button
              variant='contained'
              sx={{ marginRight: 3.5 }}
              onClick={() => router.back()}
              startIcon={<StepBackward2 />}
            >
              Back
            </Button>
          </Grid>
          <Grid item xs={12} sx={{ marginTop: 10 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ImgStyled src={imgSrc} alt='Profile Pic' />
              <Box>
                <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                  Upload New Photo
                  <input
                    hidden
                    type='file'
                    onChange={onChange}
                    accept='image/png, image/jpeg'
                    id='account-settings-upload-image'
                  />
                </ButtonStyled>
                <ResetButtonStyled
                  color='error'
                  variant='outlined'
                  onClick={() => setImgSrc('/images/avatars/1.png')}
                >
                  Reset
                </ResetButtonStyled>
                <Typography variant='body2' sx={{ marginTop: 5 }}>
                  Allowed PNG or JPEG. Max size of 800K.
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Form layout='vertical' form={form}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item label="Product Name" name="name" rules={[
                    {
                      required: true,
                      message: 'Please input product name!',
                    },
                  ]}
                >
                  <Input size='large' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Category" name="category" rules={[
                    {
                      required: true,
                      message: 'Please select category!',
                    },
                  ]}
                >
                  <Select size='large' options={listCategory.map(i => ({label: i.categoryName, value: i.categoryId}))} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item label="Quantity" name="quantity" rules={[
                    {
                      required: true,
                      message: 'Please input product quantity!',
                    },
                  ]}
                >
                  <Input size='large' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Price" name="price" rules={[
                    {
                      required: true,
                      message: 'Please input product price!',
                    },
                  ]}
                >
                  <Input size='large' />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item label="Description" name="description">
                  <Input.TextArea size='large' />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Technical 
            listMaterial={listMaterial} 
            listTechnical={listTechnical}
            productTechnical={productTechnicals}
            setProductTechnical={setProductTechnicals}
          />
          <Row gutter={[16, 16]} style={{marginTop: '12px'}}>
            <Col span={24} style={{ display: 'flex', justifyContent: 'flex-end'}}>
              <AButton size='large' type="primary" loading={isLoading} onClick={handleSubmit}>Save</AButton>
            </Col>
          </Row>
      </CardContent>
    </Card>
  </>)
};

CreateProductAdmin.getLayout = page => (
  <AuthGuard role={'Admin'}>
    <UserLayout>{page}</UserLayout>
  </AuthGuard>
)

export default CreateProductAdmin;
