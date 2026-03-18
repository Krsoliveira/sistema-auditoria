package br.com.siai.auditoria_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/foto")
public class FotoController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/{codigo}")
    public ResponseEntity<byte[]> getFoto(@PathVariable String codigo) {
        try {
            byte[] foto = jdbcTemplate.queryForObject(
                "SELECT TOP 1 BIN FROM [Business].[base].[ParceirosFotos] WHERE CodigoFpw = ? ORDER BY DataHora DESC",
                byte[].class,
                codigo
            );
            if (foto == null || foto.length == 0) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("image/jpeg"))
                .body(foto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
