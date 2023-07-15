import React, { useState,useEffect } from 'react'
import { AuthGuard } from 'src/@core/hooks/auth-guard'
import { useCategoryFunc } from 'src/@core/hooks/use-category'
import UserLayout from 'src/layouts/UserLayout'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'

function ProductAdmin() {
  const { ListCategoryFunc } =useCategoryFunc()
  const [listCategory, setListCategory] = useState([])
  const [render, setRender] = useState(false)
  useEffect( async () => {
    const dataUser = await ListCategoryFunc()
    setListCategory(dataUser)
  }, []);

  const createData = (name, calories, fat, carbs, protein) => {
    return { name, calories, fat, carbs, protein }
  }
  console.log('data: ', listCategory)

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell align='right'>Calories</TableCell>
            <TableCell align='right'>Fat (g)</TableCell>
            <TableCell align='right'>Carbs (g)</TableCell>
            <TableCell align='right'>Protein (g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listCategory.map(row => (
            <TableRow
              key={row.categoryId}
              sx={{
                '&:last-of-type td, &:last-of-type th': {
                  border: 0
                }
              }}
            >
              <TableCell component='th' scope='row'>
                {row.categoryName}
              </TableCell>
              <TableCell align='right'>{row.createdBy}</TableCell>
              <TableCell align='right'>{row.createdDate}</TableCell>
              <TableCell align='right'>{row.modifiedBy}</TableCell>
              <TableCell align='right'>{row.modifiedDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

ProductAdmin.getLayout = (page) => (
  <AuthGuard role={'Admin'}>
    <UserLayout>{page}</UserLayout>
  </AuthGuard>
)
export default ProductAdmin