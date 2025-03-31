package practica1.artefacto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import practica1.artefacto.model.Match;
import practica1.artefacto.service.MatchService;

import java.util.Map;

@RestController
@RequestMapping("/api/matches")
public class MatchController {

    @Autowired
    private MatchService matchService;

    @PostMapping
    public Match create(@RequestBody Match match) {
        return matchService.create(match);
    }

    @GetMapping("/{id}")
    public Match read(@PathVariable Long id) {
        return matchService.read(id);
    }

    @GetMapping
    public Map<Long, Match> getAll() {
        return matchService.getAll();
    }

    @PutMapping("/{id}")
    public Match update(@PathVariable Long id, @RequestBody Match match) {
        return matchService.update(id, match);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        matchService.delete(id);
    }
}
