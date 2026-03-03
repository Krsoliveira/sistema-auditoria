package br.com.siai.auditoria_backend.controller;

import br.com.siai.auditoria_backend.model.AtividadeDTO;
import br.com.siai.auditoria_backend.repository.RelatorioAtividadeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/relatorio-atividade")
@CrossOrigin(origins = "*") // 🔓 Liberação total para o Frontend
public class RelatorioAtividadeController {

    @Autowired
    private RelatorioAtividadeRepository repository;

    @GetMapping("/detalhes/{croId}")
    public ResponseEntity<List<AtividadeDTO>> buscarAtividades(@PathVariable Integer croId) {
        try {
            System.out.println(">>> [DEBUG] Solicitando atividades para o Cronograma ID: " + croId);
            List<AtividadeDTO> atividades = repository.buscarAtividadesPorCronograma(croId);

            if (atividades != null && !atividades.isEmpty()) {
                System.out.println(">>> [DEBUG] Sucesso: " + atividades.size() + " atividades encontradas.");
                return ResponseEntity.ok(atividades);
            }

            System.out.println(">>> [DEBUG] Aviso: Nenhuma atividade para o ID " + croId);
            return ResponseEntity.notFound().build();

        } catch (Exception e) {
            System.err.println(">>> [ERRO FATAL] Erro ao buscar atividades: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }
}