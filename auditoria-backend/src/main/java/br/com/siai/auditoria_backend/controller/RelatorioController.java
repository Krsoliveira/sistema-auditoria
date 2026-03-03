package br.com.siai.auditoria_backend.controller;

import br.com.siai.auditoria_backend.model.DashboardDTO;
import br.com.siai.auditoria_backend.model.CabecalhoDTO; // 🔴 IMPORTAÇÃO NOVA
import br.com.siai.auditoria_backend.repository.RelatorioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/relatorios")
@CrossOrigin(origins = "*")
public class RelatorioController {

    @Autowired
    private RelatorioRepository repository;

    @GetMapping
    public ResponseEntity<?> listar(@RequestParam(required = false, defaultValue = "2026") Integer ano) {
        try {
            List<DashboardDTO> lista;

            if (ano == 0) {
                System.out.println(">>> [DEBUG] Buscando TODO o histórico de auditorias (Ano = 0)...");
                lista = repository.buscarTodos();
            } else {
                System.out.println(">>> [DEBUG] Buscando dados para o ano: " + ano);
                lista = repository.buscarPorAno(ano);
            }

            return ResponseEntity.ok(lista);

        } catch (Exception e) {
            System.err.println(">>> [ERRO] Falha ao cruzar tabelas: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erro interno ao procurar os relatórios.");
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

    // 🔴 A ROTA NOVA PARA O CABEÇALHO DO MODAL (O que faltava!)
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