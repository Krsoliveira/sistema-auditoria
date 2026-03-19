package br.com.siai.auditoria_backend.repository;

import br.com.siai.auditoria_backend.model.AtividadeDTO;
import br.com.siai.auditoria_backend.model.HistoricoAtividadeDTO;
import br.com.siai.auditoria_backend.model.RelatorioAtividade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RelatorioAtividadeRepository extends JpaRepository<RelatorioAtividade, Integer> {

    @Query(value = """
        SELECT
            RA.[reaId] AS reaId,
            RA.[atvId] AS atvId,
            RA.[reaItem] AS item,
            RA.[atvDescricaoPTA] AS atividade,
            RA.[reaDataInicial] AS dataInicial,
            RA.[reaDataFinal] AS dataFinal,
            C.[colNome] AS realizadoPor,
            C.[colCodigo] AS colCodigo,
            C2.[colNome] AS realizadoPor2,
            C2.[colCodigo] AS colCodigo2,
            RA.[reaFlag] AS situacao,
            RA.[reaClassificacao] AS classificacao,
            RA.[reaPendencia] AS pendencia,
            RA.[reaTeste] AS teste,
            RA.[reaExtensao] AS extensao,
            RA.[reaCriterio] AS criterio,
            RA.[reaObservacao] AS observacao,
            RA.[reaNaoConformidade] AS naoConformidade,
            RA.[reaReincidente] AS reincidente,
            RA.[reaRecomendacao] AS recomendacao
        FROM [Auditoria].[Auditoria].[RelatorioAtividade] RA
        LEFT JOIN [Auditoria].[Auditoria].[Colaborador] C ON C.[colId] = RA.[colId]
        LEFT JOIN [Auditoria].[Auditoria].[Colaborador] C2 ON C2.[colId] = RA.[reaUsuarioAlteracaoId]
            AND RA.[reaUsuarioAlteracaoId] <> RA.[colId]
        INNER JOIN [Auditoria].[Auditoria].[Relatorio] R ON R.[relId] = RA.[relId]
        WHERE R.[croId] = :croId
        ORDER BY RA.[reaItem] ASC
        """, nativeQuery = true)
    List<AtividadeDTO> buscarAtividadesPorCronograma(@Param("croId") Integer croId);

    // HISTÓRICO: últimas 2 ocorrências da mesma atividade na mesma unidade (excluindo relatório atual)
    @Query(value = """
        SELECT TOP 2
            c2.croId AS croId,
            r2.relNumero AS numero,
            CONVERT(VARCHAR(10), ra2.reaDataFinal, 103) AS dataFinal,
            ra2.reaFlag AS situacao,
            ra2.reaClassificacao AS classificacao,
            ra2.reaObservacao AS observacao,
            ra2.reaNaoConformidade AS naoConformidade,
            ra2.reaRecomendacao AS recomendacao,
            col.colNome AS realizadoPor,
            col.colCodigo AS colCodigo
        FROM [Auditoria].[Auditoria].[RelatorioAtividade] ra2
        JOIN [Auditoria].[Auditoria].[Relatorio] r2 ON ra2.relId = r2.relId
        JOIN [Auditoria].[Auditoria].[Cronograma] c2 ON r2.croId = c2.croId
        LEFT JOIN [Auditoria].[Auditoria].[Colaborador] col ON ra2.colId = col.colId
        WHERE ra2.atvId = :atvId
          AND c2.uniId = (SELECT uniId FROM [Auditoria].[Auditoria].[Cronograma] WHERE croId = :croId)
          AND c2.croId < :croId
        ORDER BY c2.croId DESC
    """, nativeQuery = true)
    List<HistoricoAtividadeDTO> buscarHistoricoAtividade(@Param("atvId") Integer atvId, @Param("croId") Integer croId);
}