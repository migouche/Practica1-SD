package practica1.artefacto.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import practica1.artefacto.model.Match;

public interface MatchRepository extends JpaRepository<Match, Long> {
    List<Match> findByTournamentId(Long tournamentId);

}