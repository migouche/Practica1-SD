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
    function loadTeamLineup(teamId) {
        const soccerField = document.querySelector('.soccer-field');
        if (!soccerField) {
            console.warn("No soccer-field container found in the teams section.");
            return;
        }
        fetchData(`teams/${teamId}`).then(team => {
            console.log("Team fetched:", team);
            if (!team) return;
            let lineup = team.players;
            if (!lineup || Object.keys(lineup).length === 0) {
                const key = team.name.trim().toLowerCase();
                if (defaultTeamLineups[key]) {
                    lineup = defaultTeamLineups[key];
                    console.log("Using default lineup for", key, lineup);
                } else {
                    lineup = defaultLineup;
                    console.log("No default lineup for", key, "using empty lineup", lineup);
                }
            } else {
                console.log("Using team.players:", lineup);
            }
            const positions = soccerField.querySelectorAll('.position');
            console.log("Positions found:", positions.length);
            positions.forEach(posEl => {
                const pos = posEl.getAttribute('data-position');
                // Actualizamos el texto: si la plantilla tiene el valor, se muestra; si no, se muestra la posición
                posEl.textContent = lineup[pos] || pos;
            });
        }).catch(error => {
            console.error("Error loading team lineup:", error);
        });
    }
    
    document.addEventListener('DOMContentLoaded', function () {
        const teamsView = document.getElementById('teams-view');
        if (teamsView) {
            const params = new URLSearchParams(window.location.search);
            const teamId = params.get('teamId');
            if (teamId) {
                console.log("Reading teamId from URL:", teamId);
                loadTeamLineup(parseInt(teamId));
            }
        }
    });

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
                    <button data-id="${team.id}" class="show-lineup">Show Lineup</button>
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
            if (e.target.classList.contains('show-lineup')) {
                console.log("Show Lineup button clicked, team id:", e.target.getAttribute('data-id'));
                const id = e.target.getAttribute('data-id');
                // En lugar de redirigir, mostramos directamente la alineación
                loadTeamLineup(parseInt(id));
                // Aseguramos que el apartado de la alineación esté visible
                document.getElementById('players-field').style.display = 'block';
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

            if (!date || !time || !team1Name || !team2Name || !tournamentName) {
                showModal('Please fill in all fields.');
                return;
            }

            // First, find the teams by name
            const teams = await fetchData('teams');
            const teamsArray = Object.values(teams);

            const tournamentsArray = await fetchData('tournaments').then(res => Object.values(res));
            
            const team1 = teamsArray.find(t => t.name === team1Name);
            const team2 = teamsArray.find(t => t.name === team2Name);

            const tournament = tournamentsArray.find(t => t.name === tournamentName);
            
            
            if (!team1 || !team2) {
                showModal("One or both teams don't exist. Please create them first.");
                return;
            }

            if (team1.id === team2.id) {
                showModal("A team cannot play against itself.");
                return;
            }
            if (!tournament) {
                showModal("Tournament not found. Please create it first.")
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

    function showModal(message) {
        const modal = document.getElementById('modal-alert');
        const modalMessage = document.getElementById('modal-message');
        modalMessage.textContent = message;
        modal.style.display = "block";
      }
      
      function hideModal() {
        const modal = document.getElementById('modal-alert');
        modal.style.display = "none";
      }
      
      // Cerrar el modal al hacer clic en la 'X'
      document.getElementById('modal-close').addEventListener('click', hideModal);


});

const defaultLineup = {
    GK: "",
    LB: "",
    CB1: "",
    CB2: "",
    RB: "",
    LM: "",
    CM1: "",
    CM2: "",
    RM: "",
    ST1: "",
    ST2: ""
  };

  const defaultTeamLineups = {
    "barcelona": {
      GK: "Ter Stegen",
      LB: "Balde",
      CB1: "Cubarsí",
      CB2: "I.Martinez",
      RB: "Kounde",
      LM: "Fati",
      CM1: "Pedri",
      CM2: "De Jong",
      RM: "Lamine Yamal",
      ST1: "Lewandowski",
      ST2: "Rapinha"
    },
    "realmadrid": {
      GK: "Courtois",
      LB: "medy",
      CB1: "Rudiger",
      CB2: "Militao",
      RB: "carvajal",
      LM: "Vinicius",
      CM1: "Tchouameni",
      CM2: "Modric",
      RM: "Valverde",
      ST1: "Bellingham",
      ST2: "Mbappe"
    },

    "atleticodemadrid": {
      GK: "Oblak",
      LB: "Reinildo",
      CB1: "Gimenez",
      CB2: "Lenglet",
      RB: "Molina",
      LM: "Lino",
      CM1: "Barrios",
      CM2: "De Paul",
      RM: "LLorente",
      ST1: "Julian Alvarez",
      ST2: "Griezmann"
    },

    "liverpool": {
        GK: "Alisson",
        LB: "Robertson",
        CB1: "Van Dijk",
        CB2: "Konate",
        RB: "Alexander-Arnold",
        LM: "Gakpo",
        CM1: "McAllister",
        CM2: "Thiago",
        RM: "Salah",
        ST1: "Nunez",
        ST2: "Jota"
        },

    "borusia": {
        GK: "Kobel",
        LB: "Guerreiro",
        CB1: "Hummels",
        CB2: "Schlotterbeck",
        RB: "Meunier",
        LM: "Brandt",
        CM1: "Bellingham",
        CM2: "Witsel",
        RM: "Reus",
        ST1: "Haaland",
        ST2: "Moukoko"
    },

    "milan": {
        GK: "Maignan",
        LB: "Hernandez",
        CB1: "Tomori",
        CB2: "Kalulu",
        RB: "Florenzi",
        LM: "Leao",
        CM1: "Tonali",
        CM2: "Kessie",
        RM: "Saelemaekers",
        ST1: "Giroud",
        ST2: "Ibrahimovic"
    },

    "monaco": {
        GK: "Nübel",
        LB: "Henrichs",
        CB1: "Disasi",
        CB2: "Badiashile",
        RB: "Maripan",
        LM: "Golovin",
        CM1: "Tchouameni",
        CM2: "Fofana",
        RM: "Diatta",
        ST1: "Ben Yedder",
        ST2: "Boadu"
    },

    "betis": {
        GK: "Bravo",
        LB: "Miranda",
        CB1: "Pezzella",
        CB2: "Bartra",
        RB: "Emerson",
        LM: "Rodriguez",
        CM1: "Guido Rodriguez",
        CM2: "Canales",
        RM: "Fekir",
        ST1: "Borja Iglesias",
        ST2: "Juanmi"
    }
  };



