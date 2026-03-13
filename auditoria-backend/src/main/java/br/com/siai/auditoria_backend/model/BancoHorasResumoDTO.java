package br.com.siai.auditoria_backend.model;

public interface BancoHorasResumoDTO {
    String getCargo();
    Integer getColaboradorId();
    Integer getCompensacoesMinutos(); // Débito total
    Integer getHorasExtrasMinutos();  // Crédito total
    String getNome();
    Integer getSaldoMinutos();        // Crédito - Débito
}