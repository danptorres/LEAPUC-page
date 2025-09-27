import Swal from 'sweetalert2';
import axiosInstance from '../api/axiosInstance';
import './styles/Register.css';
import { useNavigate, Link } from 'react-router-dom';
import {useState, useContext} from 'react';
import { AuthContext } from '../contexts/AuthContext';

const Register = () => {

  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    dataNascimento: '',
    email: '',
    senha: '',
    confirmaSenha: '',
    receberEmails: false
  });

  const { login } = useContext(AuthContext); 

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked: value
    }));
  }


  // PEQUENA ANALISE E ENVIO DOS DADOS PARA A API
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    // SANITIZAÇÃO DOS DADOS
    const nome = formData.nome.trim();
    const email = formData.email.trim().toLowerCase();
    const cpf = formData.cpf.replace(/\D/g, ''); // remove tudo que não for número
    const senha = formData.senha;
    const confirmaSenha = formData.confirmaSenha;
    const aceitaEmails = formData.receberEmails;

    if (!/^\d{11}$/.test(cpf)) {
      alert("O CPF deve conter 11 dígitos numéricos.");
      setLoading(false);
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      alert("Digite um email válido.");
      setLoading(false);
      return;
    }

    if (senha.length < 6) {
      alert("A senha deve ter no mínimo 6 caracteres.");
      setLoading(false);
      return;
    }

    // CONFIRMAÇÃO DE SENHA
    if (formData.senha !== formData.confirmaSenha) {
      alert("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    // ENVIO DOS DADOS PARA A API
    try {
      const response = await axiosInstance.post("/usuarios/register", {
        nome_usuario: formData.nome,
        email: formData.email,
        cpf: formData.cpf,
        dataNascimento: formData.dataNascimento,
        senha: formData.senha,
        aceita_emails: formData.receberEmails 
      });

      login(response.data.token);

      if (response.status === 201 || response.status === 200) {
        setFormData({
          nome: '',
          cpf: '',
          dataNascimento: '',
          email: '',
          senha: '',
          confirmaSenha: '',
          receberEmails: false
        });

        Swal.fire({icon: 'success', title: 'Bem vindo a LEAPUC!', text: response.data.mensagem,});
      }
      navigate('/');   
      
    } catch (erro){
      console.log('Erro recebido:', erro);
      if (erro.response?.status === 409) {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao cadastrar',
          text: erro.response?.data?.erro,
        });
      }
    } finally {
      // Reabilita o botão de envio
      setLoading(false);
    }
  };

  
  // Estrutura
  return (
    <div className='register'>
      <h1>Venha fazer parte da LEAPUC</h1>
      <div className="register-inputs">
        <form id='register-form' onSubmit={handleSubmit}>
        <div className='form-inputs'>
          {/* INSERIR NOME */}
          <div className="form-control">
            <label htmlFor="complete-name">Nome completo:</label>
            <input type="text" name='nome' id='complete-name' placeholder='Digite seu nome completo' value={formData.nome} onChange={handleChange}/>
          </div>
          {/* INSERIR CPF */}
          <div className="form-control">
            <label htmlFor="cpf">CPF:</label>
            <input type="text" name='cpf' id='cpf' placeholder='Digite seu CPF' value={formData.cpf} onChange={handleChange}/>
          </div>
          {/* INSERIR DATA DE NASCIMENTO */}
          <div className="form-control">
            <label htmlFor="data-birth">Data de Nascimento:</label>
            <input type="date" name='dataNascimento' id='date-birth' placeholder='Digite sua Data de Nascimento' value={formData.dataNascimento} onChange={handleChange}/>
          </div>

          {/* INSERIR EMAIL */}
          <div className="form-control">
            <label htmlFor="email">Email:</label>
            <input type="text" name='email' id='email' placeholder='Digite seu email' value={formData.email} onChange={handleChange}/>
          </div>
          {/* INSERIR SENHA */}
          <div className="form-control">
            <label htmlFor="password">Senha:</label>
            <input type="password" name='senha' id='password' placeholder='Digite sua senha' value={formData.senha} onChange={handleChange}/>
          </div>
          {/* INSERIR CONFIRMAÇÃO DE SENHA */}
          <div className="form-control">
            <label htmlFor="confirm-password">Confirme seua senha:</label>
            <input type="password" name='confirmaSenha' id='confirm-password' placeholder='Confirme sua senha' value={formData.confirmaSenha} onChange={handleChange}/>
          </div>
          {/* Aceitar e-mails */}
          <label className="email-checkbox">
              <input type="checkbox" id='email-accepted' name='receberEmails' checked={formData.receberEmails} onChange={handleChange} className='input-email-accepted'/>
              <span className="checkmark"></span>
                Aceitar receber e-mails sobre as novidades da Liga
            </label>
          {/* BOTÃO DE ENVIO */}
          <div className="action-control">
            <button type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Criar conta"}
            </button>
          </div>

        </div>
        </form>
      </div>
    </div>
  )
}

export default Register