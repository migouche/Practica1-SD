package practica1.artefacto.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Tournament {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String date;
    private String location;

    @ElementCollection
    private List<Long> teamIds = new ArrayList<>();

    @ElementCollection
    private List<Long> matchIds = new ArrayList<>();

    // Getters and Setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getDate() {
        return date;
    }
    public void setDate(String date) {
        this.date = date;
    }
    public String getLocation() {
        return location;
    }
    public void setLocation(String location) {
        this.location = location;
    }
    public List<Long> getTeamIds() {
        return teamIds;
    }
    public void setTeamIds(List<Long> teamIds) {
        this.teamIds = teamIds;
    }
    public List<Long> getMatchIds() {
        return matchIds;
    }
    public void setMatchIds(List<Long> matchIds) {
        this.matchIds = matchIds;
    }
    public void addTeamId(Long teamId) {
        this.teamIds.add(teamId);
    }
    public void addMatchId(Long matchId) {
        this.matchIds.add(matchId);
    }
    public void removeTeamId(Long teamId) {
        this.teamIds.remove(teamId);
    }
    public void removeMatchId(Long matchId) {
        this.matchIds.remove(matchId);
    }
    public void clearTeamIds() {
        this.teamIds.clear();
    }
    public void clearMatchIds() {
        this.matchIds.clear();
    }
    public void clear() {
        this.teamIds.clear();
        this.matchIds.clear();
    }
    public void addTeams(List<Long> teamIds) {
        this.teamIds.addAll(teamIds);
    }
}
