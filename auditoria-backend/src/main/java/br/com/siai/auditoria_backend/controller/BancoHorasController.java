package br.com.siai.auditoria_backend.controller;

import br.com.siai.auditoria_backend.model.BancoHorasExtratoDTO;
import br.com.siai.auditoria_backend.model.BancoHorasResumoDTO;
import br.com.siai.auditoria_backend.repository.BancoHorasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bancohoras")
@CrossOrigin(origins = "*")
public class BancoHorasController {

    @Autowired
    private BancoHorasRepository repository;

    @GetMapping("/resumo")
    public ResponseEntity<List<BancoHorasResumoDTO>> getResumoGeral() {
        try {
            List<BancoHorasResumoDTO> resumo = repository.buscarResumoBancoHoras();
            return ResponseEntity.ok(resumo);
        } catch (Exception e) {
            System.err.println("Erro ao buscar resumo banco de horas: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/extrato/{colId}")
    public ResponseEntity<List<BancoHorasExtratoDTO>> getExtrato(@PathVariable Integer colId) {
        try {
            List<BancoHorasExtratoDTO> extrato = repository.buscarExtratoPorColaborador(colId);
            return ResponseEntity.ok(extrato);
        } catch (Exception e) {
            System.err.println("Erro ao buscar extrato do colaborador: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }
}