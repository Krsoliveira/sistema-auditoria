package br.com.siai.auditoria_backend.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class RelatorioLegadoRepository {

    private final JdbcTemplate jdbcTemplate;

    public RelatorioLegadoRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // 1. Busca os bytes do arquivo para download/visualização (pelo arrId)
    public String buscarHexadecimalDoRelatorio(Long idArquivo) {
        String sql = "SELECT arrArquivo FROM [Auditoria].[Auditoria].[ArquivoRelatorio] WHERE arrId = ?";
        try {
            return jdbcTemplate.queryForObject(sql, String.class, idArquivo);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao buscar arquivo: " + e.getMessage());
        }
    }

    // 2. NOVO: Faz o JOIN para descobrir se o relatório da tela possui anexo
    public Long buscarIdArquivoPorRelatorio(Long croIdDaTela) {
        // O React manda o croId (ex: 63008), cruzamos pelo relId e pegamos o arrId do arquivo
        String sql =
                "SELECT TOP 1 ar.arrId " +
                        "FROM [Auditoria].[Auditoria].[ArquivoRelatorio] ar " +
                        "INNER JOIN [Auditoria].[Auditoria].[Relatorio] r " +
                        "  ON ar.relId = r.relId " +
                        "WHERE r.croId = ? " +
                        "  AND ar.arrArquivo IS NOT NULL " +
                        "ORDER BY ar.arrId DESC";

        try {
            return jdbcTemplate.queryForObject(sql, Long.class, croIdDaTela);
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            return null; // Retorna nulo se não encontrar nada
        } catch (Exception e) {
            System.err.println("Erro ao procurar o anexo com JOIN: " + e.getMessage());
            return null;
        }
    }
}