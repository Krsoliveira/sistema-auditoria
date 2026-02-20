package br.com.siai.auditoria_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Colaborador") // Se der erro de tabela não encontrada depois, pode ser necessário adicionar o schema, ex: schema = "Auditoria"
public class Colaborador {

    @Id
    @Column(name = "colCodigo")
    private String colCodigo; // Matrícula

    @Column(name = "colNome")
    private String colNome;

    @Column(name = "colSenha")
    private String colSenha;

    @Column(name = "colAcessoAoSistema")
    private Integer colAcessoAoSistema; // 0 = Bloqueado, 1 = Liberado

    // --- GETTERS E SETTERS MANUAIS ---

    public String getColCodigo() { return colCodigo; }
    public void setColCodigo(String colCodigo) { this.colCodigo = colCodigo; }

    public String getColNome() { return colNome; }
    public void setColNome(String colNome) { this.colNome = colNome; }

    public String getColSenha() { return colSenha; }
    public void setColSenha(String colSenha) { this.colSenha = colSenha; }

    public Integer getColAcessoAoSistema() { return colAcessoAoSistema; }
    public void setColAcessoAoSistema(Integer colAcessoAoSistema) { this.colAcessoAoSistema = colAcessoAoSistema; }
}