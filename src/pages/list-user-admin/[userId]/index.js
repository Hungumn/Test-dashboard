// ** React Imports
import { useEffect, useState } from 'react'

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
import StepForward2 from 'mdi-material-ui/StepForward2'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import UserLayout from 'src/layouts/UserLayout'
import { AuthGuard } from 'src/@core/hooks/auth-guard'
import { useAuth } from 'src/@core/hooks/use-auth'
import { useUsersAdminFunc } from 'src/@core/hooks/use-user-admin'
import { useRouter } from 'next/router'
import { Button, CardContent, Chip, Grid, TextField, Typography } from '@mui/material'
import moment from 'moment/moment'
import _ from 'lodash'

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
  marginTop: '5px',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))

const UserDetailAdmin = () => {
  // ** State
  const [imgSrc, setImgSrc] = useState('/images/avatars/1.png')
  const [user, setUser] = useState()
  const [render, setRender] = useState(false)
  const [avatarURL, setAvatarURL] = useState()
  const { detailUserAdminFunc } = useUsersAdminFunc()
  const router = useRouter()
  const userId = router.query.userId
  const path = process.env.NEXT_PUBLIC_S3_URL

  useEffect(async () => {
    const userDetail = await detailUserAdminFunc(userId)
    if (userDetail) {
      setUser(userDetail)
      if (_.isNull(userDetail.avatar) || _.isEmpty(userDetail.avatar)) {
        setImgSrc('/images/avatars/1.png')
      } else {
        setImgSrc(`${path}${userDetail?.avatar}`)
      }
    }
    console.log('user detail...', avatarURL)
  }, [render])

  return (
    <Card>
      <CardContent>
        <form>
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
              <Button
                variant='contained'
                sx={{ marginRight: 3.5, float: 'right' }}
                onClick={() => router.push(`${userId}/update-user`)}
                startIcon={<StepForward2 />}
              >
                Update
              </Button>
            </Grid>
            <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ImgStyled src={imgSrc} alt='Profile Pic' />
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
    </Card>
  )
}

UserDetailAdmin.getLayout = page => (
  <AuthGuard role={'Admin'}>
    <UserLayout>{page}</UserLayout>
  </AuthGuard>
)
export default UserDetailAdmin
