import Swal from 'sweetalert2';
import axiosInstance from '../api/axiosInstance';
import {useState, useContext, useEffect} from 'react';
import { AuthContext } from '../contexts/AuthContext';
import './styles/AdminPage.css'
import ProductManagement from '../components/ProductManagement.jsx'

const AdminPage = () => {


  const [gerenciandoProdutos, setGerenciarProdutos] = useState(false);
  const [gerenciandoPedidos, setGerenciarPedidos] = useState(false);
  const [gerenciandoDiretores, setGerenciarDiretores] = useState(false);
  const [gerenciandoEventos, setGerenciarEventos] = useState(false);
  const [gerenciandoTreinos, setGerenciarTreinos] = useState(false);
  const [gerenciandoEstoque, setGerenciarEstoque] = useState(false);
  const [gerandoRelatorios, setGerandoRelatorios] = useState(false);
  const [configurandoSite, setConfigurandoSite] = useState(false);

  return (
    <div className='admin-page'>
      <h1>Pagina de Administração</h1>
      <ul>
        <li className='product-management-section'>
          {gerenciandoProdutos && <ProductManagement/>}
          <button type='button' onClick={() => setGerenciarProdutos(!gerenciandoProdutos)}>
            {!gerenciandoProdutos ? 'Gerenciar Produtos' : 'Concluir gerenciamento de produtos'}
          </button>
        </li>
        <li>
          <button type='button' onClick={() => setGerenciarPedidos(!gerenciandoPedidos)}>
            {!gerenciandoPedidos ? 'Gerenciar Pedidos' : 'Concluir'}
          </button>
        </li>
        <li>
          <button type='button' onClick={() => setGerenciarDiretores(!gerenciandoDiretores)}>
            {!gerenciandoDiretores ? 'Gerenciar Diretores' : 'Concluir'}
          </button>
        </li>
        <li>
          <button type='button' onClick={() => setGerenciarEventos(!gerenciandoEventos)}>
            {!gerenciandoEventos ? 'Gerenciar Eventos' : 'Concluir'}
          </button>
        </li>
        <li>
          <button type='button' onClick={() => setGerenciarTreinos(!gerenciandoTreinos)}>
            {!gerenciandoTreinos ? 'Gerenciar Treinos' : 'Concluir'}
          </button>
        </li>
        <li>
          <button type='button' onClick={() => setGerenciarEstoque(!gerenciandoEstoque)}>
            {!gerenciandoEstoque ? 'Gerenciar Estoque' : 'Concluir'}
          </button>
        </li>
        <li>
          <button type='button' onClick={() => setGerandoRelatorios(!gerandoRelatorios)}>
            {!gerandoRelatorios ? 'Gerar Relatórios' : 'Concluir'}
          </button>
        </li>
        <li>
          <button type='button' onClick={() => setConfigurandoSite(!configurandoSite)}>
            {!configurandoSite ? 'Configurar Site' : 'Concluir'}
          </button>
        </li>
      </ul>
    </div>
  )
}

export default AdminPage
