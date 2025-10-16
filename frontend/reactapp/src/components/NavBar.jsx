//precica rfce
import React from 'react'
import {FaShoppingCart} from "react-icons/fa";

function NavBar({cartNum } ) {
  //const cartNum = 0
  return (
    <div className = "navBar">
      <a>My store</a>
      <div className='cart-items'>
        <FaShoppingCart/>
        <p className='cart-num'>{cartNum}</p>
      </div>
    </div>
  )
}

export default NavBar
