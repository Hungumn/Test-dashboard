// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import { Chip } from '@mui/material'

import moment from 'moment/moment'
import { useEffect } from 'react'
import { useS3Upload } from 'next-s3-upload'
import { useUsersAdminFunc } from 'src/@core/hooks/use-user-admin'
import { Loading } from 'src/Components/loading/loading'

import AccountCircle from 'mdi-material-ui/AccountCircle'
import Email from 'mdi-material-ui/Email'
import CalendarRange from 'mdi-material-ui/CalendarRange'
import AccountGroupOutline from 'mdi-material-ui/AccountGroupOutline'
import CardAccountPhone from 'mdi-material-ui/CardAccountPhone'
import MapMarker from 'mdi-material-ui/MapMarker'

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
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

const DetailTypographyStyled = styled(Typography)(({ theme }) => ({
  border: 'solid 1px #ccc',
  borderRadius: '6px',
  padding: '16.5px 14px',
  marginTop: '5px',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))

const TabAccount = props => {
  // ** State
  const { user, imgSrc, setImgSrc } = props
  const [openAlert, setOpenAlert] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [avatarFile, setAvatarFile] = useState()
  const [render, setRender] = useState(false)
  const path = process.env.NEXT_PUBLIC_S3_URL
  const { uploadToS3 } = useS3Upload()
  const { updateUserAdminFunc } = useUsersAdminFunc()

  const onChange = file => {
    const reader = new FileReader()
    const { files } = file.target
    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result)
      reader.readAsDataURL(files[0])
      setAvatarFile(files[0])
    }
  }

  const handleUpload = async () => {
    try {
      if (!avatarFile) {
        setIsLoading(false)
        return
      }
      let { key } = await uploadToS3(avatarFile, {
        endpoint: {
          request: {
            body: {
              projectId: user.id,
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

  const changeAvatarAdmin = async () => {
    try {
      setIsLoading(true)
      const key = await handleUpload()

      if (key) {
        const dataPost = {
          avatar: key
        }
        await updateUserAdminFunc(user.id, dataPost)
        setRender(!render)
        setIsLoading(false)
      }
    } catch (error) {
      console.error(error)
      setIsLoading(false)
    }
  }

  return (
    <CardContent>
      <form>
        <Grid container spacing={7}>
          <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
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
                <ResetButtonStyled color='error' variant='outlined' onClick={() => setImgSrc('/images/avatars/1.png')}>
                  Reset
                </ResetButtonStyled>
                <Typography variant='body2' sx={{ marginTop: 5 }}>
                  Allowed PNG or JPEG. Max size of 10Mb.
                </Typography>
                {isLoading ? (
                  <Loading />
                ) : (
                  <Button
                    type='submit'
                    variant='contained'
                    sx={{ marginTop: 3.5 }}
                    onClick={changeAvatarAdmin}
                    disabled={isLoading}
                  >
                    Save Changes
                  </Button>
                )}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Chip icon={<AccountCircle />} label='Username' variant='outlined' />
            <DetailTypographyStyled>{user?.fullName}</DetailTypographyStyled>
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
            <DetailTypographyStyled>{moment.unix(user?.doB).format('MM/DD/YYYY')}</DetailTypographyStyled>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Chip icon={<CardAccountPhone />} label='Phone Number' variant='outlined' />
            <DetailTypographyStyled>{user?.phoneNo}</DetailTypographyStyled>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Chip icon={<MapMarker />} label='Address' variant='outlined' />
            <DetailTypographyStyled>{user?.address}</DetailTypographyStyled>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  )
}

export default TabAccount
