package br.com.siai.auditoria_backend.model;

public interface HistoricoAtividadeDTO {
    Integer getCroId();
    String getNumero();
    String getDataFinal();
    String getSituacao();
    String getClassificacao();
    String getObservacao();
    String getNaoConformidade();
    String getRecomendacao();
    String getRealizadoPor();
    String getColCodigo();
}
