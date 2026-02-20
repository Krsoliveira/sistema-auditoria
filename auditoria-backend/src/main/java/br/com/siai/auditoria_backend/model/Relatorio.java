package br.com.siai.auditoria_backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "Cronograma") // Tabela real no SQL Server
public class Relatorio {

    @Id // Marca este campo como a chave primária! Sem isso, dá o erro "Not a managed type"
    @Column(name = "croId")
    private Integer id;

    @Column(name = "croTexto")
    private String texto;

    @Column(name = "croSituacao")
    private String situacao;

    @Column(name = "croDataInicialP")
    private LocalDateTime dataInicialPrevista;

    // --- GETTERS E SETTERS ---

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }

    public String getSituacao() { return situacao; }
    public void setSituacao(String situacao) { this.situacao = situacao; }

    public LocalDateTime getDataInicialPrevista() { return dataInicialPrevista; }
    public void setDataInicialPrevista(LocalDateTime dataInicialPrevista) { this.dataInicialPrevista = dataInicialPrevista; }
}