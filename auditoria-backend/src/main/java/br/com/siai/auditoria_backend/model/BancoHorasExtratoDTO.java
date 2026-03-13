package br.com.siai.auditoria_backend.model;

public interface BancoHorasExtratoDTO {
    String getDataFormatada();
    Integer getId();
    Integer getMinutos();
    String getObservacao();
    String getQuantidade();
    String getTipo(); // 'CREDITO' ou 'DEBITO'
}