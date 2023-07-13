import { Box, Typography } from '@mui/material'
import Layout from 'src/layouts/Main'
import React from 'react'
import Breadcrumb from 'src/Components/breadcrumb'

const ProfileUserClient = () => {
  return (
    <>
      <Layout>
        <Breadcrumb title={'Profile'} />
        <div className='container'>
          <Typography>Profile</Typography>
        </div>
      </Layout>
    </>
  )
}

export default ProfileUserClient
