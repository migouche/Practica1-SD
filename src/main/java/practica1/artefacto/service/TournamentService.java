package practica1.artefacto.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import practica1.artefacto.model.Tournament;
import practica1.artefacto.repository.TournamentRepository;

import java.util.List;
import java.util.Map;

@Service
public class TournamentService {

    @Autowired
    private TournamentRepository tournamentRepository;

    public Tournament create(Tournament tournament) {
        return tournamentRepository.save(tournament);
    }

    public Tournament read(Long id) {
        return tournamentRepository.findById(id).orElse(null);
    }

    public Tournament update(Long id, Tournament tournament) {
        tournament.setId(id);
        return tournamentRepository.save(tournament);
    }

    public Tournament patch(Long id, Map<String, Object> updates) {
        Tournament tournament = tournamentRepository.findById(id).orElse(null);
        if (tournament != null) {
            updates.forEach((key, value) -> {
                switch (key) {
                    case "name" -> tournament.setName((String) value);
                    case "date" -> tournament.setDate((String) value);
                    case "location" -> tournament.setLocation((String) value);
                }
            });
            tournamentRepository.save(tournament);
        }
        return tournament;
    }

    public void delete(Long id) {
        tournamentRepository.deleteById(id);
    }

    public List<Tournament> getAll() {
        return tournamentRepository.findAll();
    }
}
