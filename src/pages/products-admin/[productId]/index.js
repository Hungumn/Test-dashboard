import { useEffect, useState } from 'react'

import Card from '@mui/material/Card';
import { Button, CardContent, Chip, Grid, TextField, Typography } from '@mui/material';
import UserLayout from 'src/layouts/UserLayout';
import Email from 'mdi-material-ui/Email'
import CalendarRange from 'mdi-material-ui/CalendarRange'
import { AuthGuard } from 'src/@core/hooks/auth-guard'
import CardAccountPhone from 'mdi-material-ui/CardAccountPhone'
import MapMarker from 'mdi-material-ui/MapMarker'
import StepForward2 from 'mdi-material-ui/StepForward2';
import StepBackward2 from 'mdi-material-ui/StepBackward2';
import AccountCircle from 'mdi-material-ui/AccountCircle'
import AccountGroupOutline from 'mdi-material-ui/AccountGroupOutline'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import { useProductFunc } from 'src/@core/hooks/use-product'
import { useRouter } from 'next/router';
import _ from 'lodash'

const ImgStyled = styled('img')(({ theme }) => ({
  width: 200,
  height: 'auto',
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

const ProductDetailAdmin = () => {
  const { ProductDetailFunc } = useProductFunc()
  const path = process.env.NEXT_PUBLIC_S3_URL
  const router = useRouter();
  const productId = router.query.productId
  const [imgSrc, setImgSrc] = useState('/images/avatars/1.png');
  const [product, setProduct] = useState({});

  useEffect(async() => {
    const productDetail = await ProductDetailFunc(productId)
    if(productDetail) {
      setProduct(productDetail);
      if (_.isNull(productDetail.images) || _.isEmpty(productDetail.images)) {
        setImgSrc('/images/avatars/1.png')
      } else {
        setImgSrc(`${path}${productDetail.images}`)
      }
    }
  }, []);

  return (<>
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
              <Chip icon={<AccountCircle />} label='Product' variant='outlined' />
              <DetailTypographyStyled>{product?.productName}</DetailTypographyStyled>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Chip icon={<AccountGroupOutline />} label='Category' variant='outlined' />
              <DetailTypographyStyled>{product?.productName}</DetailTypographyStyled>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Chip icon={<Email />} label='Email' variant='outlined' />
              <DetailTypographyStyled>{product?.productName}</DetailTypographyStyled>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Chip icon={<CalendarRange />} label='Bird Date' variant='outlined' />
              <DetailTypographyStyled>{product?.productName}</DetailTypographyStyled>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Chip icon={<CardAccountPhone />} label='Phone Number' variant='outlined' />
              <DetailTypographyStyled>{product?.productName}</DetailTypographyStyled>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Chip icon={<MapMarker />} label='Address' variant='outlined' />
              <DetailTypographyStyled>{product?.productName}</DetailTypographyStyled>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  </>)
};
ProductDetailAdmin.getLayout = page => (
  <AuthGuard role={'Admin'}>
    <UserLayout>{page}</UserLayout>
  </AuthGuard>
)

export default ProductDetailAdmin;
