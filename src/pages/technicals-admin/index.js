import React, { useState, useEffect } from 'react'
import { AuthGuard } from 'src/@core/hooks/auth-guard'
import UserLayout from 'src/layouts/UserLayout'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import TechnicalTable from 'src/Components/technical-admin/technicalTable'
import { useTechnicalFunc } from 'src/@core/hooks/use-technical'
import { Button, Modal, Form } from "antd";
import TechnicalModal from "src/Components/technical-admin/technicalModal";
 
const TechnicalAdmin = () => {
    const { ListTechincalFunc } = useTechnicalFunc()
    const [listData, setListData] = useState([])
    const [openModal, setOpenModal] = useState(false)
    useEffect( () => {
        getListData();
    }, []);

    const getListData = async() => {
        const data = await ListTechincalFunc()
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
                    List of Technical
                    </Link>
                </Typography> 
                <Typography variant='body2'>Tables display sets of data. They can be fully customized</Typography>
                </div>
                <div>
                <Button type='primary' size="large" onClick={handleAdd}>Add new technical</Button>
                </div>
            </Grid>
            <Grid item xs={12}>
                <Card>
                    <CardHeader />
                    <TechnicalTable dataSource={listData} getListData={getListData} />
                </Card>
            </Grid>
        </Grid>
        <TechnicalModal visible={openModal} type="Create" setVisible={setOpenModal} getListData={getListData} />
    </>)
};

TechnicalAdmin.getLayout = page => (
    <AuthGuard role={'Admin'}>
        <UserLayout>{page}</UserLayout>
    </AuthGuard>
)

export default TechnicalAdmin;