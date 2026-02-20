package br.com.siai.auditoria_backend.model;

public interface DashboardDTO {
    Integer getId();
    String getTexto();
    String getSituacao();

    // DATAS PLANEJADAS
    String getDataInicialPrevista();
    String getDataFinalPrevista();

    // DATAS REAIS
    String getDataInicialRealizada();
    String getDataFinalRealizada();

    String getNumeroRelatorio();
    String getDescricaoRelatorio();

    // --- NOVOS CAMPOS ADICIONADOS ---
    String getTipoTrabalho();     // Vem de croTipoTrabalho
    String getGrupoDescricao();   // Vem de zaudGrupo (gruDescricao)
}