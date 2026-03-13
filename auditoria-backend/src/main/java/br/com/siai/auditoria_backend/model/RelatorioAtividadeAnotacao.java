package br.com.siai.auditoria_backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(schema = "Auditoria", name = "RelatorioAtividadeAnotacao")
public class RelatorioAtividadeAnotacao {

    @Id
    private Integer antId;

    private Integer reaId;

    public RelatorioAtividadeAnotacao() {}

    public Integer getAntId() { return antId; }
    public void setAntId(Integer antId) { this.antId = antId; }

    public Integer getReaId() { return reaId; }
    public void setReaId(Integer reaId) { this.reaId = reaId; }
}