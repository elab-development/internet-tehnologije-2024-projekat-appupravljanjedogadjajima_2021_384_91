import React from 'react'
//stavljam {} jer tacno zelim tu ikonicu
import {FaPlus} from "react-icons/fa";
import {BsDash} from "react-icons/bs";
//za CSS koristimo camelCase notaciju
//interni CSS kao promenljiva
//inline CSS, obazeno {{duple zagrade}}

//DESTRUKTURIRANJE OBJEKTA
function OneProduct({product, onAdd }) {
    const still = {margin: 1 + "em", borderStyle: "dotted"};
    //console.log(props)
    // function onAdd(title){
    //   console.log("dodat proizvod" + title)
    // }

  return (
    <div className="card" style={still}>
      <img src="https:/picsum.photos/200" alt="Neka slika" />

    <div className="card-body">
        <h3 className="card-title">{product.title}</h3>
        <p className="card-text">{product.description}</p>
    </div>
    <button className="btn" onClick={()=>onAdd(product.title)}>
      <FaPlus/></button>
    <button className="btn"><BsDash/></button>
    </div>
  )
}

export default OneProduct
