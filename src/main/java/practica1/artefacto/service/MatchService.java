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
    // This method allows partial updates to a match object.
    // It takes a map of updates where the key is the field name and the value is the new value.
    // It updates only the fields that are present in the map.
    public Match patch(Long id, Map<String, Object> updates) {
        Match match = matches.get(id);
        if (match != null) {
            updates.forEach((key, value) -> {
                switch (key) {
                    case "date" -> match.setDate((String) value);
                    case "time" -> match.setTime((String) value);
                    case "team1Id" -> match.setTeam1Id((Long) value);
                    case "team2Id" -> match.setTeam2Id((Long) value);
                    case "tournamentId" -> match.setTournamentId((Long) value);
                }
            });
        }
        return match;
    }
    // This method retrieves all matches associated with a specific tournament ID.
    // It returns a map where the key is the match ID and the value is the match object.
    // It iterates through all matches and filters them based on the provided tournament ID
    public Map<Long, Match> getMatchesByTournamentId(Long tournamentId) {
        Map<Long, Match> filteredMatches = new HashMap<>();
        for (Map.Entry<Long, Match> entry : matches.entrySet()) {
            if (entry.getValue().getTournamentId().equals(tournamentId)) {
                filteredMatches.put(entry.getKey(), entry.getValue());
            }
        }
        return filteredMatches;
    }
}
