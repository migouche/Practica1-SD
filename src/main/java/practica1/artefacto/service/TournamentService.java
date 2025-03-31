package practica1.artefacto.service;

import org.springframework.stereotype.Service;
import practica1.artefacto.model.Tournament;

import java.util.HashMap;
import java.util.Map;

@Service
public class TournamentService {
    private final Map<Long, Tournament> tournaments = new HashMap<>();
    private Long currentId = 1L;

    public Tournament create(Tournament tournament) {
        tournament.setId(currentId++);
        tournaments.put(tournament.getId(), tournament);
        return tournament;
    }

    public Tournament read(Long id) {
        return tournaments.get(id);
    }

    public Tournament update(Long id, Tournament tournament) {
        tournament.setId(id);
        tournaments.put(id, tournament);
        return tournament;
    }

    public Tournament patch(Long id, Map<String, Object> updates) {
        Tournament tournament = tournaments.get(id);
        if (tournament != null) {
            updates.forEach((key, value) -> {
                switch (key) {
                    case "name" -> tournament.setName((String) value);
                    case "date" -> tournament.setDate((String) value);
                    case "location" -> tournament.setLocation((String) value);
                }
            });
        }
        return tournament;
    }

    public void delete(Long id) {
        tournaments.remove(id);
    }

    public Map<Long, Tournament> getAll() {
        return tournaments;
    }
}
