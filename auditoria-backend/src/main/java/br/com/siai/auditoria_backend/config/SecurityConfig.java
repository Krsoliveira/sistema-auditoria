package br.com.siai.auditoria_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Desabilita proteção CSRF para facilitar APIs
                .authorizeHttpRequests(auth -> auth
                        // 👇 OLHA A MÁGICA AQUI: Adicionamos o /api/relatorios/** na lista VIP
                        .requestMatchers("/api/auth/login", "/api/atividades/**", "/api/relatorios/**").permitAll()
                        .anyRequest().authenticated()
                );
        return http.build();
    }

    // Bean para verificar senhas criptografadas (BCrypt)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}