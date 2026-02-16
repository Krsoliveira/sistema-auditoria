package br.com.siai.auditoria_backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "tb_atividades")
public class Atividade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long item; // ID da atividade

    private String atividade;

    @Column(columnDefinition = "VARCHAR(MAX)")
    private String testes;

    @Column(columnDefinition = "VARCHAR(MAX)")
    private String extensao;

    @Column(columnDefinition = "VARCHAR(MAX)")
    private String amostragem;

    private LocalDate dtInicial;
    private LocalDate dtFinal;
    private String realizadoPor;
    private String situacao;
    private String classificacao;
    private String pendencia;

    @Column(columnDefinition = "VARCHAR(MAX)")
    private String anotacao;

    // --- Campos do Modal Novo ---
    @Column(columnDefinition = "VARCHAR(MAX)")
    private String naoConformidade;
    private String reincidente;
    private String recomendacao;
    private LocalDate prazoSolucao;
    private Boolean marcarPendencia;

    @Column(columnDefinition = "VARCHAR(MAX)")
    private String anotacaoGeral;

    // --- GETTERS E SETTERS ---
    public Long getItem() { return item; }
    public void setItem(Long item) { this.item = item; }

    public String getAtividade() { return atividade; }
    public void setAtividade(String atividade) { this.atividade = atividade; }

    public String getTestes() { return testes; }
    public void setTestes(String testes) { this.testes = testes; }

    public String getExtensao() { return extensao; }
    public void setExtensao(String extensao) { this.extensao = extensao; }

    public String getAmostragem() { return amostragem; }
    public void setAmostragem(String amostragem) { this.amostragem = amostragem; }

    public LocalDate getDtInicial() { return dtInicial; }
    public void setDtInicial(LocalDate dtInicial) { this.dtInicial = dtInicial; }

    public LocalDate getDtFinal() { return dtFinal; }
    public void setDtFinal(LocalDate dtFinal) { this.dtFinal = dtFinal; }

    public String getRealizadoPor() { return realizadoPor; }
    public void setRealizadoPor(String realizadoPor) { this.realizadoPor = realizadoPor; }

    public String getSituacao() { return situacao; }
    public void setSituacao(String situacao) { this.situacao = situacao; }

    public String getClassificacao() { return classificacao; }
    public void setClassificacao(String classificacao) { this.classificacao = classificacao; }

    public String getPendencia() { return pendencia; }
    public void setPendencia(String pendencia) { this.pendencia = pendencia; }

    public String getAnotacao() { return anotacao; }
    public void setAnotacao(String anotacao) { this.anotacao = anotacao; }

    public String getNaoConformidade() { return naoConformidade; }
    public void setNaoConformidade(String naoConformidade) { this.naoConformidade = naoConformidade; }

    public String getReincidente() { return reincidente; }
    public void setReincidente(String reincidente) { this.reincidente = reincidente; }

    public String getRecomendacao() { return recomendacao; }
    public void setRecomendacao(String recomendacao) { this.recomendacao = recomendacao; }

    public LocalDate getPrazoSolucao() { return prazoSolucao; }
    public void setPrazoSolucao(LocalDate prazoSolucao) { this.prazoSolucao = prazoSolucao; }

    public Boolean getMarcarPendencia() { return marcarPendencia; }
    public void setMarcarPendencia(Boolean marcarPendencia) { this.marcarPendencia = marcarPendencia; }

    public String getAnotacaoGeral() { return anotacaoGeral; }
    public void setAnotacaoGeral(String anotacaoGeral) { this.anotacaoGeral = anotacaoGeral; }
}