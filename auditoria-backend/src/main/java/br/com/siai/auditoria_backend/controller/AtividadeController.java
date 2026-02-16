package br.com.siai.auditoria_backend.controller;

import br.com.siai.auditoria_backend.model.Atividade;
import br.com.siai.auditoria_backend.repository.AtividadeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/atividades")
@CrossOrigin(origins = "*") // Permite o Frontend acessar
public class AtividadeController {

    @Autowired
    private AtividadeRepository repository;

    // Listar Todas
    @GetMapping
    public List<Atividade> listar() {
        return repository.findAll();
    }

    // Salvar ou Atualizar
    @PostMapping
    public Atividade salvar(@RequestBody Atividade atividade) {
        return repository.save(atividade);
    }

    // Buscar por ID (para edição)
    @GetMapping("/{id}")
    public Atividade buscarPorId(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }

    // Deletar
    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        repository.deleteById(id);
    }
}