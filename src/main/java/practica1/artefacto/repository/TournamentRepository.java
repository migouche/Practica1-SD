package practica1.artefacto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import practica1.artefacto.model.Tournament;

public interface TournamentRepository extends JpaRepository<Tournament, Long> {
}