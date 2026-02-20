package br.com.siai.auditoria_backend.repository;

import br.com.siai.auditoria_backend.model.Relatorio;
import br.com.siai.auditoria_backend.model.DashboardDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RelatorioRepository extends JpaRepository<Relatorio, Integer> {

    // 1. CONSULTA NORMAL: Busca filtrando por um ano específico
    @Query(value = "SELECT c.croId AS id, " +
            "c.croTexto AS texto, " +
            "c.croSituacao AS situacao, " +
            "c.croTipoTrabalho AS tipoTrabalho, " +
            "CONVERT(VARCHAR(19), c.croDataInicialP, 126) AS dataInicialPrevista, " +
            "CONVERT(VARCHAR(19), c.croDataFinalP, 126) AS dataFinalPrevista, " +
            "CONVERT(VARCHAR(19), c.croDataInicialR, 126) AS dataInicialRealizada, " +
            "CONVERT(VARCHAR(19), c.croDataFinalR, 126) AS dataFinalRealizada, " +
            "r.relNumero AS numeroRelatorio, " +
            "r.relDescricao AS descricaoRelatorio, " +
            "zg.gruDescricao AS grupoDescricao " +
            "FROM Cronograma c " +
            "LEFT JOIN Relatorio r ON c.croId = r.croId " +
            "LEFT JOIN UnidadeGrupo ug ON c.uniId = ug.uniId " +
            "LEFT JOIN zaudGrupo zg ON ug.gruId = zg.gruId " +
            "WHERE YEAR(c.croDataInicialP) = :ano", nativeQuery = true)
    List<DashboardDTO> buscarPorAno(@Param("ano") Integer ano);

    // 2. NOVA CONSULTA: Busca ABSOLUTAMENTE TUDO (Histórico completo)
    @Query(value = "SELECT c.croId AS id, " +
            "c.croTexto AS texto, " +
            "c.croSituacao AS situacao, " +
            "c.croTipoTrabalho AS tipoTrabalho, " +
            "CONVERT(VARCHAR(19), c.croDataInicialP, 126) AS dataInicialPrevista, " +
            "CONVERT(VARCHAR(19), c.croDataFinalP, 126) AS dataFinalPrevista, " +
            "CONVERT(VARCHAR(19), c.croDataInicialR, 126) AS dataInicialRealizada, " +
            "CONVERT(VARCHAR(19), c.croDataFinalR, 126) AS dataFinalRealizada, " +
            "r.relNumero AS numeroRelatorio, " +
            "r.relDescricao AS descricaoRelatorio, " +
            "zg.gruDescricao AS grupoDescricao " +
            "FROM Cronograma c " +
            "LEFT JOIN Relatorio r ON c.croId = r.croId " +
            "LEFT JOIN UnidadeGrupo ug ON c.uniId = ug.uniId " +
            "LEFT JOIN zaudGrupo zg ON ug.gruId = zg.gruId", nativeQuery = true)
    List<DashboardDTO> buscarTodos();

    // 3. CONSULTA DE ANOS: Para preencher o dropdown
    @Query(value = "SELECT DISTINCT YEAR(croDataInicialP) FROM Cronograma WHERE croDataInicialP IS NOT NULL ORDER BY YEAR(croDataInicialP) DESC", nativeQuery = true)
    List<Integer> buscarAnosDisponiveis();
}