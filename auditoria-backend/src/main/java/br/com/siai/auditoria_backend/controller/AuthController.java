package br.com.siai.auditoria_backend.controller;

import br.com.siai.auditoria_backend.model.Usuario;
import br.com.siai.auditoria_backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder; // Se ficar vermelho, recarregue o Maven
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Permite que o seu React (porta 5173 ou 3000) acesse o Java
public class AuthController {

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Lógica de Login
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> dados) {
        String matricula = dados.get("matricula");
        String senha = dados.get("senha");

        // Busca o usuário (usando a lógica de TRIM que criamos no Repository)
        Optional<Usuario> usuarioOpt = repository.findByMatricula(matricula);

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();

            // Verifica se a senha digitada bate com o Hash BCrypt do banco
            if (passwordEncoder.matches(senha.trim(), usuario.getHashSenha().trim())) {
                System.out.println("Login realizado com sucesso: " + usuario.getNomeCompleto());
                return ResponseEntity.ok(usuario);
            }
        }

        System.out.println("Falha de login para matrícula: " + matricula);
        return ResponseEntity.status(401).body("Matrícula ou senha inválidos");
    }

    /**
     * Lógica de Alteração de Senha
     */
    @PostMapping("/alterar-senha")
    public ResponseEntity<?> alterarSenha(@RequestBody Map<String, String> dados) {
        String matricula = dados.get("matricula");
        String senhaAtual = dados.get("senhaAtual");
        String novaSenha = dados.get("novaSenha");

        // Localiza o usuário
        Optional<Usuario> usuarioOpt = repository.findByMatricula(matricula);

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();

            // 1. Valida se a senha ATUAL está correta
            if (passwordEncoder.matches(senhaAtual.trim(), usuario.getHashSenha().trim())) {

                // 2. Gera o novo hash para a NOVA senha
                String novoHash = passwordEncoder.encode(novaSenha.trim());

                // 3. Atualiza no objeto e salva no SQL Server
                usuario.setHashSenha(novoHash);
                repository.save(usuario);

                System.out.println("Senha alterada para o usuário: " + usuario.getNomeCompleto());
                return ResponseEntity.ok("Senha alterada com sucesso!");
            } else {
                return ResponseEntity.status(401).body("Senha atual incorreta.");
            }
        }

        return ResponseEntity.status(404).body("Usuário não encontrado.");
    }
}