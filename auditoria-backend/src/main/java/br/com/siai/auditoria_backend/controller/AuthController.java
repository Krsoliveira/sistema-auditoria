package br.com.siai.auditoria_backend.controller;

import br.com.siai.auditoria_backend.model.Colaborador;
import br.com.siai.auditoria_backend.repository.ColaboradorRepository;
import br.com.siai.auditoria_backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Permite o React conversar com o Java
public class AuthController {

    @Autowired
    private ColaboradorRepository repository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> dados) {
        String matricula = dados.get("matricula");
        String senha = dados.get("senha");

        if (matricula == null || senha == null) {
            return ResponseEntity.badRequest().body("Matrícula e senha são obrigatórios.");
        }

        // 1. Busca o colaborador no banco pela matrícula (colCodigo)
        Optional<Colaborador> colOpt = repository.findByColCodigo(matricula.trim());

        if (colOpt.isPresent()) {
            Colaborador colaborador = colOpt.get();

            // 2. Regra de Negócio: Verifica se tem acesso ao sistema (colAcessoAoSistema = 0 bloqueia)
            if (colaborador.getColAcessoAoSistema() == null || colaborador.getColAcessoAoSistema() == 0) {
                System.out.println(">>> Login BLOQUEADO (Sem acesso): " + matricula);
                return ResponseEntity.status(403).body("Acesso bloqueado para este usuário.");
            }

            // 3. Validação de Senha Legada: Base64(MD5(utf8(matricula + senha)))
            try {
                String textoParaAvaliar = matricula.trim() + senha;

                // Gera o MD5
                MessageDigest md = MessageDigest.getInstance("MD5");
                byte[] hashGerado = md.digest(textoParaAvaliar.getBytes(StandardCharsets.UTF_8));

                // Converte para Base64
                String hashFinal = Base64.getEncoder().encodeToString(hashGerado);

                // Comparação Segura em Tempo Constante (Constant-time comparison)
                boolean senhaValida = MessageDigest.isEqual(
                        hashFinal.getBytes(StandardCharsets.UTF_8),
                        colaborador.getColSenha().trim().getBytes(StandardCharsets.UTF_8)
                );

                if (senhaValida) {
                    System.out.println(">>> Login SUCESSO: " + colaborador.getColNome());

                    String token = jwtUtil.gerarToken(matricula.trim(), colaborador.getColNome());
                    return ResponseEntity.ok(Map.of("token", token, "nome", colaborador.getColNome()));
                }

            } catch (Exception e) {
                System.err.println(">>> Erro na criptografia MD5: " + e.getMessage());
                return ResponseEntity.status(500).body("Erro interno de validação.");
            }
        }

        // Se chegou aqui, a matrícula não existe ou a senha está errada.
        // Retornamos mensagem genérica para não dar dicas a hackers.
        System.out.println(">>> Login FALHOU para: " + matricula);
        return ResponseEntity.status(401).body("Matrícula ou senha inválidos.");
    }
}