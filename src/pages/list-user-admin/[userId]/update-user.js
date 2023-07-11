// ** React Imports
import { useEffect, useState, forwardRef } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTab from '@mui/material/Tab'

// ** Icons Imports
import AccountCircle from 'mdi-material-ui/AccountCircle'
import Email from 'mdi-material-ui/Email'
import CalendarRange from 'mdi-material-ui/CalendarRange'
import AccountGroupOutline from 'mdi-material-ui/AccountGroupOutline'
import CardAccountPhone from 'mdi-material-ui/CardAccountPhone'
import MapMarker from 'mdi-material-ui/MapMarker'
import StepBackward2 from 'mdi-material-ui/StepBackward2'
import ImagePlus from 'mdi-material-ui/ImagePlus'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import UserLayout from 'src/layouts/UserLayout'
import { AuthGuard } from 'src/@core/hooks/auth-guard'
import { useAuth } from 'src/@core/hooks/use-auth'
import { useUsersAdminFunc } from 'src/@core/hooks/use-user-admin'
import { useRouter } from 'next/router'
import { Button, CardContent, Chip, Grid, TextField, Typography, Fab, Avatar } from '@mui/material'
import moment from 'moment/moment'
import { toast } from 'react-hot-toast'
import { useFormik } from 'formik'
import _ from 'lodash'
import * as Yup from 'yup'
import DatePicker from 'react-datepicker'
import { Loading } from 'src/Components/loading/loading'
import { grey } from '@mui/material/colors'
import { FileUpload } from 'src/Components/widgets/file-upload'
import { useS3Upload } from 'next-s3-upload'
import axios from 'axios'
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

const DetailTypographyStyled = styled(Typography)(({ theme }) => ({
  border: 'solid 1px #ccc',
  borderRadius: '6px',
  padding: '16.5px 14px',
  marginTop: '14px',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
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

const CustomInput = forwardRef((props, ref) => {
  return <TextField fullWidth {...props} inputRef={ref} autoComplete='off' sx={{ marginTop: '16px' }} />
})

const UpdateUserDetailAdmin = () => {
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
  const userId = router.query.userId
  const { uploadToS3 } = useS3Upload()
  const path = process.env.NEXT_PUBLIC_S3_URL

  useEffect(async () => {
    const userDetail = await detailUserAdminFunc(userId)
    if (userDetail) {
      setUser(userDetail)
      setImgSrc(`${path}${userDetail?.avatar}`)
    }
    console.log('user detail...', userDetail)
  }, [render])
  useEffect(() => {
    ;(async function getFileURL() {
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

  const removeOldAvatar = async key => {
    const client = new S3Client({})
    const command = new DeleteObjectCommand({
      Bucket: process.env.S3_UPLOAD_BUCKET,
      Key: key
    })
    try {
      const response = await client.send(command)
      console.log('response...', response)
      return response
    } catch (err) {
      console.error(err)
    }
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
      if (avatarFile) {
        const res = await removeOldAvatar(user?.avatar)
        console.log('res...', res)
      }
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

  return (
    <Card>
      <CardContent>
        <form noValidate autoComplete='off' onSubmit={formik.handleSubmit}>
          <Grid container spacing={7}>
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
            <Grid item xs={12} sm={6}>
              <Chip icon={<AccountCircle />} label='Username' variant='outlined' />
              <TextField
                error={Boolean(formik.touched.fullName && formik.errors.fullName)}
                fullWidth
                helperText={formik.touched.fullName && formik.errors.fullName}
                margin='normal'
                name='fullName'
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type='text'
                value={formik.values.fullName}
                sx={{ marginBottom: 4 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Chip icon={<AccountGroupOutline />} label='Role' variant='outlined' />
              <DetailTypographyStyled>{user?.roleName}</DetailTypographyStyled>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Chip icon={<Email />} label='Email' variant='outlined' />
              <DetailTypographyStyled>{user?.email}</DetailTypographyStyled>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Chip icon={<CalendarRange />} label='Bird Date' variant='outlined' />
              <DatePicker
                selected={date}
                showYearDropdown
                showMonthDropdown
                placeholderText='MM-DD-YYYY'
                customInput={<CustomInput />}
                id='form-layouts-separator-date'
                onChange={date => setDate(date)}
                style={{ width: '100% !important' }}
                dropdownMode='select'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Chip icon={<CardAccountPhone />} label='Phone Number' variant='outlined' />
              <TextField
                error={Boolean(formik.touched.address && formik.errors.address)}
                fullWidth
                helperText={formik.touched.address && formik.errors.address}
                margin='normal'
                name='address'
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type='text'
                value={formik.values.address}
                sx={{ marginBottom: 4 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Chip icon={<MapMarker />} label='Address' variant='outlined' />
              <TextField
                error={Boolean(formik.touched.phoneNo && formik.errors.phoneNo)}
                fullWidth
                helperText={formik.touched.phoneNo && formik.errors.phoneNo}
                margin='normal'
                name='phoneNo'
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type='number'
                value={formik.values.phoneNo}
                sx={{ marginBottom: 9 }}
              />
            </Grid>
            <Grid item xs={12}>
              {isLoading ? (
                <Loading />
              ) : (
                <Button
                  type='submit'
                  variant='contained'
                  sx={{ marginRight: 3.5, float: 'right' }}
                  onClick={handleSubmit}
                  disabled={formik.isSubmitting}
                >
                  Save Changes
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

UpdateUserDetailAdmin.getLayout = page => (
  <AuthGuard>
    <UserLayout>{page}</UserLayout>
  </AuthGuard>
)
export default UpdateUserDetailAdmin
