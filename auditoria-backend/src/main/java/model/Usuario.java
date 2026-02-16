package br.com.siai.auditoria_backend.model;

import jakarta.persistence.*;

@Entity
// Aqui definimos o Schema e a Tabela exatos do seu SQL Server
@Table(name = "audMngt_usuarios", schema = "Auditoria")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // No banco a coluna é "matricula" (tudo minúsculo), então não precisa de @Column
    private String matricula;

    @Column(name = "nome_completo") // No banco tem underline
    private String nomeCompleto;

    private String email;

    @Column(name = "hash_senha") // No banco tem underline
    private String hashSenha;

    // --- GETTERS E SETTERS ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMatricula() {
        return matricula;
    }

    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }

    public String getNomeCompleto() {
        return nomeCompleto;
    }

    public void setNomeCompleto(String nomeCompleto) {
        this.nomeCompleto = nomeCompleto;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getHashSenha() {
        return hashSenha;
    }

    public void setHashSenha(String hashSenha) {
        this.hashSenha = hashSenha;
    }
}