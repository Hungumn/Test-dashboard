import React, { useState, useEffect } from 'react'
import { AuthGuard } from 'src/@core/hooks/auth-guard'
import UserLayout from 'src/layouts/UserLayout'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import MaterialTable from 'src/Components/material-admin/materialTable'
import { useMaterialFunc } from 'src/@core/hooks/use-material'
import { Button, Modal, Form } from "antd";
import MaterialModal from "src/Components/material-admin/materialModal";

const CategoriesAdmin = () => {
    const { ListMaterialFunc } = useMaterialFunc()
    const [listData, setListData] = useState([])
    const [openModal, setOpenModal] = useState(false)
    useEffect( () => {
        getListData();
    }, []);

    const getListData = async() => {
        const data = await ListMaterialFunc()
        setListData(data)
    };

    const handleAdd = () => {
        setOpenModal(true);
    };
    return (<>
        <Grid container spacing={6}>
            <Grid item xs={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <div>
                <Typography variant='h5'>
                    <Link href='https://mui.com/components/tables/' target='_blank'>
                    List of Material
                    </Link>
                </Typography> 
                <Typography variant='body2'>Tables display sets of data. They can be fully customized</Typography>
                </div>
                <div>
                <Button type='primary' size="large" onClick={handleAdd}>Add new material</Button>
                </div>
            </Grid>
            <Grid item xs={12}>
                <Card>
                    <CardHeader />
                    <MaterialTable dataSource={listData} getListData={getListData} />
                </Card>
            </Grid>
        </Grid>
        <MaterialModal visible={openModal} type="Create" setVisible={setOpenModal} getListData={getListData} />
    </>)
};

CategoriesAdmin.getLayout = page => (
    <AuthGuard role={'Admin'}>
        <UserLayout>{page}</UserLayout>
    </AuthGuard>
)

export default CategoriesAdmin;