package br.com.siai.auditoria_backend.model;

public interface AtividadeDTO {
    Integer getReaId();
    Integer getAtvId();
    Integer getItem();
    String getAtividade();
    String getDataInicial();
    String getDataFinal();
    String getRealizadoPor(); // O Spring vai procurar por 'realizadoPor' no SQL
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
    String getColCodigo();   // Matrícula do colaborador principal (chave para foto)
    String getRealizadoPor2();  // Segundo colaborador (quem executou/fechou), se diferente
    String getColCodigo2();     // Matrícula do segundo colaborador
}