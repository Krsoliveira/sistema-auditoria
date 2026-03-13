package br.com.siai.auditoria_backend.repository;

import br.com.siai.auditoria_backend.model.BancoHorasExtratoDTO;
import br.com.siai.auditoria_backend.model.BancoHorasResumoDTO;
import br.com.siai.auditoria_backend.model.Colaborador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BancoHorasRepository extends JpaRepository<Colaborador, Integer> {

    // 1. O SALDO GERAL (Para a Tabela Superior)
    @Query(value = """
        WITH Extras AS (
            SELECT colId, SUM(DATEDIFF(MINUTE, '00:00:00', CAST(hoeQuantidade AS TIME))) as totalExtraMin
            FROM Auditoria.HoraExtra GROUP BY colId
        ),
        Compensacoes AS (
            SELECT colId, SUM(DATEDIFF(MINUTE, '00:00:00', CAST(comQuantidade AS TIME))) as totalCompMin
            FROM Auditoria.Compensacao GROUP BY colId
        )
        SELECT 
            cg.carNome AS cargo,
            c.colId AS colaboradorId,
            ISNULL(cmp.totalCompMin, 0) AS compensacoesMinutos,
            ISNULL(e.totalExtraMin, 0) AS horasExtrasMinutos,
            c.colNome AS nome,
            (ISNULL(e.totalExtraMin, 0) - ISNULL(cmp.totalCompMin, 0)) AS saldoMinutos
        FROM Auditoria.Colaborador c
        LEFT JOIN Auditoria.Cargo cg ON c.carId = cg.carId
        LEFT JOIN Extras e ON c.colId = e.colId
        LEFT JOIN Compensacoes cmp ON c.colId = cmp.colId
        WHERE ISNULL(e.totalExtraMin, 0) > 0 OR ISNULL(cmp.totalCompMin, 0) > 0
        ORDER BY c.colNome ASC
    """, nativeQuery = true)
    List<BancoHorasResumoDTO> buscarResumoBancoHoras();

    // 2. O EXTRATO DETALHADO (Para a Tabela Inferior)
    @Query(value = """
        SELECT * FROM (
            SELECT 
                CONVERT(VARCHAR(10), hoeDataInicial, 103) AS dataFormatada,
                hoeDataInicial AS dataReal,
                hoeId AS id,
                DATEDIFF(MINUTE, '00:00:00', CAST(hoeQuantidade AS TIME)) AS minutos,
                hoeObservacao AS observacao,
                CONVERT(VARCHAR(5), CAST(hoeQuantidade AS TIME), 108) AS quantidade,
                'CREDITO' AS tipo
            FROM Auditoria.HoraExtra
            WHERE colId = :colId
            
            UNION ALL
            
            SELECT 
                CONVERT(VARCHAR(10), comDataInicial, 103) AS dataFormatada,
                comDataInicial AS dataReal,
                comId AS id,
                DATEDIFF(MINUTE, '00:00:00', CAST(comQuantidade AS TIME)) AS minutos,
                comObservacao AS observacao,
                CONVERT(VARCHAR(5), CAST(comQuantidade AS TIME), 108) AS quantidade,
                'DEBITO' AS tipo
            FROM Auditoria.Compensacao
            WHERE colId = :colId
        ) AS Extrato
        ORDER BY dataReal DESC
    """, nativeQuery = true)
    List<BancoHorasExtratoDTO> buscarExtratoPorColaborador(@Param("colId") Integer colId);
}