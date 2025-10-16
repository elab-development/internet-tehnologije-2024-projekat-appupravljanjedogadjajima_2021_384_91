//arrow function komponenta
//precica rafce
import React from 'react'
import OneProduct from './OneProduct'


const Products = () => {
  return (
    <div className='all-products'>
      <OneProduct />
      <OneProduct />
      <OneProduct />
    </div>
  )
}

export default Products
