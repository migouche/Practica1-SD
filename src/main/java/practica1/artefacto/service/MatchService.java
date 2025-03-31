package practica1.artefacto.service;

import org.springframework.stereotype.Service;
import practica1.artefacto.model.Match;

import java.util.HashMap;
import java.util.Map;

@Service
public class MatchService {
    private final Map<Long, Match> matches = new HashMap<>();
    private Long currentId = 1L;

    public Match create(Match match) {
        match.setId(currentId++);
        matches.put(match.getId(), match);
        return match;
    }

    public Match read(Long id) {
        return matches.get(id);
    }

    public Match update(Long id, Match match) {
        match.setId(id);
        matches.put(id, match);
        return match;
    }

    public void delete(Long id) {
        matches.remove(id);
    }

    public Map<Long, Match> getAll() {
        return matches;
    }
}
