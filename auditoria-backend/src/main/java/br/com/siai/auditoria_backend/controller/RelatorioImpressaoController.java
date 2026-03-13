package br.com.siai.auditoria_backend.controller;

import br.com.siai.auditoria_backend.service.RelatorioService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/relatorios")
@CrossOrigin(origins = "*")
public class RelatorioImpressaoController {

    private final RelatorioService relatorioService;

    public RelatorioImpressaoController(RelatorioService relatorioService) {
        this.relatorioService = relatorioService;
    }

    // Rota que o React consulta (passando o croId da URL)
    @GetMapping("/{idDaTela}/anexo-legado-info")
    public ResponseEntity<?> verificarAnexoLegado(@PathVariable Long idDaTela) {
        Long arrId = relatorioService.verificarExistenciaAnexoLegado(idDaTela);

        if (arrId != null) {
            // Devolve o ID real do arquivo se ele existir
            return ResponseEntity.ok(Map.of("temArquivo", true, "arrId", arrId));
        } else {
            return ResponseEntity.ok(Map.of("temArquivo", false));
        }
    }

    // Rota que a nova aba do navegador acessa para gerar/baixar o PDF
    @GetMapping("/legado/{idArquivo}/pdf")
    public ResponseEntity<byte[]> baixarRelatorioLegadoBanco(@PathVariable Long idArquivo) {
        byte[] pdfBytes = relatorioService.buscarEConverterRelatorioLegado(idArquivo);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=Anexo_Relatorio_" + idArquivo + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}