package br.com.siai.auditoria_backend.repository;

import br.com.siai.auditoria_backend.model.AtividadeDTO;
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
}