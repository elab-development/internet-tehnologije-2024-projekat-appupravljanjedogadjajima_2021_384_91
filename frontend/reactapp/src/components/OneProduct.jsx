import React from 'react'
//stavljam {} jer tacno zelim tu ikonicu
import {FaPlus} from "react-icons/fa";
import {BsDash} from "react-icons/bs";
//za CSS koristimo camelCase notaciju
//interni CSS kao promenljiva
//inline CSS, obazeno {{duple zagrade}}
function OneProduct() {
    const still = {margin: 1 + "em", borderStyle: "dotted"};
  return (
    <div className="card" style={still}>
      <img src="https:/picsum.photos/200" alt="Neka slika" />

    <div className="card-body">
        <h3 className="card-title">Product name</h3>
        <p className="card-text">This is description of the products.</p>
    </div>
    <button className="btn"><FaPlus/></button>
    <button className="btn"><BsDash/></button>
    </div>
  )
}

export default OneProduct
