import React from 'react'
import './NavbarComponnent.css'; // hover styles below
import Carousel from 'react-bootstrap/Carousel';
import banner from '../../assets/images/banner-1.jpg';
import banner2 from '../../assets/images/banner-2.jpg';
    

export default function CarouselComponent() {
  return (
    <div>

              {/* Hero / Carousel */}
      <section className="hero-section">
        <Carousel>
          <Carousel.Item>
            <img
              className="d-block w-100 h-100"
              src={banner}
              alt="First slide"
            />
            <Carousel.Caption>
              <h3>First slide label</h3>
              <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
            </Carousel.Caption>
          </Carousel.Item>

          {/* <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://picsum.photos/seed/slide2/1600/500"
              alt="Second slide"
            />
            <Carousel.Caption>
              <h3>Second slide label</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </Carousel.Caption>
          </Carousel.Item> */}

          <Carousel.Item>
            <img
              className="d-block w-100 h-100"
              src={banner2}
              alt="Third slide"
            />
            <Carousel.Caption>
              <h3>Third slide label</h3>
              <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </section>
    </div>
  )
}
