package practica1.artefacto.service;

import org.springframework.stereotype.Service;
import practica1.artefacto.model.Team;

import java.util.HashMap;
import java.util.Map;

@Service
public class TeamService {
    private final Map<Long, Team> teams = new HashMap<>();
    private Long currentId = 1L;

    public Team create(Team team) {
        team.setId(currentId++);
        teams.put(team.getId(), team);
        return team;
    }

    public Team read(Long id) {
        return teams.get(id);
    }

    public Team update(Long id, Team team) {
        team.setId(id);
        teams.put(id, team);
        return team;
    }

    public void delete(Long id) {
        teams.remove(id);
    }

    public Map<Long, Team> getAll() {
        return teams;
    }

}