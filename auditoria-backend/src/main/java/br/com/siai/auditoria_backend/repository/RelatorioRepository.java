package br.com.siai.auditoria_backend.repository;

import br.com.siai.auditoria_backend.model.Relatorio;
import br.com.siai.auditoria_backend.model.DashboardDTO;
import br.com.siai.auditoria_backend.model.CabecalhoDTO;
import br.com.siai.auditoria_backend.model.ColaboradorSimpleDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RelatorioRepository extends JpaRepository<Relatorio, Integer> {

    // 🔴 DASHBOARD: Busca paginada por ano
    @Query(value = """
        SELECT 
            CONVERT(VARCHAR(19), c.croDataFinalP, 126) AS dataFinalPrevista,
            CONVERT(VARCHAR(19), c.croDataFinalR, 126) AS dataFinalRealizada,
            CONVERT(VARCHAR(19), c.croDataInicialP, 126) AS dataInicialPrevista,
            CONVERT(VARCHAR(19), c.croDataInicialR, 126) AS dataInicialRealizada,
            r.relDescricao AS descricaoRelatorio,
            zg.gruDescricao AS grupoDescricao,
            c.croId AS id,
            r.relNumero AS numeroRelatorio,
            c.croSituacao AS situacao,
            c.croTexto AS texto,
            c.croTipoTrabalho AS tipoTrabalho
        FROM Cronograma c 
        LEFT JOIN Relatorio r ON c.croId = r.croId 
        LEFT JOIN UnidadeGrupo ug ON c.uniId = ug.uniId 
        LEFT JOIN zaudGrupo zg ON ug.gruId = zg.gruId 
        WHERE YEAR(c.croDataInicialP) = :ano 
          AND r.relNumero IS NOT NULL 
          AND r.relNumero <> ''
        ORDER BY c.croId DESC
    """,
            countQuery = """
        SELECT count(*) 
        FROM Cronograma c 
        LEFT JOIN Relatorio r ON c.croId = r.croId 
        LEFT JOIN UnidadeGrupo ug ON c.uniId = ug.uniId 
        LEFT JOIN zaudGrupo zg ON ug.gruId = zg.gruId 
        WHERE YEAR(c.croDataInicialP) = :ano
          AND r.relNumero IS NOT NULL 
          AND r.relNumero <> ''
    """,
            nativeQuery = true)
    Page<DashboardDTO> buscarPorAno(@Param("ano") Integer ano, Pageable pageable);

    // 🔴 DASHBOARD: Busca paginada de todos os anos
    @Query(value = """
        SELECT 
            CONVERT(VARCHAR(19), c.croDataFinalP, 126) AS dataFinalPrevista,
            CONVERT(VARCHAR(19), c.croDataFinalR, 126) AS dataFinalRealizada,
            CONVERT(VARCHAR(19), c.croDataInicialP, 126) AS dataInicialPrevista,
            CONVERT(VARCHAR(19), c.croDataInicialR, 126) AS dataInicialRealizada,
            r.relDescricao AS descricaoRelatorio,
            zg.gruDescricao AS grupoDescricao,
            c.croId AS id,
            r.relNumero AS numeroRelatorio,
            c.croSituacao AS situacao,
            c.croTexto AS texto,
            c.croTipoTrabalho AS tipoTrabalho
        FROM Cronograma c 
        LEFT JOIN Relatorio r ON c.croId = r.croId 
        LEFT JOIN UnidadeGrupo ug ON c.uniId = ug.uniId 
        LEFT JOIN zaudGrupo zg ON ug.gruId = zg.gruId 
        WHERE r.relNumero IS NOT NULL 
          AND r.relNumero <> ''
        ORDER BY c.croId DESC
    """,
            countQuery = """
        SELECT count(*) 
        FROM Cronograma c 
        LEFT JOIN Relatorio r ON c.croId = r.croId 
        LEFT JOIN UnidadeGrupo ug ON c.uniId = ug.uniId 
        LEFT JOIN zaudGrupo zg ON ug.gruId = zg.gruId 
        WHERE r.relNumero IS NOT NULL 
          AND r.relNumero <> ''
    """,
            nativeQuery = true)
    Page<DashboardDTO> buscarTodos(Pageable pageable);

    // 🔴 NOVA BUSCA COMBINADA: Procura o termo SOMENTE dentro de um ano específico!
    @Query(value = """
        SELECT 
            CONVERT(VARCHAR(19), c.croDataFinalP, 126) AS dataFinalPrevista,
            CONVERT(VARCHAR(19), c.croDataFinalR, 126) AS dataFinalRealizada,
            CONVERT(VARCHAR(19), c.croDataInicialP, 126) AS dataInicialPrevista,
            CONVERT(VARCHAR(19), c.croDataInicialR, 126) AS dataInicialRealizada,
            r.relDescricao AS descricaoRelatorio,
            zg.gruDescricao AS grupoDescricao,
            c.croId AS id,
            r.relNumero AS numeroRelatorio,
            c.croSituacao AS situacao,
            c.croTexto AS texto,
            c.croTipoTrabalho AS tipoTrabalho
        FROM Cronograma c 
        LEFT JOIN Relatorio r ON c.croId = r.croId 
        LEFT JOIN UnidadeGrupo ug ON c.uniId = ug.uniId 
        LEFT JOIN zaudGrupo zg ON ug.gruId = zg.gruId 
        WHERE YEAR(c.croDataInicialP) = :ano 
          AND r.relNumero IS NOT NULL AND r.relNumero <> ''
          AND (r.relNumero LIKE '%' + :termo + '%' OR r.relDescricao LIKE '%' + :termo + '%' OR zg.gruDescricao LIKE '%' + :termo + '%')
        ORDER BY c.croId DESC
    """,
            countQuery = """
        SELECT count(*) 
        FROM Cronograma c 
        LEFT JOIN Relatorio r ON c.croId = r.croId 
        LEFT JOIN UnidadeGrupo ug ON c.uniId = ug.uniId 
        LEFT JOIN zaudGrupo zg ON ug.gruId = zg.gruId 
        WHERE YEAR(c.croDataInicialP) = :ano 
          AND r.relNumero IS NOT NULL AND r.relNumero <> ''
          AND (r.relNumero LIKE '%' + :termo + '%' OR r.relDescricao LIKE '%' + :termo + '%' OR zg.gruDescricao LIKE '%' + :termo + '%')
    """, nativeQuery = true)
    Page<DashboardDTO> buscarPorAnoETermo(@Param("ano") Integer ano, @Param("termo") String termo, Pageable pageable);

    // 🔴 NOVA BUSCA GLOBAL: Procura o termo em todo o histórico do banco de dados!
    @Query(value = """
        SELECT 
            CONVERT(VARCHAR(19), c.croDataFinalP, 126) AS dataFinalPrevista,
            CONVERT(VARCHAR(19), c.croDataFinalR, 126) AS dataFinalRealizada,
            CONVERT(VARCHAR(19), c.croDataInicialP, 126) AS dataInicialPrevista,
            CONVERT(VARCHAR(19), c.croDataInicialR, 126) AS dataInicialRealizada,
            r.relDescricao AS descricaoRelatorio,
            zg.gruDescricao AS grupoDescricao,
            c.croId AS id,
            r.relNumero AS numeroRelatorio,
            c.croSituacao AS situacao,
            c.croTexto AS texto,
            c.croTipoTrabalho AS tipoTrabalho
        FROM Cronograma c 
        LEFT JOIN Relatorio r ON c.croId = r.croId 
        LEFT JOIN UnidadeGrupo ug ON c.uniId = ug.uniId 
        LEFT JOIN zaudGrupo zg ON ug.gruId = zg.gruId 
        WHERE r.relNumero IS NOT NULL AND r.relNumero <> ''
          AND (r.relNumero LIKE '%' + :termo + '%' OR r.relDescricao LIKE '%' + :termo + '%' OR zg.gruDescricao LIKE '%' + :termo + '%')
        ORDER BY c.croId DESC
    """,
            countQuery = """
        SELECT count(*) 
        FROM Cronograma c 
        LEFT JOIN Relatorio r ON c.croId = r.croId 
        LEFT JOIN UnidadeGrupo ug ON c.uniId = ug.uniId 
        LEFT JOIN zaudGrupo zg ON ug.gruId = zg.gruId 
        WHERE r.relNumero IS NOT NULL AND r.relNumero <> ''
          AND (r.relNumero LIKE '%' + :termo + '%' OR r.relDescricao LIKE '%' + :termo + '%' OR zg.gruDescricao LIKE '%' + :termo + '%')
    """, nativeQuery = true)
    Page<DashboardDTO> buscarPorTermo(@Param("termo") String termo, Pageable pageable);


    // CABEÇALHO: Intacto
    @Query(value = """
        SELECT TOP 1
            r.relCabecalho1 AS cabecalho1,
            r.relCabecalho2 AS cabecalho2,
            r.relCabecalho3 AS cabecalho3,
            r.relGestor AS gestor,
            zg.gruDescricao AS grupo,
            r.relNumero AS numero, 
            r.relDescricao AS relatorio, 
            c.croSituacao AS situacao,
            r.relSugestao AS sugestao
        FROM Auditoria.Relatorio r
        JOIN Cronograma c ON r.croId = c.croId
        LEFT JOIN UnidadeGrupo ug ON c.uniId = ug.uniId
        LEFT JOIN zaudGrupo zg ON ug.gruId = zg.gruId
        WHERE c.croId = :croId
    """, nativeQuery = true)
    CabecalhoDTO buscarCabecalho(@Param("croId") Integer croId);

    @Query(value = "SELECT DISTINCT YEAR(croDataInicialP) FROM Cronograma WHERE croDataInicialP IS NOT NULL ORDER BY YEAR(croDataInicialP) DESC", nativeQuery = true)
    List<Integer> buscarAnosDisponiveis();

    // COLABORADORES DO RELATÓRIO: busca todos os auditores de um relatório via zaudRelatorioColaborador
    @Query(value = """
        SELECT c.colNome AS colNome, c.colCodigo AS colCodigo
        FROM zaudRelatorioColaborador zrc
        JOIN Colaborador c ON zrc.colId = c.colId
        JOIN Relatorio r ON zrc.relId = r.relId
        WHERE r.croId = :croId
    """, nativeQuery = true)
    List<ColaboradorSimpleDTO> buscarColaboradoresPorCroId(@Param("croId") Integer croId);
}