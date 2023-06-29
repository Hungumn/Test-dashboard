// ** React Imports
import { useState, Fragment } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel from '@mui/material/FormControlLabel'
import { CircularProgress } from '@mui/material'

// ** Icons Imports
import Google from 'mdi-material-ui/Google'
import Github from 'mdi-material-ui/Github'
import Twitter from 'mdi-material-ui/Twitter'
import Facebook from 'mdi-material-ui/Facebook'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import RegisteredTrademark from 'mdi-material-ui/RegisteredTrademark'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import * as Yup from 'yup'
import { toast } from 'react-hot-toast'
import Head from 'next/head'
import _debounce from 'lodash/debounce'
import { LoadingButton } from '@mui/lab'
import { supabase } from 'src/utils/supabaseClient'
import { useAuth } from 'src/@core/hooks/use-auth'
import { withStyles } from '@mui/styles'
import { useEffect } from 'react'
import { useRef } from 'react'
import { useMounted } from 'src/@core/hooks/use-mounted'

// ** Styled Components

const CssTextField = withStyles({
  root: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#000'
      },
      '&:hover fieldset': {
        borderColor: '#000'
      },
      '&.Mui-focused fieldset': {
        border: '1px solid #000'
      },
      color: '#000'
    }
  }
})(TextField)

const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(4),
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const VerifyCode = (props) => {
  // ** States
  const [username, setUsername] = useState('')
  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, 6)

    const storedUsername = sessionStorage.getItem('username')

    if (storedUsername) {
      setUsername(storedUsername)
    } else if (localStorage.getItem('USER_EMAIL')) {
      setUsername(localStorage.getItem('USER_EMAIL'))
    }
  }, [])

  // ** Hook
  const theme = useTheme()
  const router = useRouter()
  const itemsRef = useRef([])
  const isMounted = useMounted()
  const { verifyCode } = useAuth()

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }

  const _ = require('lodash')
  const handleKeyDown = (event, index) => {
    if (event.code === 'Enter') {
      if (formik.values.code[index]) {
        formik.setFieldValue(`code[${index}]`, '')
        return
      }

      if (index > 0) {
        formik.setFieldValue(`code[${index}]`, '')
        itemsRef.current[index - 1].focus()
        return
      }
    }

    if (Number.isInteger(parseInt(event.key, 10))) {
      formik.setFieldValue(`code[${index}]`, event.key)

      if (index < 5) {
        itemsRef.current[index + 1].focus()
      }
    }
  }

  const handlePaste = event => {
    const paste = event.clipboardData.getData('text')
    const pasteArray = paste.split('')

    if (pasteArray.length !== 6) {
      return
    }

    let valid = true

    pasteArray.forEach(x => {
      if (!Number.isInteger(parseInt(x, 10))) {
        valid = false
      }
    })

    if (valid) {
      formik.setFieldValue('code', pasteArray)
      itemsRef.current[5].focus()
    }
  }

  const formik = useFormik({
    initialValues: {
      email: username,
      code: ['', '', '', '', '', ''],
      submit: null
    },
    validationSchema: Yup.object({
      username: Yup.string().required('username is required').nullable(),
      email: Yup.string().email('Validate of email').max(255).required('Email is required'),
      password: Yup.string().required('Password is required')
    }),
    onSubmit: async (values, helpers) => {
      try {
        await verifyCode(values.email ? values.email : username, values.code.join(''))

        if (isMounted()) {
          router.push('/login').catch(console.error)
        }
      } catch (err) {
				console.error(err)
      }
    }
  })

	const toastVerifyCode =(message) =>{
		return toast.error(message)
	}

  const customSubmit = async () => {
    try {
      const data = await verifyCode(formik.values.email ? formik.values.email : username, formik.values.code.join(''))
			console.log('in verifyCode', data);
			if (data.error !== null){
				toast.error(data.error.message)
			}
      // if (isMounted()) {
      // 	router.push('/login').catch(console.error);
      // }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Box className='content-center'>
      <Head>
        <title>Register | Cloud Box Lesson</title>
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
              Verify Code here 🚀
            </Typography>
          </Box>
          <form noValidate onSubmit={formik.handleSubmit} {...props}>
            {!username ? (
              <TextField
                autoFocus
                error={Boolean(formik.touched.email && formik.errors.email)}
                fullWidth
                helperText={formik.touched.email && formik.errors.email}
                label='メールアドレス'
                margin='normal'
                name='email'
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type='email'
                value={formik.values.email}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#000'
                  }
                }}
              />
            ) : (
              <CssTextField disabled fullWidth margin='normal' value={username} />
            )}
            <Typography
              sx={{
                mb: 2,
                mt: 3
              }}
              variant='subtitle2'
            >
              Authentication Code
            </Typography>
            <Box
              sx={{
                columnGap: '16px',
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                pt: 1
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((ref, index) => (
                <CssTextField
                  error={Boolean(
                    Array.isArray(formik.touched.code) && formik.touched.code.length === 6 && formik.errors.code
                  )}
                  fullWidth
                  inputRef={el => (itemsRef.current[index] = el)}
                  // eslint-disable-next-line react/no-array-index-key
                  key={`code-${index}`}
                  name={`code[${index}]`}
                  onBlur={formik.handleBlur}
                  onKeyDown={event => handleKeyDown(event, index)}
                  onPaste={handlePaste}
                  value={formik.values.code[index]}
                  sx={{
                    display: 'inline-block',
                    textAlign: 'center',
                    '& .MuiInputBase-input': {
                      textAlign: 'center',
                      '@media (max-width: 400px)': {
                        p: 1
                      },
                      '@media (max-width: 350px)': {
                        p: 0
                      }
                    }
                  }}
                  onChange={() => {
                    formik.values.code[5] !== '' ? customSubmit() : null
                    // console.log('test', index, formik.values.code[5])
                  }}
                />
              ))}
            </Box>
            {Boolean(Array.isArray(formik.touched.code) && formik.touched.code.length === 6 && formik.errors.code) && (
              <FormHelperText error sx={{ mx: '14px' }}>
                {Array.isArray(formik.errors.code) && formik.errors.code.find(x => x !== undefined)}
              </FormHelperText>
            )}
            {formik.errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{formik.errors.submit}</FormHelperText>
              </Box>
            )}
            <Box sx={{ mt: 3 }}>
              <Button
                disabled={formik.isSubmitting}
                fullWidth
                size='large'
                type='submit'
                variant='contained'
                sx={{
                  color: '#fff',
                  backgroundColor: '#000',
                  borderRadius: 0,
                  ':hover': {
                    backgroundColor: '#000'
                  }
                }}
              >
                Confirmation
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}
VerifyCode.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default VerifyCode
