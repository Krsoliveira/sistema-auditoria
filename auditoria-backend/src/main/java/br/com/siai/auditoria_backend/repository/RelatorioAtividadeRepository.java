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
        ra.atvDescricaoPTA AS atividade,
        ra.reaClassificacao AS classificacao,
        ra.reaCriterio AS criterio,
        CONVERT(VARCHAR(10), ra.reaDataFinal, 103) AS dataFinal,
        CONVERT(VARCHAR(10), ra.reaDataInicial, 103) AS dataInicial,
        ra.reaExtensao AS extensao,
        ra.reaItem AS item,
        ra.reaNaoConformidade AS naoConformidade,
        ra.reaObservacao AS observacao,
        ra.reaPendencia AS pendencia,
        ra.reaId AS reaId,  -- 🔴 AQUI ESTÁ A NOSSA PONTE!
        ra.reaUsuarioAlteracao AS realizadoPor,
        ra.reaRecomendacao AS recomendacao,
        ra.reaReincidente AS reincidente,
        ra.reaFlag AS situacao,
        ra.reaTeste AS teste
    FROM Auditoria.RelatorioAtividade ra
    JOIN Auditoria.Relatorio r ON ra.relId = r.relId
    WHERE r.croId = :croId
    ORDER BY ra.reaItem ASC
""", nativeQuery = true)
    List<AtividadeDTO> buscarAtividadesPorCronograma(@Param("croId") Integer croId);
}