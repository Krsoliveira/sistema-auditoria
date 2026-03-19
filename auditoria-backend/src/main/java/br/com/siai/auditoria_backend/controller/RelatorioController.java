package br.com.siai.auditoria_backend.controller;

import br.com.siai.auditoria_backend.model.DashboardDTO;
import br.com.siai.auditoria_backend.model.CabecalhoDTO;
import br.com.siai.auditoria_backend.model.ColaboradorSimpleDTO;
import br.com.siai.auditoria_backend.model.HistoricoRelatorioDTO;
import br.com.siai.auditoria_backend.model.HistoricoAtividadeDTO;
import br.com.siai.auditoria_backend.repository.RelatorioRepository;
import br.com.siai.auditoria_backend.repository.RelatorioAtividadeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/relatorios")
@CrossOrigin(origins = "*")
public class RelatorioController {

    @Autowired
    private RelatorioRepository repository;

    @Autowired
    private RelatorioAtividadeRepository atividadeRepository;

    // Rota principal agora recebe ano, busca (opcional), page e size
    @GetMapping
    public ResponseEntity<?> listar(
            @RequestParam(required = false) Integer ano,
            @RequestParam(required = false) String busca,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {

        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<DashboardDTO> paginaDeRelatorios;

            // Se tem termo de busca...
            if (busca != null && !busca.trim().isEmpty()) {
                if (ano != null && ano != 0) {
                    System.out.println(">>> [DEBUG] Buscando '" + busca + "' no ano " + ano);
                    paginaDeRelatorios = repository.buscarPorAnoETermo(ano, busca, pageable);
                } else {
                    System.out.println(">>> [DEBUG] Buscando globalmente no banco pelo termo: " + busca);
                    paginaDeRelatorios = repository.buscarPorTermo(busca, pageable);
                }
            }
            // Se NÃO tem termo de busca, mas tem um Ano específico...
            else if (ano != null && ano != 0) {
                System.out.println(">>> [DEBUG] Buscando dados paginados para o ano: " + ano);
                paginaDeRelatorios = repository.buscarPorAno(ano, pageable);
            }
            // Se é o Ano 0 e não tem busca (Todos os Anos Geral)...
            else {
                paginaDeRelatorios = repository.buscarTodos(pageable);
            }

            return ResponseEntity.ok(paginaDeRelatorios);

        } catch (Exception e) {
            System.err.println(">>> [ERRO] Falha ao listar relatórios: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erro interno ao procurar os relatórios.");
        }
    }

    @GetMapping("/{croId}/colaboradores")
    public ResponseEntity<List<ColaboradorSimpleDTO>> buscarColaboradores(@PathVariable Integer croId) {
        try {
            List<ColaboradorSimpleDTO> colaboradores = repository.buscarColaboradoresPorCroId(croId);
            return ResponseEntity.ok(colaboradores);
        } catch (Exception e) {
            System.err.println(">>> [ERRO] Falha ao buscar colaboradores: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/anos")
    public ResponseEntity<List<Integer>> listarAnos() {
        try {
            List<Integer> anos = repository.buscarAnosDisponiveis();
            return ResponseEntity.ok(anos);
        } catch (Exception e) {
            System.err.println(">>> [ERRO] Falha ao buscar anos: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/{croId}/historico-unidade")
    public ResponseEntity<List<HistoricoRelatorioDTO>> buscarHistoricoUnidade(@PathVariable Integer croId) {
        try {
            List<HistoricoRelatorioDTO> historico = repository.buscarHistoricoUnidade(croId);
            return ResponseEntity.ok(historico);
        } catch (Exception e) {
            System.err.println(">>> [ERRO] Falha ao buscar histórico da unidade: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/{croId}/atividade/{atvId}/historico")
    public ResponseEntity<List<HistoricoAtividadeDTO>> buscarHistoricoAtividade(
            @PathVariable Integer croId, @PathVariable Integer atvId) {
        try {
            List<HistoricoAtividadeDTO> historico = atividadeRepository.buscarHistoricoAtividade(atvId, croId);
            return ResponseEntity.ok(historico);
        } catch (Exception e) {
            System.err.println(">>> [ERRO] Falha ao buscar histórico da atividade: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/cabecalho/{id}")
    public ResponseEntity<CabecalhoDTO> buscarCabecalho(@PathVariable Integer id) {
        try {
            System.out.println(">>> [DEBUG] Buscando cabecalho para o relatorio ID: " + id);
            CabecalhoDTO cabecalho = repository.buscarCabecalho(id);
            if (cabecalho != null) {
                return ResponseEntity.ok(cabecalho);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.err.println(">>> [ERRO] Falha ao buscar cabecalho: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
}