package br.com.siai.auditoria_backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "Relatorio") // Ajuste o schema se necessário
public class Relatorio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "relId")
    private Long id;

    // Chave estrangeira que liga ao Cronograma
    @Column(name = "croId")
    private Long croId;

    @Column(name = "relDescricao")
    private String descricao;

    @Column(name = "relNumero")
    private String numero;

    @Column(name = "relGestor")
    private String gestor;

    @Column(name = "relCabecalho1", columnDefinition = "TEXT")
    private String cabecalho1;

    @Column(name = "relCabecalho2", columnDefinition = "TEXT")
    private String cabecalho2;

    @Column(name = "relCabecalho3", columnDefinition = "TEXT")
    private String cabecalho3;

    @Column(name = "relSugestao", columnDefinition = "TEXT")
    private String sugestao;

    @Column(name = "relData")
    private LocalDate data;

    // --- GETTERS E SETTERS ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCroId() { return croId; }
    public void setCroId(Long croId) { this.croId = croId; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }

    public String getGestor() { return gestor; }
    public void setGestor(String gestor) { this.gestor = gestor; }

    public String getCabecalho1() { return cabecalho1; }
    public void setCabecalho1(String cabecalho1) { this.cabecalho1 = cabecalho1; }

    public String getCabecalho2() { return cabecalho2; }
    public void setCabecalho2(String cabecalho2) { this.cabecalho2 = cabecalho2; }

    public String getCabecalho3() { return cabecalho3; }
    public void setCabecalho3(String cabecalho3) { this.cabecalho3 = cabecalho3; }

    public String getSugestao() { return sugestao; }
    public void setSugestao(String sugestao) { this.sugestao = sugestao; }

    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }
}