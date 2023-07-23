import React, { useState, useEffect } from 'react'
import { AuthGuard } from 'src/@core/hooks/auth-guard'
import UserLayout from 'src/layouts/UserLayout'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import OrderTable from 'src/Components/order-admin/orderTable'
import { useOrderFunc } from 'src/@core/hooks/use-cart'
import { Button, Modal, Form } from "antd";
 
const OrderAdmin = () => {
    const { ListOrderFunc } = useOrderFunc()
    const [listData, setListData] = useState([])
    const [openModal, setOpenModal] = useState(false)
    useEffect( () => {
        getListData();
    }, []);

    const getListData = async() => {
        const data = await ListOrderFunc({ limit: -1 })
        setListData(data.data)
    };

    const handleAdd = () => {
        setOpenModal(true);
    };
    return (<>
        <Grid container spacing={6}>
            <Grid item xs={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <Typography variant='h5'>
                    <Link href='https://mui.com/components/tables/' target='_blank'>
                    List of Order
                    </Link>
                </Typography> 
                <Typography variant='body2'>Tables display sets of data. They can be fully customized</Typography>
            </Grid>
            <Grid item xs={12}>
                <Card>
                    <CardHeader />
                    <OrderTable dataSource={listData} getListData={getListData} />
                </Card>
            </Grid>
        </Grid>
    </>)
};

OrderAdmin.getLayout = page => (
    <AuthGuard role={'Admin'}>
        <UserLayout>{page}</UserLayout>
    </AuthGuard>
)

export default OrderAdmin;