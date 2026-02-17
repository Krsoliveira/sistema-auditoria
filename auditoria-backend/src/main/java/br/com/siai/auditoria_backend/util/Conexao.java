package br.com.siai.util; // <--- ESSA LINHA É OBRIGATÓRIA

import java.sql.Connection;
import java.sql.DriverManager;

public class Conexao { // <--- O SEU ERRO PROVAVELMENTE ERA A FALTA DESSA LINHA

    public static Connection getConexao(boolean autoCommit) {
        try {
            // --- CONFIGURAÇÃO (Autenticação do Windows) ---
            String nomeDoBanco = "SiaiDB_Producao"; // Seu banco correto

            String url = "jdbc:sqlserver://localhost:1433;"
                    + "databaseName=" + nomeDoBanco + ";"
                    + "integratedSecurity=true;"
                    + "encrypt=false;"
                    + "trustServerCertificate=true;";

            Connection conn = DriverManager.getConnection(url);
            conn.setAutoCommit(autoCommit);

            // Apenas para debug no console (opcional)
            // System.out.println("✅ Conexão OK!");

            return conn;

        } catch (Exception e) {
            System.err.println("❌ Erro ao conectar no banco: " + e.getMessage());
            return null;
        }
    }
}