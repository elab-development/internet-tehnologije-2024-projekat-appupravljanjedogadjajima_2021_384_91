import React from 'react'

function OneProduct() {
  return (
    <div className="card">
      <img src="https:/picsum.photos/200" alt="Neka slika" />

    <div className="card-body">
        <h3 className="card-title">Product name</h3>
        <p className="card-text">This is description of the products.</p>
    </div>
    <button className="btn">+</button>
    <button className="btn">-</button>
    </div>
  )
}

export default OneProduct
