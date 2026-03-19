package br.com.siai.auditoria_backend.model;

public interface HistoricoRelatorioDTO {
    Integer getCroId();
    String getNumero();
    String getDescricao();
    String getDataInicial();
    String getDataFinal();
    String getSituacao();
}
