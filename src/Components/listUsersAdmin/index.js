// ** React Imports
import { useState, useRef } from 'react'

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import { Box, Button, IconButton, InputAdornment, Modal, TextField, Typography } from '@mui/material'
import Magnify from 'mdi-material-ui/Magnify'
import moment from 'moment'
import { useUsersAdminFunc } from 'src/@core/hooks/use-user-admin'
import { toast } from 'react-hot-toast'
import NextLink from 'next/link';
import ArrowRightBoldBox from 'mdi-material-ui/ArrowRightBoldBox'
import { useRouter } from 'next/router'


const columns = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'address', label: 'Address', minWidth: 100 },
  {
    id: 'phoneNo',
    label: 'Phone Number',
    minWidth: 170,
    align: 'right',
    format: value => value.toLocaleString('en-US')
  },
  {
    id: 'email',
    label: 'Email',
    minWidth: 170,
    align: 'right',
    format: value => value.toLocaleString('en-US')
  },
  {
    id: 'birthDate',
    label: 'Birth Date',
    minWidth: 170,
    align: 'right',
    format: value => value.toFixed(2)
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

const filterOptions = [
  {
    label: 'Admin',
    value: 'admin'
  },
  {
    label: 'User',
    value: 'user'
  }
]

const applyFilters = (students, filters) => {
  return students.filter(s => {
    const student = s
    if (filters.query) {
      let queryMatched = false
      const properties = ['fullName']

      properties.forEach(property => {
        if (student[property].toLowerCase().includes(filters.query.toLowerCase())) {
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

const applyFiltersWithCourseType = (students, filters) => {
  return students.filter(s => {
    const student = s?.student
    if (filters.query) {
      let queryMatched = false
      const properties = ['name']

      properties.forEach(property => {
        if (student[property].toLowerCase().includes(filters.query.toLowerCase())) {
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

const applyFilterByStatus = (students, filterBy) => {
  let filterByStatus

  if (filterBy === 'admin') {
    filterByStatus = students.filter(student => student?.roleName === 'Admin')
  }

  if (filterBy === 'user') {
    filterByStatus = students.filter(student => student.roleName === 'User')
  }

  return filterByStatus
}

const applyPagination = (students, page, rowsPerPage) =>
  students.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

const ListUserAdminTable = props => {
  const queryRef = useRef(null)
  const { deleteUserAdminFunc } = useUsersAdminFunc()
  const router = useRouter()
  // ** States
  const [page, setPage] = useState(0)
  const [userSelected, setUserSelected] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [filter, setFilter] = useState(filterOptions[1].value)
  const [filters, setFilters] = useState({
    query: '',
    hasAcceptedMarketing: undefined,
    isProspect: undefined,
    isReturning: undefined
  })
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const { clients, setRender, render } = props

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

  const filteredStudents = applyFilters(clients, filters)
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
                  console.log('user selected', userSelected)
                  const deleteUser = await deleteUserAdminFunc(userSelected)
                  if (deleteUser == 200) {
                    toast.success('Delete Success!')
                  } else {
                    toast.error('Delete Error! Try again')
                  }
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
          label={' Filter By'}
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
                <TableRow key={item.accountId}>
                  <TableCell align={'left'}>{item.fullName}</TableCell>
                  <TableCell align={'left'}>{item.address}</TableCell>
                  <TableCell align={'left'}>{item.phoneNo}</TableCell>
                  <TableCell align={'left'}>{item.email}</TableCell>
                  <TableCell align={'left'}>{moment.unix(item.doB).format('MM/DD/YYYY')}</TableCell>
                  <TableCell align={'left'}>
                    <Button
                      variant='contained'
                      sx={{
                        color: '#FFF !important',
                        borderRadius: '10px',
                        backgroundColor: '#ff4c51',
                        '&:hover': {
                          backgroundColor: '#ff4c51'
                        }
                      }}
                      onClick={() => {
                        setOpenModal(true)
                        setUserSelected(item.accountId)
                      }}
                      disabled={item.roleName == 'Admin'}
                    >
                      Delete
                    </Button>
                    <Button
                      variant='contained'
                      sx={{
                        color: '#FFF !important',
                        borderRadius: '10px',
                        backgroundColor: '#429AEB',
                        '&:hover': {
                          backgroundColor: '#429AEB'
                        },
                        marginLeft:'8px'
                      }}
                      onClick={() => {
                        router.push(`list-user-admin/${item?.accountId}`)
                      }}
                    >
                      Detail
                    </Button>
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

export default ListUserAdminTable
