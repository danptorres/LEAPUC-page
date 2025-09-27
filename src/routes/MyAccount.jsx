import Swal from 'sweetalert2';
import axiosInstance from '../api/axiosInstance';
import './styles/Register.css';
import {useState, useContext, useEffect} from 'react';
import { AuthContext } from '../contexts/AuthContext';
import './styles/MyAccount.css';
import DataSanitizer from '../utils/DataSanitizer';



const MyAccount = () => {

    const {token} = useContext(AuthContext);  

    // Estado para controlar se o usuário está alterando a senha
    const [alterandoSenha, setAlterandoSenha] = useState(false);

    // Lista de cursos disponíveis
    const cursosDisponiveis = [
        "Arquitetura",
        "Engenharia Civil",
        "Engenharia de Produção",
        "Engenharia de Controle e Automação (Engenharia Mecatrônica)",
        "Engenharia Elétrica",
        "Engenharia de Computação",
        "Outros",
        "Não sou estudante da PUC"
    ];

    // Estado para armazenar os dados do formulário
    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        data_nascimento: '',
        endereco: '',
        telefone: '',
        curso: '',
        email: '',
        senha: '',
        confirmaSenha: '',
        receberEmails: false
    });

    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);

    // Função para buscar os dados do usuário autenticado
    const fetchUserData = async () => {

            // Método para formatar a data no formato ISO
            const formatarDataISO = (data) => {
                    if (!data) return '';
                    return new Date(data).toISOString().split('T')[0];
            };

            // Busca os dados do usuário autenticado
            try {
                const response = await axiosInstance.get('/usuarios/meus-dados', {
                    headers: { Authorization: `Bearer ${token}`}
                });

                // Preenche o estado com os dados atuais do usuário
                setFormData({
                    nome: response.data.usuario.nome_usuario || '',
                    data_nascimento: formatarDataISO(response.data.usuario.data_nascimento) || '',
                    cpf: response.data.usuario.cpf || '',
                    endereco: response.data.usuario.endereco || '',
                    telefone: response.data.usuario.telefone || '',
                    curso: response.data.usuario.curso || '',
                    email: response.data.usuario.email || '',
                    senha: '',
                    confirmaSenha: '',
                    receberEmails: response.data.usuario.aceita_emails || false
                });
            } catch (error) {
                Swal.fire({icon: 'error', title: 'Erro', text: 'Não foi possível carregar seus dados.'});
            }
        };

    useEffect(() => {
        if (token) {
            fetchUserData();
        }
    }, [token]);


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked: value
        }));
    }

    // Função para habilitar modo de edição
    const handleEditClick = (e) => {
        e.preventDefault(); // Previne qualquer comportamento padrão
        setEditMode(true);
    };

    // Função para cancelar edição
    const handleCancelEdit = (e) => {
        e.preventDefault();
        setEditMode(false);
        setAlterandoSenha(false);
        // Recarrega os dados originais
        fetchUserData();
    };

    // ANALISE E ENVIO DOS DADOS EDITADOS PARA A API
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Se não está em modo de edição, não deve processar
        if (!editMode) {
            return;
        }

        setLoading(true);
        const sanitizador = new DataSanitizer(formData);
        const erros = sanitizador.validarDadosUsuario();
        
        // SANITIZAÇÃO DOS DADOS NA EDIÇÃO
        if (editMode) {
           
            if (erros.length > 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro de validação',
                    html: erros.join('<br/>') // mostra todos os erros juntos
                });
                setLoading(false);
                return;
            }
        }

        let dadosEditados = sanitizador.sanitizarDadosUsuario();
        console.log('Dados editados do usuario prontos para envio:', dadosEditados);

        // Verificação da edição de senha
        if (alterandoSenha && formData.senha) {
            if (formData.senha !== formData.confirmaSenha) {
                Swal.fire({ icon: 'error', title: 'Erro', text: 'As senhas não coincidem.' });
                setLoading(false);
                return;
            }
            if (formData.senha.length < 6) {
                Swal.fire({ icon: 'error', title: 'Erro', text: 'A senha deve ter pelo menos 6 dígitos.' });
                setLoading(false);
                return;
            }
            dadosEditados.senha = formData.senha;
        }

        // Envio dos dados para a API
        try {
            await axiosInstance.put("/usuarios/meus-dados", dadosEditados, {
                headers: { Authorization: `Bearer ${token}` }
            });
            Swal.fire({ icon: 'success', title: 'Sucesso', text: 'Dados atualizados!' });

            // Reset do estado após sucesso
            setEditMode(false);
            setAlterandoSenha(false);
            setFormData(prev => ({ ...prev, senha: '', confirmaSenha: '' }));
            
            // Recarrega os dados atualizados
            await fetchUserData();

        } catch (erro){
            console.log('Erro recebido:', erro);
            if (erro.response?.status) {
                Swal.fire({
                icon: 'error',
                title: 'Erro ao atualizar dados',
                text: erro.response?.data?.erro,
                });
            }
        } finally {
            // Reabilita o botão de envio
            setLoading(false);
        }
    };

    // Função para alternar modo de senha
    const handleTogglePassword = (e) => {
        e.preventDefault();
        setAlterandoSenha(!alterandoSenha);
        if (alterandoSenha) {
            // Limpa os campos de senha ao cancelar
            setFormData(prev => ({ ...prev, senha: '', confirmaSenha: '' }));
        }
    };
    
    return (
        <div>
            <h1>Minha conta</h1>
            <div className="register-inputs">  
                <form id='register-form' onSubmit={handleSubmit}>
                    <div className='form-inputs'>
                        {/* EMAIL */}
                        <div className="form-control">
                            <label htmlFor="email">Email:</label>
                            <input type="text" name='email' id='email' value={formData.email} onChange={handleChange} disabled/>
                        </div>
                        {/* NOME */}
                        <div className="form-control">
                            <label htmlFor="complete-name">Nome completo:</label>
                            <input type="text" name='nome' id='complete-name' value={formData.nome} onChange={handleChange} disabled={!editMode} required={editMode}/>
                        </div>
                        {/* CPF */}
                        <div className="form-control">
                            <label htmlFor="cpf">CPF:</label>
                            <input type="text" name='cpf' id='cpf' value={formData.cpf} onChange={handleChange} disabled={!editMode}/>
                        </div>
                        {/* ENDEREÇO */}
                        <div className="form-control">
                            <label htmlFor="endereco">Endereço:</label>
                            <input type="text" name='endereco' id='endereco' value={formData.endereco} onChange={handleChange} disabled={!editMode}/>
                        </div>
                        {/* telefone */}
                        <div className="form-control">
                            <label htmlFor="telefone">Telefone:</label>
                            <input type="tel" name='telefone' id='telefone' value={formData.telefone} onChange={handleChange} disabled={!editMode}/>
                        </div>
                        {/* DATA DE NASCIMENTO */}
                        <div className="form-control">
                            <label htmlFor="date-birth">Data de Nascimento:</label>
                            <input type="date" name='data_nascimento' id='date-birth' value={formData.data_nascimento} onChange={handleChange} disabled={!editMode}/>
                        </div>
                        {/* CURSO */}
                        <div className="form-control">
                            <label htmlFor="curso">Curso:</label>
                            <select
                                name="curso"
                                id="curso"
                                value={formData.curso}
                                onChange={handleChange}
                                disabled={!editMode}
                            >
                                <option value="">Selecione...</option>
                                {cursosDisponiveis.map((curso) => (
                                    <option key={curso} value={curso}>{curso}</option>
                                ))}
                            </select>
                        </div>
                        {/* Aceitar e-mails */}
                        <label className="email-checkbox">
                            <input type="checkbox" id='email-accepted' name='receberEmails' checked={formData.receberEmails} onChange={handleChange} className='input-email-accepted' disabled={!editMode}/>
                            <span className="checkmark"></span>
                            Aceitar receber e-mails sobre as novidades da Liga
                        </label>
                        {/* EDIÇÃO DE SENHA */}
                        <button type="button" onClick={() => setAlterandoSenha(!alterandoSenha)}>
                            {alterandoSenha ? 'Cancelar alteração de senha' : 'Alterar senha'}
                        </button>
                        {alterandoSenha && (
                            <>
                                <div>
                                    <label>Nova Senha:</label>
                                    <input
                                        type="password"
                                        name="senha"
                                        value={formData.senha}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label>Confirmar Senha:</label>
                                    <input
                                        type="password"
                                        name="confirmaSenha"
                                        value={formData.confirmaSenha}
                                        onChange={handleChange}
                                    />
                                </div>
                            </>
                        )}
                        {/* BOTÕES DE AÇÃO*/}
                        <div className="action-control">
                            {!editMode ? (
                                <button 
                                    type="button" 
                                    onClick={handleEditClick}
                                    disabled={loading}
                                >
                                    {loading ? "Carregando..." : "Editar dados"}
                                </button>
                            ) : (
                                <>
                                    <button type="submit" disabled={loading}>
                                        {loading ? "Salvando..." : "Salvar alterações"}
                                    </button>
                                    <button type="button" onClick={handleCancelEdit} disabled={loading}>
                                        Cancelar
                                    </button>
                                </>
                            )}
                        </div>
                        
                    </div>
                </form>
            </div>
        </div>
    );
}

export default MyAccount