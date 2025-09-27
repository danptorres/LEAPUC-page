class SanitizadorDados {

    constructor(usuario) {
        this.usuario = usuario;
        this.erros = [];
    }

    // Limpa e valida CPF
    validarCPF() {
        const cpfLimpo = this.usuario.cpf.replace(/\D/g,'');
        if (!/^\d{11}$/.test(cpfLimpo)) {
            this.erros.push("O CPF deve conter 11 dígitos numéricos.");
        }
        this.usuario.cpf = cpfLimpo;
    }

    // Limpa e valida telefone
    validarTelefone() {
        if (!this.usuario.telefone) return; // telefone pode ser opcional
        const telefoneLimpo = this.usuario.telefone.replace(/\D/g,'');
        if (!/^\d{10,11}$/.test(telefoneLimpo)) {
            this.erros.push("O telefone deve conter 10 ou 11 dígitos numéricos.");
        }
        this.usuario.telefone = telefoneLimpo;
    }

    // Valida e-mail
    validarEmail() {
        if (!this.usuario.email.includes("@") || !this.usuario.email.includes(".")) {
            this.erros.push("Digite um email válido.");
        }
        this.usuario.email = this.usuario.email.trim().toLowerCase();
    }

    // Valida outros campos, como nome e curso
    validarCamposObrigatorios() {
        if (!this.usuario.nome || this.usuario.nome.trim() === '') {
            this.erros.push("O nome não pode estar vazio.");
        }
        // if (!this.usuario.curso || this.usuario.curso.trim() === '') {
        //     this.erros.push("Selecione um curso válido.");
        // }
    }

    // Função principal para validar todos os dados
    validarDadosUsuario() {
        this.erros = []; // reseta erros
        this.validarCPF();
        this.validarTelefone();
        this.validarEmail();
        this.validarCamposObrigatorios();
        return this.erros;
    }

    // Retorna os dados sanitizados prontos para envio
    sanitizarDadosUsuario() {
        return {
            nome_usuario: this.usuario.nome.trim(),
            cpf: this.usuario.cpf,
            telefone: this.usuario.telefone,
            data_nascimento: this.usuario.data_nascimento,
            endereco: this.usuario.endereco,
            curso: this.usuario.curso.trim(),
            email: this.usuario.email,
            senha: this.usuario.senha,
            receberEmails: this.usuario.receberEmails
        };
    }
}

export default SanitizadorDados;