document.addEventListener('DOMContentLoaded', function () {
    const API_BASE_URL = 'http://localhost:8080/api';

    // Diccionario de equipos conocidos y sus archivos de imagen (las claves deben ser en minúsculas)
    const knownTeamsLogos = {
        "atleticodemadrid": "atleticodemadrid.JPG",
        "barcelona": "barcelona.JPG",
        "betis": "betis.JPG",
        "borusia": "borusia.JPG",
        "liverpool": "liverpool.JPG",
        "milan": "milan.JPG",
        "monaco": "monaco.JPG",
        "realmadrid": "realmadrid.JPG"
    };

    /* ======================= Helper Functions ======================= */
    async function fetchData(endpoint) {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`);
        return response.json();
    }

    async function postData(endpoint, data) {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    async function deleteData(endpoint, id) {
        await fetch(`${API_BASE_URL}/${endpoint}/${id}`, { method: 'DELETE' });
    }

    async function patchData(endpoint, id, updates) {
        const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });
        return response.json();
    }

    /* ======================= Tournaments Functionality ======================= */
    if (document.getElementById('tournament-form')) {
        const tournamentForm = document.getElementById('tournament-form');
        const tournamentsContainer = document.getElementById('tournaments-list');

        tournamentForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const name = document.getElementById('tournament-name').value;
            const date = document.getElementById('tournament-date').value;
            const location = document.getElementById('tournament-location').value;

            const tournament = { name, date, location, teams: [], matches: [] };
            await postData('tournaments', tournament);
            updateTournamentsList();
            tournamentForm.reset();
        });

        async function updateTournamentsList() {
            const tournaments = await fetchData('tournaments');
            const tournamentsArray = Object.values(tournaments);
            tournamentsContainer.innerHTML = '';
            tournamentsArray.forEach(tournament => {
                const div = document.createElement('div');
                div.classList.add('list-item');
                div.innerHTML = `
                    <strong>${tournament.name}</strong> - ${tournament.date} - ${tournament.location}
                    <button data-id="${tournament.id}" class="delete-tournament">Delete</button>
                    <div class="details">
                        <p>Teams: ${tournament.teamIds.length}</p>
                        <p>Matches: ${tournament.matchIds.length}</p>
                    </div>
                `;
                tournamentsContainer.appendChild(div);
            });
        }

        tournamentsContainer.addEventListener('click', async function (e) {
            if (e.target.classList.contains('delete-tournament')) {
                const id = e.target.getAttribute('data-id');
                await deleteData('tournaments', id);
                updateTournamentsList();
            }
        });

        updateTournamentsList();
    }

    /* ======================= Teams Functionality ======================= */
    if (document.getElementById('team-form')) {
        const teamForm = document.getElementById('team-form');
        const teamsContainer = document.getElementById('teams-list');

        teamForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const name = document.getElementById('team-name').value;
            const coach = document.getElementById('team-coach').value;
            const badge = `${API_BASE_URL}/logos/${name.toLowerCase()}`; 
            const team = { name, coach, badge };
            await postData('teams', team);
            updateTeamsList();
            teamForm.reset();
        });

        async function updateTeamsList() {
            const teams = await fetchData('teams');
            const teamsArray = Object.values(teams);
            teamsContainer.innerHTML = '';
            teamsArray.forEach(team => {
                const div = document.createElement('div');
                div.classList.add('list-item');
                div.innerHTML = `
                    <img src="${team.badge}" alt="${team.name}" class="team-logo" style="width:40px; height:40px; vertical-align: middle; margin-right: 8px;">
                    <strong>${team.name}</strong> - Coach: ${team.coach}
                    <button data-id="${team.id}" class="delete-team">Delete</button>
                `;
                teamsContainer.appendChild(div);
            });
        }

        teamsContainer.addEventListener('click', async function (e) {
            if (e.target.classList.contains('delete-team')) {
                const id = e.target.getAttribute('data-id');
                await deleteData('teams', id);
                updateTeamsList();
            }
        });

        updateTeamsList();
    }

    /* ======================= Matches Functionality ======================= */
    if (document.getElementById('match-form')) {
        const matchForm = document.getElementById('match-form');
        const matchesContainer = document.getElementById('matches-list');

        matchForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const date = document.getElementById('match-date').value;
            const time = document.getElementById('match-time').value;
            const team1Name = document.getElementById('match-team1').value;
            const team2Name = document.getElementById('match-team2').value;
            const tournamentName = document.getElementById('match-tournament').value;

            // First, find the teams by name
            const teams = await fetchData('teams');
            const teamsArray = Object.values(teams);

            const tournamentsArray = await fetchData('tournaments').then(res => Object.values(res));
            
            const team1 = teamsArray.find(t => t.name === team1Name);
            const team2 = teamsArray.find(t => t.name === team2Name);

            const tournament = tournamentsArray.find(t => t.name === tournamentName);
            
            
            if (!team1 || !team2) {
                alert("One or both teams don't exist. Please create them first.");
                return;
            }

            if (team1.id === team2.id) {
                alert("A team cannot play against itself.");
                return;
            }
            if (!tournament) {
                alert("Tournament not found. Please create it first.");
                return;
            }
            
            // Now create the match with team IDs
            const match = { 
                date, 
                time, 
                team1Id: team1.id, 
                team2Id: team2.id, 
                tournamentId: tournament.id  // You'd need to fetch tournament ID similarly
            };
            
            await postData('matches', match);
            updateMatchesList();
            matchForm.reset();
        });

        async function updateMatchesList() {
            const matches = await fetchData('matches');
            const matchesArray = Object.values(matches);
            console.log(`matches: ${JSON.stringify(matchesArray)}`);
            matchesContainer.innerHTML = '';
            for (const match of matchesArray) {
                // Obtenemos los equipos usando sus IDs
                const team1 = await fetchData(`teams/${match.team1Id}`);
                const team2 = await fetchData(`teams/${match.team2Id}`);
                // Obtenemos el torneo para mostrar el nombre (opcional)
                const tournament = await fetchData(`tournaments/${match.tournamentId}`);
        
                // Usamos el campo badge directamente, si no existe, usamos un default
                const team1Logo = team1.badge ? team1.badge : `${API_BASE_URL}/logos/default.jpg`;
                const team2Logo = team2.badge ? team2.badge : `${API_BASE_URL}/logos/default.jpg`;
        
                // También obtenemos los nombres de los equipos
                const team1Name = team1.name;
                const team2Name = team2.name;
                const tournamentName = tournament.name;
        
                const div = document.createElement('div');
                div.classList.add('list-item');
                div.innerHTML = `
                    <div class="match-card">
                        <div class="team-info">
                            <img src="${team1Logo}" alt="${team1Name}" class="team-logo">
                            <strong>${team1Name}</strong>
                        </div>
                        <span>vs</span>
                        <div class="team-info">
                            <img src="${team2Logo}" alt="${team2Name}" class="team-logo">
                            <strong>${team2Name}</strong>
                        </div>
                        <div class="match-details">
                            <p><strong>Tournament:</strong> ${tournamentName}</p>
                            <p><strong>Date:</strong> ${match.date} - <strong>Time:</strong> ${match.time}</p>
                        </div>
                        <button data-id="${match.id}" class="delete-match">Delete</button>
                    </div>
                `;
                matchesContainer.appendChild(div);
            }
        }
        

        matchesContainer.addEventListener('click', async function (e) {
            if (e.target.classList.contains('delete-match')) {
                const id = e.target.getAttribute('data-id');
                await deleteData('matches', id);
                updateMatchesList();
            }
        });

        updateMatchesList();
    }


});
