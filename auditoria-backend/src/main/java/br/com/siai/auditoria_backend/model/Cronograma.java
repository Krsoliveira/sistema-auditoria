package br.com.siai.auditoria_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Cronograma") // Se precisar de schema: @Table(name = "Cronograma", schema = "Auditoria")
public class Cronograma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "croId")
    private Long id;

    @Column(name = "croTexto")
    private String texto;

    @Column(name = "croAno")
    private Integer ano;

    // TODO: Adicione aqui outros campos da tabela Cronograma que você precisar no futuro

    // --- GETTERS E SETTERS ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }

    public Integer getAno() { return ano; }
    public void setAno(Integer ano) { this.ano = ano; }
}