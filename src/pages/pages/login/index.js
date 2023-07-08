// ** React Imports
import { useState } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'

// ** Icons Imports
import Google from 'mdi-material-ui/Google'
import Github from 'mdi-material-ui/Github'
import Twitter from 'mdi-material-ui/Twitter'
import Facebook from 'mdi-material-ui/Facebook'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'
import Head from 'next/head'
import { withStyles } from '@mui/styles'
import { Formik } from 'formik'
import { toast } from 'react-hot-toast'
import * as Yup from 'yup'
import { LoadingButton } from '@mui/lab'
import RegisteredTrademark from 'mdi-material-ui/RegisteredTrademark'
import LinearProgress from '@mui/material/LinearProgress'
import { supabase } from 'src/utils/supabaseClient'
import { useAuth } from 'src/@core/hooks/use-auth'
import { Loading } from 'src/Components/loading/loading'
import axios from 'axios'
import _ from 'lodash'

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const CssTextField = withStyles({
  root: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#acacac',
        borderRadius: 0
      },
      '&:hover fieldset': {
        borderColor: '#acacac'
      },
      '&.Mui-focused fieldset': {
        border: '1px solid #acacac'
      }
    }
  }
})(TextField)

const LoginPage = props => {
  // ** State

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // ** Hook
  const theme = useTheme()
  const router = useRouter()
  const { login } = useAuth()

  const handleClickShowPassword = () => {
    setShowPassword(show => !show)
  }

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }

  return (
    <Box className='content-center' display={'flex'}>
      <Head>
        <title>Login | Cloud Box Lesson</title>
      </Head>

      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg
              width={35}
              height={29}
              version='1.1'
              viewBox='0 0 30 23'
              xmlns='http://www.w3.org/2000/svg'
              xmlnsXlink='http://www.w3.org/1999/xlink'
            >
              <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
                <g id='Artboard' transform='translate(-95.000000, -51.000000)'>
                  <g id='logo' transform='translate(95.000000, 50.000000)'>
                    <path
                      id='Combined-Shape'
                      fill={theme.palette.primary.main}
                      d='M30,21.3918362 C30,21.7535219 29.9019196,22.1084381 29.7162004,22.4188007 C29.1490236,23.366632 27.9208668,23.6752135 26.9730355,23.1080366 L26.9730355,23.1080366 L23.714971,21.1584295 C23.1114106,20.7972624 22.7419355,20.1455972 22.7419355,19.4422291 L22.7419355,19.4422291 L22.741,12.7425689 L15,17.1774194 L7.258,12.7425689 L7.25806452,19.4422291 C7.25806452,20.1455972 6.88858935,20.7972624 6.28502902,21.1584295 L3.0269645,23.1080366 C2.07913318,23.6752135 0.850976404,23.366632 0.283799571,22.4188007 C0.0980803893,22.1084381 2.0190442e-15,21.7535219 0,21.3918362 L0,3.58469444 L0.00548573643,3.43543209 L0.00548573643,3.43543209 L0,3.5715689 C3.0881846e-16,2.4669994 0.8954305,1.5715689 2,1.5715689 C2.36889529,1.5715689 2.73060353,1.67359571 3.04512412,1.86636639 L15,9.19354839 L26.9548759,1.86636639 C27.2693965,1.67359571 27.6311047,1.5715689 28,1.5715689 C29.1045695,1.5715689 30,2.4669994 30,3.5715689 L30,3.5715689 Z'
                    />
                    <polygon
                      id='Rectangle'
                      opacity='0.077704'
                      fill={theme.palette.common.black}
                      points='0 8.58870968 7.25806452 12.7505183 7.25806452 16.8305646'
                    />
                    <polygon
                      id='Rectangle'
                      opacity='0.077704'
                      fill={theme.palette.common.black}
                      points='0 8.58870968 7.25806452 12.6445567 7.25806452 15.1370162'
                    />
                    <polygon
                      id='Rectangle'
                      opacity='0.077704'
                      fill={theme.palette.common.black}
                      points='22.7419355 8.58870968 30 12.7417372 30 16.9537453'
                      transform='translate(26.370968, 12.771227) scale(-1, 1) translate(-26.370968, -12.771227) '
                    />
                    <polygon
                      id='Rectangle'
                      opacity='0.077704'
                      fill={theme.palette.common.black}
                      points='22.7419355 8.58870968 30 12.6409734 30 15.2601969'
                      transform='translate(26.370968, 11.924453) scale(-1, 1) translate(-26.370968, -11.924453) '
                    />
                    <path
                      id='Rectangle'
                      fillOpacity='0.15'
                      fill={theme.palette.common.white}
                      d='M3.04512412,1.86636639 L15,9.19354839 L15,9.19354839 L15,17.1774194 L0,8.58649679 L0,3.5715689 C3.0881846e-16,2.4669994 0.8954305,1.5715689 2,1.5715689 C2.36889529,1.5715689 2.73060353,1.67359571 3.04512412,1.86636639 Z'
                    />
                    <path
                      id='Rectangle'
                      fillOpacity='0.35'
                      fill={theme.palette.common.white}
                      transform='translate(22.500000, 8.588710) scale(-1, 1) translate(-22.500000, -8.588710) '
                      d='M18.0451241,1.86636639 L30,9.19354839 L30,9.19354839 L30,17.1774194 L15,8.58649679 L15,3.5715689 C15,2.4669994 15.8954305,1.5715689 17,1.5715689 C17.3688953,1.5715689 17.7306035,1.67359571 18.0451241,1.86636639 Z'
                    />
                  </g>
                </g>
              </g>
            </svg>
            <Typography
              variant='h6'
              sx={{
                ml: 3,
                lineHeight: 1,
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '1.5rem !important'
              }}
            >
              {themeConfig.templateName}
            </Typography>
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
              Welcome to {themeConfig.templateName}! 👋🏻
            </Typography>
            <Typography variant='body2'>Please sign-in to your account and start the adventure</Typography>
          </Box>
          <Formik
            enableReinitialize={true}
            initialValues={{
              email: '',
              password: '',
              submit: null
            }}
            validationSchema={Yup.object({
              email: Yup.string().email('Valid Email').max(255).required('Email is required'),
              password: Yup.string().required('Password is required').min(3, 'password more than 8')
            })}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
              try {
                // const userLogin = await axios.post('http://YashGemJewelleriesNTier-dev.eba-s5hdxxxp.ap-southeast-2.elasticbeanstalk.com/api/Accounts/login',{
                //   username:values.email,
                //   password:values.password
                // })
                // console.log('login', userLogin);
                setIsLoading(true)
                const userLogin = await login(values.email, values.password)
                console.log('user in login', userLogin)
                if (userLogin?.status == 200 && _.isNull(userLogin?.deletedDate)) {
                  setIsLoading(false)
                  toast.success('Login Success...')
                  router.push('/')
                } else {
                  setIsLoading(false)
                  throw new Error()
                }
              } catch (err) {
                console.log(err)
                toast.error('Login failed. Please try again Email or Password')
              }
            }}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
              <form noValidate onSubmit={handleSubmit} {...props}>
                <Typography component='label'>Email</Typography>
                <CssTextField
                  inputProps={{ style: { color: '#000', borderRadius: 0 } }}
                  autoFocus
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  margin='normal'
                  name='email'
                  disabled={isLoading}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type='email'
                  value={values.email}
                />
                <Typography component='label'>Password</Typography>
                <CssTextField
                  inputProps={{ style: { color: '#000', borderRadius: 0 } }}
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  margin='normal'
                  name='password'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  disabled={isLoading}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          aria-label='toggle password visibility'
                        >
                          {showPassword ? <EyeOutline /> : <EyeOffOutline />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                {errors.submit && (
                  <Box sx={{ mt: 5 }}>
                    <FormHelperText variant='outlined' error>
                      {errors.submit}
                    </FormHelperText>
                  </Box>
                )}
                <Box sx={{ mt: 5 }} textAlign='center'>
                  {isLoading ? (
                    <>
                      <Box sx={{ width: '100%', mb: 5 }}>
                        {/* <LinearProgress color='error' sx={{ height: '6px' }} /> */}
                        <Loading />
                      </Box>
                    </>
                  ) : (
                    <Button
                      fullWidth
                      size='large'
                      type='submit'
                      variant='contained'
                      sx={{
                        marginBottom: 7,
                        color: '#fff',
                        borderRadius: '5px',
                        boxShadow: '0px 6px 18px -8px rgba(58, 53, 65, 0.56)',
                        bgcolor: '#804BDF',
                        '&:hover': {
                          bgcolor: '#804BDF'
                        }
                      }}
                      disabled={isLoading}
                    >
                      Login
                    </Button>
                  )}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', mt: 5 }}>
                  <Typography variant='body2' sx={{ marginRight: 2 }}>
                    Already have an account?
                  </Typography>
                  <Typography variant='body2'>
                    <Link passHref href='/pages/register'>
                      <LinkStyled>Sign up instead</LinkStyled>
                    </Link>
                  </Typography>
                </Box>
                <Divider sx={{ my: 5 }}>or</Divider>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Link href='/' passHref>
                    <IconButton component='a' onClick={e => e.preventDefault()}>
                      <Facebook sx={{ color: '#497ce2' }} />
                    </IconButton>
                  </Link>
                  <Link href='/' passHref>
                    <IconButton component='a' onClick={e => e.preventDefault()}>
                      <Twitter sx={{ color: '#1da1f2' }} />
                    </IconButton>
                  </Link>
                  <Link href='/' passHref>
                    <IconButton component='a' onClick={e => e.preventDefault()}>
                      <Github
                        sx={{ color: theme => (theme.palette.mode === 'light' ? '#272727' : theme.palette.grey[300]) }}
                      />
                    </IconButton>
                  </Link>
                  <Link href='/' passHref>
                    <IconButton component='a' onClick={e => e.preventDefault()}>
                      <Google sx={{ color: '#db4437' }} />
                    </IconButton>
                  </Link>
                </Box>
              </form>
            )}
          </Formik>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}
LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default LoginPage
