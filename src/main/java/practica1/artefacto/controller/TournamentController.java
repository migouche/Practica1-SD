package practica1.artefacto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import practica1.artefacto.model.Tournament;
import practica1.artefacto.service.TournamentService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tournaments")
public class TournamentController {

    @Autowired
    private TournamentService tournamentService;

    @PostMapping
    public Tournament create(@RequestBody Tournament tournament) {
        return tournamentService.create(tournament);
    }

    @GetMapping("/{id}")
    public Tournament read(@PathVariable Long id) {
        return tournamentService.read(id);
    }

    @GetMapping
    public List<Tournament> getAll() {
        return tournamentService.getAll();
    }

    @PutMapping("/{id}")
    public Tournament update(@PathVariable Long id, @RequestBody Tournament tournament) {
        return tournamentService.update(id, tournament);
    }

    @PatchMapping("/{id}")
    public Tournament patch(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        return tournamentService.patch(id, updates);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        tournamentService.delete(id);
    }
}
