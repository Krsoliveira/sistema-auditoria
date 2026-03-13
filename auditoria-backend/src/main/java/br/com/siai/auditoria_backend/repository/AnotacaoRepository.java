package br.com.siai.auditoria_backend.repository;

import br.com.siai.auditoria_backend.model.AnotacaoDTO;
import br.com.siai.auditoria_backend.model.RelatorioAtividadeAnotacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnotacaoRepository extends JpaRepository<RelatorioAtividadeAnotacao, Integer> {

    // A ordem estritamente alfabética evita que o Hibernate baralhe os dados!
    @Query(value = """
        SELECT 
            CONVERT(VARCHAR(10), antObsData, 103) + ' ' + CONVERT(VARCHAR(8), antObsTime, 108) AS dataHora,
            antId AS id,
            ISNULL(antLeituraNaoObrigatoria, 0) AS ignorarProximo,
            antObsAuditor AS obsAuditor,
            antObsRevisor AS obsRevisor,
            antObsSituacao AS status,
            antObsUsuario AS usuario,
            antItem AS versao
        FROM Auditoria.RelatorioAtividadeAnotacao
        WHERE reaId = :reaId
        ORDER BY antItem ASC
    """, nativeQuery = true)
    List<AnotacaoDTO> buscarHistoricoPorAtividade(@Param("reaId") Integer reaId);
}