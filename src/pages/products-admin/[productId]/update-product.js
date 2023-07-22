import { AuthGuard } from 'src/@core/hooks/auth-guard'
import { useProductFunc } from 'src/@core/hooks/use-product'

import UserLayout from 'src/layouts/UserLayout'

// ** React Imports
import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { useUsersAdminFunc } from 'src/@core/hooks/use-user-admin'
import { useS3Upload } from 'next-s3-upload'
import _ from 'lodash'
import * as Yup from 'yup'
import moment from 'moment/moment'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { Button, CardContent, Chip, Grid, TextField, Typography } from '@mui/material'
import StepBackward2 from 'mdi-material-ui/StepBackward2'
import { styled } from '@mui/material/styles'

// antd import
import { Form, Input, Row, Col, Select } from 'antd';

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

const UpdateProductAdmin = () => {
  const { ProductDetailFunc } = useProductFunc()

  // ** State
  const [imgSrc, setImgSrc] = useState('/images/avatars/1.png')
  const [user, setUser] = useState()
  const [date, setDate] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [render, setRender] = useState(false)
  const [openAlert, setOpenAlert] = useState(true)
  const [avatarFile, setAvatarFile] = useState()
  const [avatarURL, setAvatarURL] = useState()
  const { detailUserAdminFunc, updateUserAdminFunc } = useUsersAdminFunc()
  const router = useRouter()
  const productId = router.query.productId
  const { uploadToS3 } = useS3Upload()
  const path = process.env.NEXT_PUBLIC_S3_URL

  const [product, setProduct] = useState({});
  useEffect(async() => {
    const productDetail = await ProductDetailFunc(productId)
    if(productDetail) {
      setProduct(productDetail);
      if (_.isNull(productDetail.images) || _.isEmpty(productDetail.images)) {
        setImgSrc('/images/avatars/1.png');
      } else if(productDetail.images.includes("https://")) {
        setImgSrc(productDetail.images);
      } else {
        setImgSrc(`${path}${productDetail.images}`);
      }
    }
  }, [render]);
  useEffect(() => {
    (async function getFileURL() {
      formik.setValues({
        ...user
      })
      if (user) {
        setDate(moment.unix(user?.doB).toDate())
      }
    })()
  }, [user])
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const formik = useFormik({
    initialValues: {
      fullName: '',
      address: '',
      phoneNo: '',
      modifiedBy: 'admin'
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required('Username is required').nullable(),
      email: Yup.string().email('Validate of email').max(255).required('Email is required'),
      password: Yup.string().required('Password is required'),
      address: Yup.string().required('Address is required').nullable(),
      phoneNo: Yup.string()
        .max(12, 'Phone number not more than 12 number')
        .required('Phone number is required')
        .min(9, 'Phone number not less than 9 number')
    }),
    onSubmit: async (values, helpers) => {
      try {
        console.log('values...', values)
        await handleSubmit(values, helpers.setSubmitting)
        helpers.setStatus({ success: true })
        helpers.setSubmitting(false)
      } catch (err) {
        console.error(err)
        helpers.setStatus({ success: false })
        helpers.setErrors({ submit: err.message })
        helpers.setSubmitting(false)
      }
    }
  })

  const checkDOB = date => {
    const today = new Date()
    if (moment(date).isBefore(today)) {
      return false
    }
    return true
  }

  const handleUpload = async () => {
    try {
      let { key } = await uploadToS3(avatarFile, {
        endpoint: {
          request: {
            body: {
              projectId: userId,
              folder: 'Avatar'
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

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      const valuesFormik = formik.values
      const key = await handleUpload()
      const dataPost = {
        fullName: valuesFormik.fullName,
        address: valuesFormik.address,
        phoneNo: valuesFormik.phoneNo.toString(),
        doB: moment(date).unix(),
        modifiedBy: 'admin',
        avatar: key
      }
      if (_.isNaN(dataPost.doB)) {
        setIsLoading(false)
        toast.error('DOB is required! Please choose your DOB date')
        return
      }
      if (checkDOB(date)) {
        setIsLoading(false)
        toast.error('The DOB cannot be a future date.')
        return
      }

      const updateUser = await updateUserAdminFunc(userId, dataPost)
      console.log('in Update...', updateUser)
      if (updateUser == 201) {
        setIsLoading(false)
        toast.success('Update user successfully!')
        // router.push(`/list-user-admin/${userId}`)
      } else {
        setIsLoading(false)
        throw new Error()
      }
    } catch (err) {
      toast.error('Update Error! Try again later...')
      console.log(err)
    }
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
          <Form layout='vertical'>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item label="Product Name" name="name" rules={[
                    {
                      required: true,
                      message: 'Please input product name!',
                    },
                  ]}
                >
                  <Input size='large' value={product.productName} />
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
                  <Select size='large' />
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
                  <Input size='large' value={product.quantity} />
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
                  <Input size='large' value={product.price} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item label="Quantity" name="quantity">
                  <Input.TextArea size='large' value={product.description} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
      </CardContent>
    </Card>
  </>)
};

UpdateProductAdmin.getLayout = page => (
  <AuthGuard role={'Admin'}>
    <UserLayout>{page}</UserLayout>
  </AuthGuard>
)

export default UpdateProductAdmin;
