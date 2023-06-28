import React from 'react'
import UserLayout from 'src/layouts/UserLayout'

function ProductAdmin() {
  return (
    <div>index</div>
  )
}

ProductAdmin.getLayout = page => <UserLayout>{page}</UserLayout>
export default ProductAdmin