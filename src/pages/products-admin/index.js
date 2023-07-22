import React, { useState, useEffect } from 'react'
import { AuthGuard } from 'src/@core/hooks/auth-guard'
import UserLayout from 'src/layouts/UserLayout'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import ListProductAdminTable from 'src/Components/product-admin/ListProductAdmin'
import { useProductFunc } from 'src/@core/hooks/use-product'
import { Button } from "antd";
import { useRouter } from 'next/router'

function ProductAdmin() {
  const router = useRouter();
  const { ListProductFunc } = useProductFunc()
  const [listCategory, setListCategory] = useState([])
  const [render, setRender] = useState(false)
  useEffect( () => {
    getListProduct();
  }, []);

  const getListProduct = async() => {
    const dataUser = await ListProductFunc({ limit: -1 })
    setListCategory(dataUser.data)
  };

  const handleAdd = () => {
    router.push("/products-admin/create");
  };

  console.log('data: ', listCategory)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div>
          <Typography variant='h5'>
            <Link href='https://mui.com/components/tables/' target='_blank'>
              List of Product
            </Link>
          </Typography>
          <Typography variant='body2'>Tables display sets of data. They can be fully customized</Typography>
        </div>
        <div>
          <Button type='primary' size="large" onClick={handleAdd}>Add new product</Button>
        </div>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader />
          <ListProductAdminTable product={listCategory} getListProduct={getListProduct} setRender={setRender} render={render} />
        </Card>
      </Grid>
    </Grid>
  )
}

ProductAdmin.getLayout = page => (
  <AuthGuard role={'Admin'}>
    <UserLayout>{page}</UserLayout>
  </AuthGuard>
)
export default ProductAdmin
