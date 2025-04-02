package practica1.artefacto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import practica1.artefacto.model.Team;

public interface TeamRepository extends JpaRepository<Team, Long> {
}