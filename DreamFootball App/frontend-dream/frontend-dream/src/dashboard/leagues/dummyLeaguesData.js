export const dummyLeaguesData = [
    {
      leagueName: "Premier League",
      startDate: "2024-01-10",
      endDate: "2024-06-15",
      teams: [1, 2, 3], // Use ObjectIds of teams
      matches: [
        {
          teamA: 1, // ObjectId of Team A
          teamB: 2, // ObjectId of Team B
          score: { teamA: 2, teamB: 1 },
          scorers: [
            { player: "Alice Johnson", team: 1 },
            { player: "David Wilson", team: 1},
            { player: "Frank Miller", team: 2 },
          ],
          date: "2024-02-15",
        },
      ],
    },
    {
      leagueName: "Champions League",
      startDate: "2024-03-05",
      endDate: "2024-07-30",
      teams: [3, 4, 5],
      matches: [
        {
          teamA: 3,
          teamB: 4,
          score: { teamA: 1, teamB: 1 },
          scorers: [
            { player: "Noah Lewis", team: 3 },
            { player: "Sophia Young", team: 4 },
          ],
          date: "2024-04-25",
        },
        {
          teamA: 2,
          teamB: 1,
          score: { teamA: 1, teamB: 2 },
          scorers: [
            { player: "Moh has", team: 1 },
            { player: "Jophia oung", team: 2 },
          ],
          date: "2024-05-25",
        },
      ],
    },
  ];
  