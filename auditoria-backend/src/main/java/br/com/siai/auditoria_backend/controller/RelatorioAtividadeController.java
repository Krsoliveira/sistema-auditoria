package br.com.siai.auditoria_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.siai.auditoria_backend.model.AtividadeDTO;
import br.com.siai.auditoria_backend.repository.RelatorioAtividadeRepository;

import java.util.List;

@RestController
@RequestMapping("/api/relatorio-atividade")
@CrossOrigin(origins = "*")
public class RelatorioAtividadeController {

    private final RelatorioAtividadeRepository repository;

    public RelatorioAtividadeController(RelatorioAtividadeRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/cronograma/{croId}")
    public ResponseEntity<List<AtividadeDTO>> listarAtividades(@PathVariable Integer croId) {
        List<AtividadeDTO> atividades = repository.buscarAtividadesPorCronograma(croId);
        return ResponseEntity.ok(atividades);
    }
}