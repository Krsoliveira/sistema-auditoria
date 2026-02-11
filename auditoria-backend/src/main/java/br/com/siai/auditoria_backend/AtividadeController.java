package br.com.siai.auditoria_backend.controller;

import br.com.siai.dao.RelatorioAtividadeDao;
import br.com.siai.model.RelatorioAtividade;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/atividades")
@CrossOrigin(origins = "*") // Permite que o React acesse
public class AtividadeController {

    private RelatorioAtividadeDao dao = new RelatorioAtividadeDao();

    @GetMapping("/{id}")
    public RelatorioAtividade buscar(@PathVariable int id) {
        return dao.consultar(id);
    }

    @PostMapping("/salvar")
    public boolean salvar(@RequestBody RelatorioAtividade atividade) {
        return dao.alterarNovo(atividade);
    }
}