package br.com.siai.auditoria_backend.repository;

import br.com.siai.auditoria_backend.model.Cronograma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CronogramaRepository extends JpaRepository<Cronograma, Long> {
    // Aqui poderemos adicionar buscas customizadas futuramente, ex: buscar por ano
}