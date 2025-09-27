import React from "react";
import "./ProductManagement.css";
import { useState, useContext, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "../contexts/AuthContext";
import Swal from "sweetalert2";

const ProductManagement = () => {
  const { token } = useContext(AuthContext);

  const [adicionandoProdutos, setAdicionandoProdutos] = useState(false);
  const [editandoProdutos, setEditandoProdutos] = useState(false);
  const [removendoProdutos, setRemovendoProdutos] = useState(false);
  const [imagens, setImagens] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [produtoSelecionadoId, setProdutoSelecionadoId] = useState("");

  // Estados para categorias e tamanhos
  const [categorias, setCategorias] = useState([]);
  const [tamanhosDisponiveis, setTamanhosDisponiveis] = useState([]);
  const [estoquePorTamanho, setEstoquePorTamanho] = useState({});
  const [estoquePorEncomenda, setEstoquePorEncomenda] = useState(false);


  const [formProductData, setFormProductData] = useState({
    nome_produto: "",
    valor_produto: "",
    descricao: "",
    id_categoria_produto: "",
    disponivel: true,
    urls_imagens: [],
  });


  // Estado para armazenar produtos a serem selecionados (para edição/remoção)
  const [ProductsSelectData, setProductsSelectData] = useState([{
    id_produto: "",
    nome_produto: "",
  }]);


  // Buscar categorias ao carregar componente
  const fetchCategorias = async () => {
    try {
      const response = await axiosInstance.get("/produtos/categorias");
      setCategorias(response.data);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  // Buscar tamanhos quando categoria é selecionada
  const fetchTamanhosPorCategoria = async (idCategoria) => {
    try {
      const response = await axiosInstance.get(`/produtos/categorias/${idCategoria}/tamanhos`);
      setTamanhosDisponiveis(response.data);
      // Resetar estoque ao mudar categoria
      setEstoquePorTamanho({});
    } catch (error) {
      console.error("Erro ao buscar tamanhos:", error);
      setTamanhosDisponiveis([]);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  // Handle mudança de categoria
  const handleCategoriaChange = (e) => {
    const categoriaId = e.target.value;
    setFormProductData({ 
      ...formProductData, 
      id_categoria_produto: categoriaId 
    });

    if (categoriaId) {
      fetchTamanhosPorCategoria(categoriaId);
    } else {
      setTamanhosDisponiveis([]);
      setEstoquePorTamanho({});
    }
  };


  // Handle mudança de estoque por tamanho
  const handleEstoqueTamanhoChange = (idTamanho, quantidade) => {
    setEstoquePorTamanho(prev => ({
      ...prev,
      [idTamanho]: parseInt(quantidade) || 0
    }));
  };

  // Handle estoque por encomenda (zera todos os estoques)
  const handleEstoqueEncomenda = (tamanhosDisponiveis) => {
    const estoqueZerado = {};
    tamanhosDisponiveis.forEach(tamanho => {
      estoqueZerado[tamanho.id_tamanho] = 0;
    });

    setEstoquePorTamanho(estoqueZerado);
    setEstoquePorEncomenda(true);

    Swal.fire({
      icon: 'info',
      title: 'Estoque por encomenda',
      text: 'O estoque foi definido como 0 para todos os tamanhos. Os produtos serão feitos sob encomenda.',
    });
    return;
  }

  // Buscar produtos para seleção
  const fetchProductsSelectData = async () => {
    
    try {
      const response = await axiosInstance.get(`/produtos`);
      setProductsSelectData(
        response.data.map(produto => ({
          id_produto: produto.id_produto,
          nome_produto: produto.nome_produto
        }))
      );

    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Erro ao carregar o produto',
            text: 'Por favor, tente novamente mais tarde.',
        });
    }
  };

  useEffect(() => {
    fetchProductsSelectData();
  }, []);


  // Alterar produto selecionado para edição
  const handleProductSelectChange = async (e) => {
    const produtoId = e.target.value;
    setProdutoSelecionadoId(produtoId);

   if (produtoId) {
    const response = await axiosInstance.get(`/produtos/${produtoId}`);
    setFormProductData(response.data);
    }
    
  };


  // Manipulação de imagens
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const validPreviews = [];

    files.forEach((file) => {
      const isValidType = ["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(file.type);
      const isValidSize = file.size <= 2 * 1024 * 1024; // Máx. 2MB

      if (!isValidType) {
        Swal.fire({
          icon: "error",
          title: "Formato inválido!",
          text: `O arquivo ${file.name} não é uma imagem válida (somente PNG, JPG, JPEG, WEBP).`,
        });
        return;
      }

      if (!isValidSize) {
        Swal.fire({
          icon: "error",
          title: "Arquivo muito grande!",
          text: `O arquivo ${file.name} ultrapassa o limite de 2MB.`,
        });
        return;
      }

      // Se passou nas validações, adiciona
      validFiles.push(file);
      validPreviews.push(URL.createObjectURL(file));
    });

    // Atualiza estados
    setImagens((prev) => [...prev, ...validFiles]);
    setPreviews((prev) => [...prev, ...validPreviews]);
  };



  // Validação do formulário
  const validarFormulario = () => {
    if (!formProductData.nome_produto.trim()) {
      Swal.fire({icon: 'error', title: 'Nome do produto é obrigatório'});
      return false;
    }
    
    if (!formProductData.valor_produto || parseFloat(formProductData.valor_produto) <= 0) {
      Swal.fire({icon: 'error', title: 'Valor deve ser maior que zero'});
      return false;
    }
    
    if (!formProductData.descricao.trim()) {
      Swal.fire({icon: 'error', title: 'Descrição é obrigatória'});
      return false;
    }

    if (!formProductData.id_categoria_produto) {
      Swal.fire({icon: 'error', title: 'Selecione uma categoria'});
      return false;
    }

    // Verificar se pelo menos um tamanho tem estoque
    const temEstoque = Object.values(estoquePorTamanho).some(qty => {
        const quantidade = parseInt(qty);
        return !isNaN(quantidade) && quantidade >= 0;
    });

    if (!temEstoque && !estoquePorEncomenda) {
      Swal.fire({icon: 'error', title: 'Adicione estoque para pelo menos um tamanho'});
      return false;
    }

    if (imagens.length === 0) {
      Swal.fire({ icon: 'error', title: 'Adicione pelo menos uma imagem' });
      return false;
    }

    return true;
  };

  const limparFormulario = () => {

    setFormProductData({
    nome_produto: "", 
    valor_produto: "",
    descricao: "",
    id_categoria_produto: "",
    disponivel: true,
    imagens: [],
});

    // Limpar estados relacionados
    setTamanhosDisponiveis([]);
    setEstoquePorTamanho({});

    // Revoga todas as URLs criadas para previews
    previews.forEach((url) => URL.revokeObjectURL(url));
    setPreviews([]);
    setImagens([]);
    setEstoquePorTamanho({});

    // Limpar input de arquivo
    const fileInput = document.getElementById('product-image');
    if (fileInput) {
      fileInput.value = '';
    }

  };

  // Remover imagem específica
  const removeImage = (index) => {
    setImagens((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;
    
    setUploading(true);

    const formData = new FormData();
    formData.append('nome_produto', formProductData.nome_produto);
    formData.append('valor_produto', formProductData.valor_produto);
    formData.append('descricao', formProductData.descricao);
    formData.append('id_categoria_produto', formProductData.id_categoria_produto);
    formData.append('disponivel', formProductData.disponivel);

    // Converter o objeto de estoque por tamanho em JSON
    const estoqueJson = JSON.stringify(estoquePorTamanho);
    formData.append('estoque_tamanhos', estoqueJson);



    for (let i = 0; i < imagens.length; i++) {
        formData.append("product-image", imagens[i]);
    }

    try {
      await axiosInstance
        .post("/produtos/register", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((response) => {
          console.log("Produto adicionado com sucesso:", response.data);
          Swal.fire({
            icon: "success",
            title: "Produto adicionado!",
            text: response.data.mensagem,
          });
          limparFormulario();
          setAdicionandoProdutos(false);
        })
    } catch (error) {
      Swal.fire({
                icon: 'error',
                title: 'Erro ao cadastrar produto',
                text: error.response?.data?.error || 'Ocorreu um erro inesperado.',
              });
      console.error("Erro ao adicionar produto:", error);
    } finally {
      setUploading(false);
    }
    setPreviews([]);           
  };


  // Envio dos dados para edição do produto
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
        const response = await axiosInstance.put(`/produtos/edit/${produtoSelecionadoId}`, {
            nome_produto: formProductData.nome_produto,
            valor_produto: formProductData.valor_produto,
            descricao: formProductData.descricao,
            disponivel: formProductData.disponivel
        });

        Swal.fire({
            icon: "success",
            title: "Produto editado!",
            text: response.data.mensagem,
        });

        setEditandoProdutos(false);
        setProdutoSelecionadoId(false);
        limparFormulario();
        fetchProductsSelectData();
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Erro ao editar produto',
            text: error.response?.data?.error || 'Erro inesperado',
        });
    } finally {
        setUploading(false);
    }
  };


  // Envio do ID do produto que será excluido
  const handleDeletSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
        await axiosInstance.delete(`/produtos/delete/${produtoSelecionadoId}`).then((response) => {
          console.log("Produto excluido com sucesso:", response.data);
          Swal.fire({
            icon: "success",
            title: "Produto Excluido!",
            text: response.data.mensagem,
          });
          limparFormulario();
          setRemovendoProdutos(false);
          setProdutoSelecionadoId(false);
        })
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Erro ao excluir produto',
            text: error.response?.data?.error || 'Erro inesperado',
        });
    } finally {
        setUploading(false);
    }
  }

  // Cleanup do preview quando componente desmonta ou preview muda
  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);


  return (
    <div className="product-management">
      <h1>Gerenciamento de produtos</h1>
      <ul>
        <li>
          {adicionandoProdutos && (
            <div className="add-product-form">
              <h2>Adicionar novo produto</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  {/* NOME DO PRODUTO */}
                  <label htmlFor="product-name">Nome do Produto:</label>
                  <input 
                    type="text" 
                    id="product-name" 
                    name="product-name" 
                    value={formProductData.nome_produto}
                    disabled={uploading}
                    onChange={(e) => setFormProductData({ ...formProductData, nome_produto: e.target.value })}
                    required
                 />
                </div>
                {/* CATEGORIA DO PRODUTO */}
                <div className="form-group">
                  <label htmlFor="product-category">Categoria:</label>
                  <select
                    id="product-category"
                    name="product-category"
                    value={formProductData.id_categoria_produto}
                    onChange={handleCategoriaChange}
                    disabled={uploading}
                    required
                  >
                    <option value="">Selecione uma categoria...</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.id_categoria_produto} value={categoria.id_categoria_produto}>
                        {categoria.nome_categoria}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Seção de Tamanhos e Estoque */}
                {tamanhosDisponiveis.length > 0 && (
                  <div className="form-group">
                    <label>Estoque por Tamanho:</label>
                    <div className="tamanhos-estoque" style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '15px',
                      marginTop: '10px'
                    }}>
                      {tamanhosDisponiveis.map((tamanho) => (
                        <div key={tamanho.id_tamanho} style={{
                          border: '1px solid #ddd',
                          padding: '10px',
                          borderRadius: '5px'
                        }}>
                          <label style={{fontWeight: 'bold', marginBottom: '5px', display: 'block'}}>
                            Tamanho {tamanho.nome}
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={estoquePorTamanho[tamanho.id_tamanho] ?? ''}
                            onChange={(e) => handleEstoqueTamanhoChange(tamanho.id_tamanho, e.target.value)}
                            placeholder="Quantidade"
                            disabled={uploading}
                            style={{
                              width: '100%',
                              padding: '5px',
                              borderRadius: '3px',
                              border: '1px solid #ccc'
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <button 
                      type="button"
                      onClick={() => handleEstoqueEncomenda(tamanhosDisponiveis)}
                      style={{marginTop: '10px'}}
                      disabled={uploading}
                      >
                      Adicionar estoque por pedido
                    </button>
                    <small style={{color: '#666', fontSize: '12px', marginTop: '5px', display: 'block'}}>
                      O estoque será definido por encomenda dos usuarios.
                    </small>
                  </div>
                )}

                {/* DESCRIÇÃO DO PRODUTO */}
                <div className="form-group">
                  <label htmlFor="product-description">Descrição:</label>
                  <textarea
                    id="product-description"
                    name="product-description"
                    placeholder="Descreva as características do produto..."
                    value={formProductData.descricao}
                    onChange={(e) => setFormProductData({ ...formProductData, descricao: e.target.value })}
                    required
                    style={{ minWidth: "300px", minHeight: "50px" }}
                  ></textarea>
                </div>

                {/* VALOR DO PRODUTO */}
                <div className="form-group">
                  <label htmlFor="product-price">Valor (R$):</label>
                  <input
                    type="number"
                    id="product-price"
                    name="product-price"
                    min="0.01"
                    step="0.01" 
                    value={formProductData.valor_produto}
                    onChange={(e) => setFormProductData({ ...formProductData, valor_produto: e.target.value })}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="product-image">Imagens:</label>
                  <input
                    type="file"
                    multiple
                    id="product-image"
                    name="product-image"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <small style={{color: '#666', fontSize: '12px'}}>
                    Máximo 5MB. Formatos aceitos: JPEG, PNG, GIF, WebP
                  </small>
                  <div className="image-preview-container" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                    {previews.map((src, index) => (
                      <div key={index} className="image-preview" style={{ position: "relative" }}>
                        <img
                          src={src}
                          alt={`Pré-visualização ${index}`}
                          style={{ maxWidth: "256px", borderRadius: "8px" }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          style={{
                            position: "absolute",
                            padding: "4px 8px",
                            top: 0,
                            right: 0,
                            background: "red",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            cursor: "pointer",
                          }}
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={uploading}
                >
                  {uploading ? "Salvando..." : "Salvar Produto"}
                </button>
              </form>
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              if (adicionandoProdutos) {
                limparFormulario();
              }
              setAdicionandoProdutos(!adicionandoProdutos);
            }}
          >
              {!adicionandoProdutos ? 'Adicionar Produto' : 'Cancelar Adição de produto'}
          </button>
        </li>
        <li>
          {editandoProdutos && (
            <div className="edit-product-form">
              <h2>Editar produto</h2>
              <select
                id="product-select"
                name="product-select"
                value={produtoSelecionadoId}
                onChange={handleProductSelectChange}
                disabled={uploading}
                required
              >
                <option value="">Selecione o produto para edição</option>
                  {ProductsSelectData.map((produto) => (
                    <option key={produto.id_produto} value={produto.id_produto}>
                      {produto.nome_produto}
                    </option>
                  ))}
              </select>
              {produtoSelecionadoId && (
                <form onSubmit = {handleEditSubmit}>
                  <div className="form-group">
                    {/* NOME DO PRODUTO */}
                    <label htmlFor="edit-product-name">Nome do Produto:</label>
                    <input
                      type="text"
                      id="edit-product-name"
                      name="edit-product-name"
                      placeholder={formProductData .nome_produto}
                      value={formProductData .nome_produto}
                      disabled={uploading}
                      onChange={(e) => setFormProductData({ ...formProductData , nome_produto: e.target.value })}
                      required
                    />
                  </div>
                  {/* DESCRIÇÃO DO PRODUTO */}
                  <div className="form-group">
                    <label htmlFor="edit-product-description">Descrição:</label>
                    <textarea
                      id="edit-product-description"
                      name="edit-product-description"
                      placeholder="Descreva as características do produto..."
                      value={formProductData .descricao}
                      onChange={(e) => setFormProductData({ ...formProductData , descricao: e.target.value })}
                      required
                      style={{ minWidth: "300px", minHeight: "50px" }}
                    ></textarea>
                  </div>
                  {/* VALOR DO PRODUTO */}
                  <div className="form-group">
                    <label htmlFor="edit-product-price">Valor (R$):</label>
                    <input
                      type="number"
                      id="edit-product-price"
                      name="edit-product-price"
                      min="0.01"
                      step="0.01"
                      value={formProductData .valor_produto}
                      onChange={(e) => setFormProductData({ ...formProductData , valor_produto: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group"> 
                    <label htmlFor="edit-product-image">Imagens:</label>
                    <input
                      type="file"
                      multiple
                      id="edit-product-image"
                      name="edit-product-image"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <small style={{color: '#666', fontSize: '12px'}}>
                      Máximo 5MB. Formatos aceitos: JPEG, PNG, GIF, WebP
                    </small>
                    <div className="image-preview-container" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                      {previews.map((src, index) => (
                        <div key={index} className="image-preview" style={{ position: "relative" }}>
                          <img
                            src={src}
                            alt={`Pré-visualização ${index}`}
                            style={{ maxWidth: "256px", borderRadius: "8px" }}
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            style={{
                              position: "absolute",
                              padding: "4px 8px",
                              top: 0,
                              right: 0,
                              background: "red",
                              color: "white",
                              border: "none",
                              borderRadius: "50%",
                              cursor: "pointer",
                            }}
                          >X
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={uploading}
                  >
                    {uploading ? "Salvando..." : "Salvar Alterações"} 
                  </button>
                </form>
              )}
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              if (editandoProdutos) {
                limparFormulario();
                setProdutoSelecionadoId(false);
              }
              setEditandoProdutos(!editandoProdutos);
            }}
          >
              {!editandoProdutos ? 'Editar Produto' : 'Cancelar Edição'}
          </button>
        </li>
        <li>
          {removendoProdutos && (
            <div className="delete-product">
              <h2>Excluir Produto</h2>
              <select
                id="product-select"
                name="product-select"
                value={produtoSelecionadoId}
                onChange={handleProductSelectChange}
                disabled={uploading}
                required
              >
                <option value="">Selecione o produto para ser excluido</option>
                  {ProductsSelectData.map((produto) => (
                    <option key={produto.id_produto} value={produto.id_produto}>
                      {produto.nome_produto}
                    </option>
                  ))}
              </select>
              {produtoSelecionadoId && (
              <form className="delete-product-form" onSubmit={handleDeletSubmit}>
                <h2>Deseja excluir o seguinte produto?</h2>
                <ul>
                  <li>
                    {formProductData.nome_produto}
                  </li>
                  <li>
                    R$ {formProductData.valor_produto}
                  </li>
                  <li>
                    {/* {console.log('URLS DE IMAGENS: ', formProductData.urls_imagens)} */}
                    {formProductData && (
                      <img src={`http://localhost:3001${formProductData.urls_imagens[0]}`} 
                      alt={formProductData.nome_produto}
                      style={{
                        maxWidth: '30%',
                        borderRadius: '10px',
                      }} 
                      />
                    )}
                  </li>
                </ul>
                  <button
                    type="submit"
                    disabled={uploading}
                  >
                    {uploading ? "Excluindo..." : "Excluir produto"} 
                  </button>
              </form>
            )}
            </div>
          )}
          <button
            type="button"
            onClick={() => setRemovendoProdutos(!removendoProdutos)}
          >
            {!removendoProdutos ? "Excluir produto" : "Cancelar Exclusão de produto"}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ProductManagement;
