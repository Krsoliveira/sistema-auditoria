package br.com.siai.util;

public class Global {
    private static Global instance;
    public boolean conexaoAuditoria = true;

    public static Global getInstance() {
        if (instance == null) instance = new Global();
        return instance;
    }
}