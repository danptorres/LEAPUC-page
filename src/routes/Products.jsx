import React from 'react'
import { Link, NavLink } from "react-router-dom"
import './styles/Products.css'
import { useState, useContext, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";


const Products = () => {

  const [products, setProducts] = useState([]);
  
  
  const fetchProductData = async () => {
    try {
      const response = await axiosInstance.get('/produtos');
      setProducts(response.data);
    }
    catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
    
  };
  
  useEffect(() => {
    fetchProductData();
  }, [])

  

  return (
    <div className='products'>
      <h1>Confira nossos produtos</h1>
      
      <div className="products-grid">
        {products.map((produto) => (
          <Link to={`/product/${produto.id_produto}`} key={produto.id_produto} className="product-card">
            <div className="product-card">
              <img src={`http://localhost:3001${produto.urls_imagens[0]}`} 
                    alt={produto.nome_produto} 
              />
              <h2>{produto.nome_produto}</h2>
              <p className="price">R$ {produto.valor_produto}</p>
            </div>
          </Link>
        ))}
      </div>

    </div>
  )
}

export default Products