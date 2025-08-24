import React from 'react'
import Layout from './Common/Layout'
import ProductSlider from './ProductSlider'
import BreadCrumb from './BreadCrumb'

function ProductPage() {
  return (
    <div>
        <Layout>
            <BreadCrumb />
            <ProductSlider />
        </Layout>
    </div>
  )
}

export default ProductPage