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
import { Button, Modal, Form, Tabs, Card as Acard } from "antd";

const OrderAdmin = () => {
    const { ListOrderFunc } = useOrderFunc()
    const [listData, setListData] = useState([])
    const [activeKey, setActiveKey] = useState(1)
    const [loading, setLoading] = useState(false);
    useEffect( () => {
        getListData();
    }, [activeKey]);

    const getListData = async() => {
        setLoading(true);
        const data = await ListOrderFunc({ limit: -1, status: activeKey })
        setListData(data.data);
        setLoading(false);
    };

    const items = [{
        key: 1,
        label: `New order`,
        children: <OrderTable loading={loading} dataSource={listData} getListData={getListData} />,
    },{
        key: 4,
        label: `Going Delivery`,
        children: <OrderTable loading={loading} dataSource={listData} getListData={getListData} />,
    },{
        key: 5,
        label: `Delivered`,
        children: <OrderTable loading={loading} dataSource={listData} getListData={getListData} />,
    }];
    const onChange = (key) => {
        setActiveKey(key)
        // getListData();
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
                <Acard>
                    <Tabs activeKey={activeKey} items={items} onChange={onChange} animated={true} />
                </Acard>
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
