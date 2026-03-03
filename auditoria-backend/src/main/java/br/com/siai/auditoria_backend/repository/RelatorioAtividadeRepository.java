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
            ra.reaItem AS item,
            ra.atvDescricaoPTA AS atividade,
            CONVERT(VARCHAR(10), ra.reaDataInicial, 103) AS dataInicial,
            CONVERT(VARCHAR(10), ra.reaDataFinal, 103) AS dataFinal,
            ra.reaUsuarioAlteracao AS realizadoPor,
            ra.reaFlag AS situacao,
            ra.reaClassificacao AS classificacao,
            ra.reaPendencia AS pendencia,
            ra.reaTeste AS teste,
            ra.reaExtensao AS extensao,
            ra.reaCriterio AS criterio,
            ra.reaObservacao AS observacao,
            ra.reaNaoConformidade AS naoConformidade,
            ra.reaReincidente AS reincidente,
            ra.reaRecomendacao AS recomendacao
        FROM Auditoria.RelatorioAtividade ra
        JOIN Auditoria.Relatorio r ON ra.relId = r.relId
        WHERE r.croId = :croId
        ORDER BY ra.reaItem ASC
    """, nativeQuery = true)
    List<AtividadeDTO> buscarAtividadesPorCronograma(@Param("croId") Integer croId);
}