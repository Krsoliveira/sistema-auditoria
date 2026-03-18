package br.com.siai.auditoria_backend.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. O porteiro olha o cabeçalho "Authorization" que o React mandou
        String header = request.getHeader("Authorization");

        // 2. Se tiver a palavra "Bearer " (Portador da Pulseira), ele analisa
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7); // Tira a palavra "Bearer " e pega só o código

            // 3. O verificador checa se é válido
            if (jwtUtil.validarToken(token)) {
                Claims claims = jwtUtil.extrairClaims(token);
                String matricula = claims.getSubject(); // A matrícula do usuário do Django

                // 4. Diz pro Spring Boot: "Pode deixar entrar, ele está autorizado!"
                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(matricula, null, new ArrayList<>());

                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }

        // Deixa a requisição seguir o seu caminho natural
        filterChain.doFilter(request, response);
    }
}