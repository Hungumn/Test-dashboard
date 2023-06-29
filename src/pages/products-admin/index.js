import React from 'react'
import { AuthGuard } from 'src/@core/hooks/auth-guard'
import UserLayout from 'src/layouts/UserLayout'

function ProductAdmin() {
  return (
    <div>index</div>
  )
}

ProductAdmin.getLayout = (page) => (
  <AuthGuard role={'admin'}>
    <UserLayout>{page}</UserLayout>
  </AuthGuard>
)
export default ProductAdmin