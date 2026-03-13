package br.com.siai.auditoria_backend.controller;

import br.com.siai.auditoria_backend.model.AnotacaoDTO;
import br.com.siai.auditoria_backend.repository.AnotacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/anotacoes")
@CrossOrigin(origins = "*")
public class AnotacaoController {

    @Autowired
    private AnotacaoRepository repository;

    @GetMapping("/atividade/{reaId}")
    public ResponseEntity<List<AnotacaoDTO>> buscarAnotacoes(@PathVariable Integer reaId) {
        try {
            System.out.println(">>> [DEBUG] A buscar histórico de anotações para a Atividade ID: " + reaId);
            List<AnotacaoDTO> historico = repository.buscarHistoricoPorAtividade(reaId);

            if (historico != null && !historico.isEmpty()) {
                System.out.println(">>> [DEBUG] Sucesso: " + historico.size() + " versões encontradas.");
                return ResponseEntity.ok(historico);
            }

            System.out.println(">>> [DEBUG] Nenhuma anotação encontrada para o registo " + reaId);
            return ResponseEntity.noContent().build();

        } catch (Exception e) {
            System.err.println(">>> [ERRO] Falha ao buscar as anotações: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }
}