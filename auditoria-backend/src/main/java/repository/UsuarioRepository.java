package br.com.siai.auditoria_backend.repository;

import br.com.siai.auditoria_backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // JPQL usando TRIM para limpar espaços da coluna no banco
    @Query("SELECT u FROM Usuario u WHERE TRIM(u.matricula) = :matricula")
    Optional<Usuario> findByMatricula(@Param("matricula") String matricula);

    Optional<Usuario> findByEmail(String email);
}