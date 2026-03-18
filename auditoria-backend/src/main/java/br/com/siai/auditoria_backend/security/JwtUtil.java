package br.com.siai.auditoria_backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    // 🔴 A MESMA CHAVE EXATA DO DJANGO!
    private static final String SECRET = "Siai_Auditoria_Super_Secreta_2026!@#";

    // Transforma a chave em um formato criptografado que o Java entende
    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

    // Gera um token JWT com matrícula e nome, válido por 12 horas
    public String gerarToken(String matricula, String nome) {
        return Jwts.builder()
                .setSubject(matricula)
                .claim("nome", nome)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 12 * 60 * 60 * 1000))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Abre a "pulseira" e tira os dados de lá de dentro (Matrícula, Nome, etc)
    public Claims extrairClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Verifica se a assinatura bate e se não passou das 12 horas de validade
    public boolean validarToken(String token) {
        try {
            extrairClaims(token);
            return true;
        } catch (Exception e) {
            System.out.println("❌ SSO Bloqueado: Token inválido ou expirado. " + e.getMessage());
            return false;
        }
    }
}