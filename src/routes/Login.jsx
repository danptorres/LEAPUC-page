import axiosInstance from '../api/axiosInstance';
import Swal from 'sweetalert2';
import {useState, useContext} from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './styles/Login.css'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault(); //Não deixa a pagina recarregar

    try {
      const response = await axiosInstance.post('/usuarios/login', {
        email: email,
        senha: password,
      });

      login(response.data.token);

      Swal.fire({icon: 'success', 
        title: 'Login realizado com sucesso!', 
        text: response.data.mensagem,
      });
 
      navigate('/');   //Redireciona para a home após o login
    } catch (erro) {
        Swal.fire({icon: 'error', 
          title: 'Erro ao fazer login', 
          text: erro.response?.data?.mensagem || 'Erro inesperado',
        });
      }
  };


  return (
    <div className='login'>
      <form id='login-form' onSubmit={handleLogin}>
        <h1>Faça seu login</h1>
        <div className='form-inputs'>
          <div className="form-control">
            <label htmlFor="email">Email:</label>
            <input 
              type="text" 
              name='email' 
              id='email' 
              placeholder='Digite seu email' 
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-control">
            <label htmlFor="password">Senha:</label>
            <input 
              type="password" 
              name='password' 
              id='password' 
              placeholder='Digite sua senha'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="action-control">
            <button type="submit">Acessar</button>
            <button type="button" onClick={() => navigate('/register')} id='register'>Criar uma conta</button>
          </div>
          <div id="password-forgot">
            <button type="button">Esqueci minha senha</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Login