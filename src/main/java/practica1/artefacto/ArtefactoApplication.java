package practica1.artefacto;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import practica1.artefacto.model.Team;
import practica1.artefacto.model.Tournament;
import practica1.artefacto.service.TeamService;
import practica1.artefacto.service.TournamentService;

@SpringBootApplication
public class ArtefactoApplication {

	public static void main(String[] args) {
		SpringApplication.run(ArtefactoApplication.class, args);
	}
/* 
	@Bean
	CommandLineRunner initData(TeamService teamService, TournamentService tournamentService) {
		return args -> {
			createInitialTeams(teamService);
			createInitialTournaments(tournamentService);
		};
	}

	private void createInitialTeams(TeamService teamService) {
		// Add initial teams to the database
		Team team1 = new Team();
		team1.setName("a");
		team1.setCoach("a");
		team1.setBadge(null);
		teamService.create(team1);

		Team team2 = new Team();
		team2.setName("b");
		team2.setCoach("b");
		team2.setBadge(null);
		teamService.create(team2);
	}

	private void createInitialTournaments(TournamentService tournamentService) {
		// Add initial tournaments to the database
		Tournament t = new Tournament();
		t.setName("t");
		t.setLocation("t");
		t.setDate("2023-10-01");
		tournamentService.create(t);
	}
	 */
}
