//precica rfce
import React from 'react'
import {FaShoppingCart} from "react-icons/fa";

function NavBar() {
  return (
    <div className = "navBar">
      <a>My store</a>
      <div className='cart-items'>
        <FaShoppingCart/>
        <p className='cart-num'>0</p>
      </div>
    </div>
  )
}

export default NavBar
