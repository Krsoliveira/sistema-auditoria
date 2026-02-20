package br.com.siai.auditoria_backend.repository;

import br.com.siai.auditoria_backend.model.Colaborador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ColaboradorRepository extends JpaRepository<Colaborador, String> {

    // Busca o colaborador pela matrícula
    Optional<Colaborador> findByColCodigo(String colCodigo);
}