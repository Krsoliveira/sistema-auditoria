package br.com.siai.auditoria_backend.model;

public interface AnotacaoDTO {
    String getDataHora();
    Integer getId();
    Integer getIgnorarProximo();
    String getObsAuditor();
    String getObsRevisor();
    String getStatus();
    String getUsuario();
    Integer getVersao();
}