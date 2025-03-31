document.addEventListener('DOMContentLoaded', function () {
    const API_BASE_URL = 'http://localhost:8080/api';

    // Diccionario de equipos conocidos y sus archivos de imagen (las claves deben ser en minúsculas)
    const knownTeamsLogos = {
        "atleticodemadrid": "atleticodemadrid.JPG",
        "barcelona": "barcelona.JPG",
        "bayern": "bayern.JPEG",
        "betis": "betis.JPG",
        "borusia": "borusia.JPG",
        "liverpool": "liverpool.JPG",
        "milan": "milan.JPG",
        "monaco": "monaco.JPG",
        "psg": "psg.JPG",
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
            const badge = 'logos/default.png'; // Replace with logic for badge if needed
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
            const team1 = document.getElementById('match-team1').value;
            const team2 = document.getElementById('match-team2').value;
            const tournamentName = document.getElementById('match-tournament').value;

            const match = { date, time, team1, team2, tournamentName };
            await postData('matches', match);
            updateMatchesList();
            matchForm.reset();
        });

        async function updateMatchesList() {
            const matches = await fetchData('matches');
            const matchesArray = Object.values(matches);
            matchesContainer.innerHTML = '';
            matchesArray.forEach(match => {
                const team1Logo = knownTeamsLogos[match.team1.toLowerCase()] || 'logos/default.png';
                const team2Logo = knownTeamsLogos[match.team2.toLowerCase()] || 'logos/default.png';

                const div = document.createElement('div');
                div.classList.add('list-item');
                div.innerHTML = `
                    <div class="match-card">
                        <img src="${team1Logo}" alt="${match.team1}" class="team-logo">
                        <span>vs</span>
                        <img src="${team2Logo}" alt="${match.team2}" class="team-logo">
                        <div class="match-details">
                            <p><strong>Tournament:</strong> ${match.tournamentName}</p>
                            <p><strong>Date:</strong> ${match.date} - <strong>Time:</strong> ${match.time}</p>
                        </div>
                        <button data-id="${match.id}" class="delete-match">Delete</button>
                    </div>
                `;
                matchesContainer.appendChild(div);
            });
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
