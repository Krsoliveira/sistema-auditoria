package br.com.siai.util;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class TesteConexao {

    public static void main(String[] args) {
        System.out.println("🕵️ INICIANDO DIAGNÓSTICO DO BANCO DE DADOS...");

        Connection conn = Conexao.getConexao(false);

        if (conn == null) {
            System.err.println("❌ FALHA TOTAL: Não foi possível conectar ao servidor.");
            return;
        }

        try {
            // 1. Descobrir em qual banco estamos conectados agora
            String sqlBanco = "SELECT DB_NAME() AS BancoAtual";
            PreparedStatement stmt = conn.prepareStatement(sqlBanco);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                System.out.println("✅ CONECTADO NO BANCO: " + rs.getString("BancoAtual"));
            }
            rs.close();
            stmt.close();

            // 2. Listar tabelas que parecem com 'Relatorio'
            System.out.println("\n🔍 PROCURANDO TABELAS NESSE BANCO:");
            String sqlTabelas = "SELECT TABLE_SCHEMA, TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME LIKE '%Relatorio%'";
            stmt = conn.prepareStatement(sqlTabelas);
            rs = stmt.executeQuery();

            boolean achouAlguma = false;
            while (rs.next()) {
                achouAlguma = true;
                String schema = rs.getString("TABLE_SCHEMA");
                String tabela = rs.getString("TABLE_NAME");
                System.out.println("   📄 ENCONTRADA: " + schema + "." + tabela);
            }

            if (!achouAlguma) {
                System.err.println("   ❌ NENHUMA TABELA 'RelatorioAtividade' FOI ENCONTRADA NESSE BANCO!");
                System.err.println("   👉 Conclusão: O nome do banco no arquivo Conexao.java está errado.");
            } else {
                System.out.println("\n✅ SUCESSO! A tabela existe. Use o nome exato que apareceu acima.");
            }

            conn.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}