package practica1.artefacto.model;

import jakarta.persistence.*;

@Entity
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String coach;
    private String badge;

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
    public String getCoach() {
        return coach;
    }
    public void setCoach(String coach) {
        this.coach = coach;
    }
    public String getBadge() {
        return badge;
    }
    public void setBadge(String badge) {
        this.badge = badge;
    }
}
