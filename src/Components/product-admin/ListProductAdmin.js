// ** React Imports
import { useState, useRef, useEffect } from 'react'

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import { Box, Button, InputAdornment, Modal, TextField, Typography, Avatar } from '@mui/material'
import Magnify from 'mdi-material-ui/Magnify'
import moment from 'moment'
import { useUsersAdminFunc } from 'src/@core/hooks/use-user-admin'
import { toast } from 'react-hot-toast'
import NextLink from 'next/link'
import CloseCircleOutline from 'mdi-material-ui/CloseCircleOutline'
import ArrowRightCircle from 'mdi-material-ui/ArrowRightCircle'

import { useRouter } from 'next/router'
import { getInitials } from 'src/@core/utils/get-initials'
import { useCategoryFunc } from 'src/@core/hooks/use-category'
import { useProductFunc } from 'src/@core/hooks/use-product'
import _ from 'lodash'

const columns = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'CategoryName', label: 'Category', minWidth: 100 },
  {
    id: 'CreateDate',
    label: 'Create Date',
    minWidth: 170,
    align: 'right'
  },
  {
    id: 'Quantity',
    label: 'Quantity',
    minWidth: 170,
    align: 'right'
  },
  {
    id: 'price',
    label: 'Price',
    minWidth: 170,
    align: 'right'
  },
  {
    id: 'Images',
    label: 'Images',
    minWidth: 170,
    align: 'right'
  },
  {
    id: 'Description',
    label: 'Description',
    minWidth: 170,
    align: 'right'
  },
  { id: 'action', label: 'Action', minWidth: 100 }
]

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  p: 4,
  borderRadius: '8px'
}

let filterOptions = [
  {
    label: 'All',
    value: 'all'
  }
]

const applyFilters = (items, filters) => {
  console.log('items', items)
  return items?.filter(s => {
    const item = s
    if (filters.query) {
      let queryMatched = false
      const properties = ['productName']

      properties.forEach(property => {
        if (item[property].toLowerCase().includes(filters.query.toLowerCase())) {
          queryMatched = true
        }
      })

      if (!queryMatched) {
        return false
      }
    }

    if (filters.hasAcceptedMarketing && !student.hasAcceptedMarketing) {
      return false
    }

    if (filters.isProspect && !student.isProspect) {
      return false
    }

    if (filters.isReturning && !student.isReturning) {
      return false
    }

    return true
  })
}

const descendingComparator = (a, b, filterBy) => {
  // When compared to something undefined, always returns false.
  // This means that if a field does not exist from either element ('a' or 'b') the return will be 0.

  if (b[filterBy] < a[filterBy]) {
    return -1
  }

  if (b[filterBy] > a[filterBy]) {
    return 1
  }

  return 0
}

const getComparator = (filterDir, filterBy) =>
  filterDir === 'desc'
    ? (a, b) => descendingComparator(a, b, filterBy)
    : (a, b) => -descendingComparator(a, b, filterBy)

const applyFilterByStatus = (items, filterBy) => {
  let filterByStatus

  if (filterBy === 'all') {
    filterByStatus = items
  } else {
    filterByStatus = items.filter(items => items?.categoryName === filterBy)
  }

  return filterByStatus
}

const applyPagination = (items, page, rowsPerPage) => items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

const ListProductAdminTable = props => {
  const { DeleteProductFunc } = useProductFunc()
  const queryRef = useRef(null)
  const { ListCategoryFunc } = useCategoryFunc()
  const router = useRouter()
  // ** States
  const [page, setPage] = useState(0)
  const [listCategory, setListCategory] = useState([])
  const [userSelected, setUserSelected] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [filter, setFilter] = useState(filterOptions[0].value)
  const [filters, setFilters] = useState({
    query: '',
    hasAcceptedMarketing: undefined,
    isProspect: undefined,
    isReturning: undefined
  })
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [imgSrc, setImgSrc] = useState('/images/avatars/1.png')
  const { product, setRender, render, getListProduct } = props
  const path = process.env.NEXT_PUBLIC_S3_URL

  function getValuesFromArray(arr, property) {
    return arr.reduce(
      (prev, next) => {
        prev.push({ ['label']: next[property], ['value']: next[property] })

        return prev
      },
      [{ label: 'All', value: 'all' }]
    )

    // return [, ...arr.map(item => ({ ['label']: item[property], ['value']: item[property] }))]
  }

  useEffect(async () => {
    const dataCategory = await ListCategoryFunc()
    console.log('category...', dataCategory)
    if (!_.isEmpty(dataCategory)) {
      filterOptions = getValuesFromArray(dataCategory.data, 'categoryName')
      console.log('filterOptions', filterOptions)
    }
  }, [])

  const handleQueryChange = event => {
    event.preventDefault()
    setFilters(prevState => ({
      ...prevState,
      query: queryRef.current?.value
    }))
    setPage(0)
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  const handleFilterChange = event => {
    setPage(0)
    setFilter(event.target.value)
  }

  const handleRowsPerPageChange = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
  }

  const handleCloseModal = () => setOpenModal(false)

  const filteredStudents = applyFilters(product, filters)
  const filteredByStatus = applyFilterByStatus(filteredStudents, filter)
  const paginatedStudents = applyPagination(filteredByStatus, page, rowsPerPage)

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          m: -1.5,
          p: 3
        }}
      >
        <Box
          component='form'
          onSubmit={handleQueryChange}
          sx={{
            flexGrow: 1,
            m: 1.5
          }}
        >
          <TextField
            size={'small'}
            defaultValue=''
            fullWidth
            inputProps={{ ref: queryRef }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Magnify fontSize='small' />
                </InputAdornment>
              )
            }}
            placeholder='Search'
          />
        </Box>
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box sx={modalStyle}>
            <Typography id='modal-modal-title' variant='h4' component='h2' align='center'>
              Are you sure ？
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '18px',
                mt: 2.5
              }}
            >
              <Button variant='outlined' onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button
                variant='contained'
                onClick={async () => {
                  const deleteUser = await DeleteProductFunc(userSelected)
                  if (deleteUser) {
                    toast.success('Delete Success!')
                  } else {
                    toast.error('Delete Error! Try again')
                  }
                  getListProduct()
                  setOpenModal(!openModal)
                  setRender(!render)
                }}
              >
                Agree
              </Button>
            </Box>
          </Box>
        </Modal>
        <TextField
          size={'small'}
          label={' Filter By Category'}
          name='filter'
          onChange={handleFilterChange}
          select
          SelectProps={{ native: true }}
          sx={{ m: 1.5 }}
          value={filter}
        >
          {filterOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
      </Box>
      <TableContainer sx={{ maxHeight: 800 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={column.id} align={'left'} sx={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedStudents.map((item, index) => {
              return (
                <TableRow key={item.productId}>
                  <TableCell align={'left'}>{item.productName}</TableCell>
                  <TableCell align={'left'}>{item.categoryName}</TableCell>
                  <TableCell align={'left'}>{moment.unix(item.createdDate).format('MM/DD/YYYY')}</TableCell>
                  <TableCell align={'left'}>{item.quantity}</TableCell>
                  <TableCell align={'left'}>{item.price}</TableCell>
                  <TableCell align={'left'}>
                    {' '}
                    <img
                      src={item.images}
                      alt={item.productName}
                      loading='lazy'
                      style={{ width: '60px', height: '60px' }}
                    />
                  </TableCell>
                  <TableCell align={'left'}>{item.description}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex !important' }}>
                      <Button
                        onClick={() => {
                          console.log('account id...', item?.productId)
                          setOpenModal(true)
                          setUserSelected(item.productId)
                        }}
                      >
                        <CloseCircleOutline
                          fontSize='small'
                          sx={{
                            color: '#ff4c51 !important',
                            borderRadius: '10px'
                          }}
                        />
                      </Button>
                      <Button
                        onClick={() => {
                          router.push(`products-admin/${item?.productId}`)
                        }}
                      >
                        <ArrowRightCircle
                          fontSize='small'
                          sx={{
                            color: '#429AEB !important',
                            borderRadius: '10px'
                          }}
                        />
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={filteredByStatus.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </Paper>
  )
}

export default ListProductAdminTable
