import React from 'react'
import Navbar from './Common/Navbar'
import { Button, Carousel } from 'bootstrap'
import NavbarComponent from './Common/Navbar.jsx'
import CarouselComponent from './Common/CarouselComponent.jsx'
import Layout from './Common/Layout.jsx'
import NewArrivals from './HomeComponents/NewArrivals.jsx'
import Featured from './HomeComponents/Featured.jsx'

export const Home = () => {
  return (
    <div>
   <Layout>
    <CarouselComponent />
    <NewArrivals />
    <Featured />
   </Layout>
    </div>
  )
}
