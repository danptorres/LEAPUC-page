import { useState } from 'react';
import {Swiper, SwiperSlide } from 'swiper/react';
import { useEffect } from 'react';
import {register} from 'swiper/element/bundle';
import { useParams } from "react-router-dom";
import axiosInstance from '../api/axiosInstance';
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import './products/routes-products/styles/Product.css'
import Swal from 'sweetalert2';



function ProductDetail() {
    register();

    const [productData, setProductData] = useState([]);

    // Pegar o ID do produto pela URL
    const { id } = useParams();


    const fetchProductData = async () => {
        try {
          const response = await axiosInstance.get(`/produtos/${id}`);
          setProductData(response.data);
          
        }
        catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erro ao carregar o produto',
                text: 'Por favor, tente novamente mais tarde.',
            });
        }
    };

    useEffect(() => {
        fetchProductData();
    }, [id]);

    if (!productData) return <p>Carregando...</p>;

    // Incluir as urls das imagens dos produtos no array
    const product_images = productData.urls_imagens || [];

    // Incluir os tamanhos disponíveis do produto no array
    const tamanhos_disponiveis = productData.tamanhos_disponiveis || [];
    console.log('Tamanhos disponiveis: ',tamanhos_disponiveis);


    // Mudar a cor do botão de tamanho selecionado
    const [activeSize, setActiveSize] = useState(null);

    const handleSizeClick = (size) => {
        setActiveSize(size);
    };


  return (
    <div>
      <div className="product-container">        
        {productData && (
        <Swiper className='slider-swiper' spaceBetween={10} slidesPerView={1} pagination={{clickable: true}} navigation >
            {product_images.map((imgUrl, index) => (
            <SwiperSlide className='swiperslide' key={index} >
                <img src={`http://localhost:3001${imgUrl}`} alt={`${productData.nome_produto} ${index + 1}`} />
            </SwiperSlide>
            ))}
        </Swiper>
        )}
        <div className="product-description">
          <h2>{productData.nome_produto}</h2>
          <p className='description'>{productData.descricao}</p>
          <p className='price'>R$ {productData.valor_produto}</p>
          

            {/* Dados para produto esportivo */}
            {productData.id_categoria_produto === 1 && (
                <div className="product-details">
                {/* Dados para produto personalizado */}
                <label htmlFor="name" className='label-name'>Nome na camisa</label>
                <input type="text" id='name' name='name' className='input-name' placeholder='Digite o nome na camiseta'/>
                <label htmlFor="number" id='label-number'>Número na camisa</label>
                <input type="number" min={0} id='number' name='number' className='input-number'/>

                {/* Verificação de atleta */}
                <label className="athlete-checkbox">
                <input type="checkbox" id='athlete' name='athlete' className='input-athlete'/>
                <span className="checkmark"></span>
                    Comprar como atleta
                </label>
                </div>
            )}

          {/* Tamanho da Camiseta */}
          { tamanhos_disponiveis.length > 0 && (
            <div className="product-size">
             <h2>Selecione o tamanho</h2>
                <ul className='size-list'>
                {tamanhos_disponiveis.map((size) => (
                    <li key={size}>
                    <button
                        className={activeSize === size ? 'active' : ''}
                        onClick={() => handleSizeClick(size)}
                    >
                        {size}
                    </button>
                    </li>
                ))}
                </ul>
           </div>)
         }

        </div>
      </div>
      <div className="add-to-cart">
          <button id='confirmed-button'>Adicionar ao carrinho</button>
      </div>
    </div>
  )
}

export default ProductDetail
