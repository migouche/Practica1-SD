package practica1.artefacto.model;

public class Match {
    private Long id;
    private String date;
    private String time;
    private Long team1Id;
    private Long team2Id;
    private Long tournamentId;

    // Getters and Setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getDate() {
        return date;
    }
    public void setDate(String date) {
        this.date = date;
    }
    public String getTime() {
        return time;
    }
    public void setTime(String time) {
        this.time = time;
    }
    public Long getTeam1Id() {
        return team1Id;
    }
    public void setTeam1Id(Long team1Id) {
        this.team1Id = team1Id;
    }
    public Long getTeam2Id() {
        return team2Id;
    }
    public void setTeam2Id(Long team2Id) {
        this.team2Id = team2Id;
    }
    public Long getTournamentId() {
        return tournamentId;
    }
    public void setTournamentId(Long tournamentId) {
        this.tournamentId = tournamentId;
    }
}
