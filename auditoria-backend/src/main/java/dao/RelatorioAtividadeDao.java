package br.com.siai.dao;

import br.com.siai.model.RelatorioAtividade;
import br.com.siai.util.Conexao;
import br.com.siai.util.Rotinas;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class RelatorioAtividadeDao {

    private Connection conexao;
    private final Rotinas r = new Rotinas();

    public RelatorioAtividadeDao() {
        this.conexao = Conexao.getConexao(true);
        if (this.conexao == null) {
            System.err.println("🚨 CRÍTICO: DAO sem conexão!");
        }
    }

    public void fechar() {
        try {
            if (this.conexao != null && !this.conexao.isClosed()) {
                this.conexao.close();
            }
        } catch (SQLException ex) {
            System.err.println("Erro ao fechar: " + ex.getMessage());
        }
    }

    // ==================================================================================
    // 1. CONSULTAR (GET)
    // ==================================================================================
    public RelatorioAtividade consultar(int reaId) {
        RelatorioAtividade rea = new RelatorioAtividade();

        if (this.conexao == null) {
            this.conexao = Conexao.getConexao(true);
            if (this.conexao == null) return rea;
        }

        try {
            // ✅ CORREÇÃO AQUI: "Auditoria." antes da tabela
            String xSQL = "SELECT * FROM Auditoria.RelatorioAtividade WITH(NOLOCK) WHERE reaId = ? ";

            PreparedStatement stmt = this.conexao.prepareStatement(xSQL);
            stmt.setInt(1, reaId);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                rea.setReaId(rs.getInt("reaId"));
                rea.setRelId(rs.getInt("relId"));
                rea.setAtvId(rs.getInt("atvId"));
                rea.setAtvDescricaoPTA(rs.getString("atvDescricaoPTA"));
                rea.setReaTeste(rs.getString("reaTeste"));
                rea.setReaExtensao(rs.getString("reaExtensao"));
                rea.setReaCriterio(rs.getString("reaCriterio"));
                rea.setReaObs(rs.getString("reaObs"));
                rea.setReaObservacao(rs.getString("reaObservacao"));
                rea.setReaNaoConformidade(rs.getString("reaNaoConformidade"));
                rea.setReaReincidente(rs.getString("reaReincidente"));
                rea.setReaRecomendacao(rs.getString("reaRecomendacao"));
                rea.setReaPendencia(rs.getInt("reaPendencia"));
                rea.setAntObsSituacao(rs.getString("antObsSituacao"));
                rea.setReaDataInicial(rs.getString("reaDataInicial"));
                rea.setReaDataFinal(rs.getString("reaDataFinal"));
                rea.setReaDataSolucao(rs.getString("reaDataSolucao"));
                rea.setReaItem(rs.getInt("reaItem"));
                rea.setReaDias(rs.getInt("reaDias"));
                rea.setColId(rs.getInt("colId"));
                rea.setCarNome(rs.getString("carNome"));
                rea.setReaFlag(rs.getString("reaFlag"));
                rea.setReaUsuarioAlteracao(rs.getString("reaUsuarioAlteracao"));
            }
            rs.close();
            stmt.close();

        } catch (SQLException ex) {
            System.err.println("❌ ERRO AO CONSULTAR ID " + reaId + ": " + ex.getMessage());
            ex.printStackTrace();
        }

        return rea;
    }

    // ==================================================================================
    // 2. ALTERAR (UPDATE)
    // ==================================================================================
    public boolean alterarNovo(RelatorioAtividade rel) {

        if (this.conexao == null) {
            this.conexao = Conexao.getConexao(true);
            if (this.conexao == null) return false;
        }

        try {
            // ✅ CORREÇÃO AQUI: "Auditoria." antes da tabela
            String xSQL = "UPDATE Auditoria.RelatorioAtividade SET "
                    + "atvDescricaoPTA=?, reaItem=?, reaDataInicial=?, reaDataFinal=?, reaHoraInicial=?, reaHoraFinal=?, reaDias=?, reaHoras=?, colId=?, "
                    + "carNome=?, carClassificacao=?, reaFlag=?, reaFlagNum=?, atgObrigatorio=?, reaClassificacao=?, reaUltimasAuditorias=?, reaObs=?, "
                    + "reaDataAlteracao=?, reaHoraAlteracao=?, reaUsuarioAlteracao=?, reaUsuarioAlteracaoId=?, reaTeste=?, reaExtensao=?, reaCriterio=?, "
                    + "reaPeriodoInicial=?, reaPeriodoFinal=?, reaPeriodoAbrangido=?, reaObservacao=?, reaPendencia=?, reaNaoConformidade=?, "
                    + "reaReincidente=?, reaRecomendacao=?, reaDataSolucao=?, penId=?, reaQuebra=?, reaQuebraPendencia=?, antObsSituacao=? "
                    + "WHERE reaId=?";

            PreparedStatement stmt = conexao.prepareStatement(xSQL);

            stmt.setString(1, rel.getAtvDescricaoPTA());
            stmt.setInt(2, rel.getReaItem());
            stmt.setString(3, rel.getReaDataInicial());
            stmt.setString(4, rel.getReaDataFinal());
            stmt.setString(5, rel.getReaHoraInicial());
            stmt.setString(6, rel.getReaHoraFinal());
            stmt.setInt(7, rel.getReaDias());
            stmt.setString(8, rel.getReaHoras());
            stmt.setInt(9, rel.getColId());
            stmt.setString(10, rel.getCarNome());
            stmt.setInt(11, rel.getCarClassificacao());
            stmt.setString(12, rel.getReaFlag());
            stmt.setInt(13, rel.getReaFlagNum());
            stmt.setInt(14, rel.getAtgObrigatorio());
            stmt.setString(15, rel.getReaClassificacao());
            stmt.setString(16, rel.getReaUltimasAuditorias());
            stmt.setString(17, rel.getReaObs());
            stmt.setString(18, rel.getReaDataAlteracao());
            stmt.setString(19, rel.getReaHoraAlteracao());
            stmt.setString(20, rel.getReaUsuarioAlteracao());
            stmt.setInt(21, rel.getReaUsuarioAlteracaoId());
            stmt.setString(22, rel.getReaTeste());
            stmt.setString(23, rel.getReaExtensao());
            stmt.setString(24, rel.getReaCriterio());
            stmt.setString(25, rel.getReaPeriodoInicial());
            stmt.setString(26, rel.getReaPeriodoFinal());
            stmt.setString(27, rel.getReaPeriodoAbrangido());
            stmt.setString(28, rel.getReaObservacao());
            stmt.setInt(29, rel.getReaPendencia());
            stmt.setString(30, rel.getReaNaoConformidade());
            stmt.setString(31, rel.getReaReincidente());
            stmt.setString(32, rel.getReaRecomendacao());
            stmt.setString(33, rel.getReaDataSolucao());
            stmt.setInt(34, rel.getPenId());
            stmt.setInt(35, rel.getReaQuebra());
            stmt.setInt(36, rel.getReaQuebraPendencia());
            stmt.setString(37, rel.getAntObsSituacao());
            stmt.setInt(38, rel.getReaId());

            stmt.execute();
            stmt.close();

            System.out.println("✅ SUCESSO! Atividade ID " + rel.getReaId() + " atualizada.");
            return true;

        } catch (SQLException ex) {
            System.err.println("❌ ERRO AO SALVAR: " + ex.getMessage());
            ex.printStackTrace();
        }

        return false;
    }
}