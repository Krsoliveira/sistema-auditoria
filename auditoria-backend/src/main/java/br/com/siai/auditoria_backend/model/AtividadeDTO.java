package br.com.siai.auditoria_backend.model;

public interface AtividadeDTO {
    Integer getReaId();
    Integer getItem();
    String getAtividade();
    String getDataInicial();
    String getDataFinal();
    String getRealizadoPor();
    String getSituacao();
    String getClassificacao();
    Integer getPendencia();

    // Textos HTML do Modal
    String getTeste();
    String getExtensao();
    String getCriterio();
    String getObservacao();
    String getNaoConformidade();
    String getReincidente();
    String getRecomendacao();
}