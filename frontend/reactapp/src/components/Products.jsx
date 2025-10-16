//arrow function komponenta
//precica rafce
import React from 'react'
import OneProduct from './OneProduct.jsx'


const Products = ({products, onAdd }) => {
  //const name = "Naziv proizvoda";
  //const desc = "Ovo je malo duzi opis proizvoda"
  // const product = {
  //   title: "Naziv proizvoda",
  //   description: "Ovo je malo duzi opis proizvoda"
  // }
  
// arrow f-je
// (a) => {
//   let b = 10;
//   return a+10;
// }


  return (
    <div className='all-products'>
      {products.map((prod)=>(
        <OneProduct product={prod} key = {prod.id} onAdd={onAdd} />
      ))}
      {/* {products.map((prod)=>{
        return <OneProduct product={prod} />
      })} */}

      {/* <OneProduct  product ={products[0]} />
      <OneProduct  product ={products[1]} />
      <OneProduct  product ={products[2]} /> */}
    </div>
  )
}

export default Products
