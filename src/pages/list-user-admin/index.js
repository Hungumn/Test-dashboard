import React from 'react'
import { AuthGuard } from 'src/@core/hooks/auth-guard'
import UserLayout from 'src/layouts/UserLayout'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import TableBasic from 'src/views/tables/TableBasic'
import TableDense from 'src/views/tables/TableDense'
import TableStickyHeader from 'src/views/tables/TableStickyHeader'
import TableCollapsible from 'src/views/tables/TableCollapsible'
import TableSpanning from 'src/views/tables/TableSpanning'
import TableCustomized from 'src/views/tables/TableCustomized'
import ListUserAdminTable from 'src/Components/listUsersAdmin'
import { useEffect } from 'react'
import { useUsersAdminFunc } from 'src/@core/hooks/use-user-admin'
import { useState } from 'react'

function ListUserAdmin() {
  const { ListUserAdminFunc } = useUsersAdminFunc()
  const [clients, setClients] = useState([])
  useEffect(async () => {
    const dataUser = await ListUserAdminFunc()
    setClients(dataUser)
    console.log('data user...', dataUser)
  }, [])
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>
          <Link href='https://mui.com/components/tables/' target='_blank'>
            List of Users
          </Link>
        </Typography>
        <Typography variant='body2'>Tables display sets of data. They can be fully customized</Typography>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader />
          <ListUserAdminTable clients={clients} />
        </Card>
      </Grid>
    </Grid>
  )
}

ListUserAdmin.getLayout = page => (
  <AuthGuard>
    <UserLayout>{page}</UserLayout>
  </AuthGuard>
)
export default ListUserAdmin
