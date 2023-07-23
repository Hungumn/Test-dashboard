import React, { useState, useEffect } from 'react'
import { AuthGuard } from 'src/@core/hooks/auth-guard'
import UserLayout from 'src/layouts/UserLayout'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CategoryTable from 'src/Components/category-admin/categoryTable'
import { useCategoryFunc } from 'src/@core/hooks/use-category'
import { Button, Modal, Form } from "antd";
import { useRouter } from 'next/router'
import CategoryModal from "src/Components/category-admin/categoryModal";

const CategoriesAdmin = () => {
    const { ListCategoryFunc } = useCategoryFunc()
    const [listCategory, setListCategory] = useState([])
    const [openModal, setOpenModal] = useState(false)
    useEffect( () => {
        getListCategory();
    }, []);

    const getListCategory = async() => {
        const data = await ListCategoryFunc()
        setListCategory(data.data)
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
                    List of Category
                    </Link>
                </Typography> 
                <Typography variant='body2'>Tables display sets of data. They can be fully customized</Typography>
                </div>
                <div>
                <Button type='primary' size="large" onClick={handleAdd}>Add new category</Button>
                </div>
            </Grid>
            <Grid item xs={12}>
                <Card>
                    <CardHeader />
                    <CategoryTable dataSource={listCategory} getListCategory={getListCategory} />
                </Card>
            </Grid>
        </Grid>
        <CategoryModal visible={openModal} type="Create" setVisible={setOpenModal} getListCategory={getListCategory} />
    </>)
};

CategoriesAdmin.getLayout = page => (
    <AuthGuard role={'Admin'}>
        <UserLayout>{page}</UserLayout>
    </AuthGuard>
)

export default CategoriesAdmin;