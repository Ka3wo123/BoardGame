import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    pl: {
        translation: {
            nav: {
                games: "Kolekcja gier",
                drawing: "Losowanie",
                tournaments: "Turnieje",
                events: "Wydarzenia",
                community: "Społeczność"
            },
            theme: {
                light: "Tryb jasny",
                dark: "Tryb ciemny",
                lightTitle: "Włącz tryb jasny",
                darkTitle: "Włącz tryb ciemny"
            },
            user: {
                logout: "Wyloguj"
            },
            notFound: {
                title: "404",
                subtitle: "Rzut nieudany! Strona nie istnieje",
                description: "Wygląda na to, że ta ścieżka nie znajduje się na naszej planszy. Mogła zostać przeniesiona lub po prostu nigdy nie istniała.",
                btnBack: "Wróć",
                btnHome: "Strona główna"
            },
            events: {
                title: "Wydarzenia",
                newEvent: "Nowe wydarzenie",
                form: {
                    name: "Nazwa",
                    desc: "Opis",
                    location: "Lokalizacja",
                    date: "Data",
                    from: "Od",
                    to: "Do",
                    plannedGames: "Planowane gry (po przecinku)",
                    btnCreate: "Utwórz wydarzenie"
                },
                sections: {
                    upcoming: "Nadchodzące",
                    noUpcoming: "Brak nadchodzących.",
                    past: "Zakończone / Anulowane",
                    noPast: "Brak."
                },
                details: {
                    emptyStateTitle: "Wybierz wydarzenie z listy",
                    emptyStateDesc: "lub utwórz nowe, aby zobaczyć szczegóły",
                    btnComplete: "Zakończ",
                    btnCancelEvent: "Anuluj wydarzenie",
                    btnDelete: "Usuń",
                    addAttendee: "Dodaj uczestnika",
                    btnAdd: "Dodaj",
                    attendanceList: "Lista obecności",
                    noAttendees: "Brak uczestników.",
                    attendeesCount: "Uczestników"
                },
                status: {
                    Planned: "Zaplanowane",
                    Confirmed: "Potwierdzone",
                    InProgress: "W trakcie",
                    Completed: "Zakończone",
                    Cancelled: "Anulowane"
                },
                attendeeStatus: {
                    Pending: "Oczekuje",
                    Confirmed: "Potwierdził",
                    Declined: "Odrzucił",
                    Maybe: "Może"
                },
                toasts: {
                    created: 'Wydarzenie "{{name}}" utworzone!', // i18next używa podwójnych klamer {{ }} do zmiennych
                    attendeeAdded: "Uczestnik dodany.",
                    statusChanged: "Status zmieniony na: {{status}}.",
                    deleted: "Wydarzenie usunięte."
                }
            },
            community: {
                title: "Społeczność",
                newPlayer: "Nowy gracz",
                nickname: "Nick",
                fullName: "Imię i nazwisko",
                ownedGamesLabel: "Posiadane gry (po przecinku)",
                favoriteGamesLabel: "Ulubione gry (po przecinku)",
                btnAddPlayer: "Dodaj gracza",
                btnAdd: "+ Dodaj",
                playersTitle: "Gracze",
                myPlayers: "Moi gracze",
                noPlayers: "Brak graczy.",
                noPlayersAddFirst: "Dodaj najpierw gracza.",
                gamesCount: "Gier: {{count}}",
                gamesShort: "gier",
                none: "Brak.",
                ownedGames: "Posiadane gry",
                favoriteGames: "Ulubione gry",
                inPlayerList: "Na liście graczy",
                emptyStateTitle: "Wybierz gracza z listy",
                emptyStateDesc: "lub dodaj nowego, aby zobaczyć profil",
                friends: "Znajomi",
                requests: "Zaproszenia",
                exchangeOfferGive: "Oferuję",
                exchangeWantGame: "Szukam",
                form: {
                    nicknameLabel: "Nick *",
                    nicknamePlaceholder: "Np. Gracz123",
                    fullNamePlaceholder: "Np. Jan Kowalski",
                    ownedGamesLabel: "Posiadane gry (po przecinku)",
                    favoriteGamesLabel: "Ulubione gry (po przecinku)"
                },
                search: {
                    placeholder: "Szukaj gracza lub użytkownika...",
                    noResults: "Brak wyników.",
                    games: "gier",
                    profile: "Profil",
                    addFriend: "Dodaj znajomego",
                    sent: "Wysłano",
                    friend: "Znajomy",
                    awaitingYou: "Czeka na Ciebie",
                    addAsPlayer: "Dodaj do graczy"
                },
                profile: {
                    communityProfile: "Profil społeczności",
                    platformUser: "Użytkownik platformy",
                    yourPlayer: "Twój gracz",
                    addAsPlayer: "Dodaj jako gracza"
                },
                actions: {
                    recommendations: "Rekomendacje",
                    deletePlayer: "Usuń gracza"
                },
                stats: {
                    title: "Statystyki",
                    played: "Rozegranych",
                    won: "Wygranych",
                    attended: "Wydarzeń"
                },
                games: {
                    owned: "Posiadane gry",
                    favorite: "Ulubione gry",
                    none: "Brak."
                },
                exchange: {
                    title: "Wymiana gier",
                    offered: "Oferuję",
                    offered: "Oferuję",
                    wanted: "Szukam",
                    btnAdd: "+ Dodaj",
                    activeOffers: "Aktywne oferty",
                    noOffers: "Brak ofert.",
                    offeredPlaceholder: "Tytuł gry",
                    wantedPlaceholder: "Tytuł gry"
                },
                recommendations: {
                    title: "Rekomendacje",
                    basedOn: 'Na podstawie "{{game}}" polecamy: {{game}} II, {{game}} – Rozszerzenie, Inne gry w stylu {{game}}.',
                    empty: "Dodaj ulubione gry gracza, aby wygenerować rekomendacje."
                },
                toasts: {
                    playerAdded: 'Gracz "{{nickname}}" dodany.',
                    playerDeleted: "Gracz usunięty.",
                    offerAdded: "Oferta wymiany dodana."
                },
                toasts2: {
                    requestSent: "Zaproszenie wysłane.",
                    requestAccepted: "Zaproszenie przyjęte!",
                    requestDeclined: "Zaproszenie odrzucone.",
                    addedToPlayers: 'Dodano "{{nickname}}" do graczy.',
                    nicknameRequired: "Nick jest wymagany.",
                    playerRemoved: "Gracz usunięty."
                }
            },
            drawing: {
                title: "Losowanie gier",
                headerTitle: "Losowanie planszówek",
                headerSubtitle: "Wylosuj gry na dzisiejszy wieczór",
                subtitle: "Wylosuj kolejność gier spośród dostępnych w kolekcji.",
                configTitle: "Konfiguracja",
                minPlayersLabel: "Minimalna liczba graczy",
                minPlayersCfg: "Minimalna liczba graczy",
                selectionPreference: "Preferencja doboru",
                btnDraw: "Losuj",
                btnDrawGames: "Losuj planszówki",
                btnReroll: "Losuj ponownie",
                btnConfirm: "Potwierdzam!",
                resultsTitle: "Wylosowane gry",
                resultsFound: "gier",
                sessionTime: "Szacowany czas sesji",
                hoursShort: "h",
                boardGame: "Gra planszowa",
                players: "graczy",
                placeholderText: "Skonfiguruj kryteria i kliknij",
                sessionConfirmed: "Sesja potwierdzona! Miłej gry!",
                emptyForPlayers: "Brak dostępnych gier dla ",
                emptyPlayersSuffix: "graczy.",
                emptyHint: "Dodaj gry do kolekcji lub zmień kryteria.",
                emptyState: "Żadna gra nie spełnia kryteriów (dostępna + min. {{count}} graczy).",
                totalTime: "Łączny czas: ",
                weighting: {
                    random: "Losowo",
                    preferShort: "Preferuj krótkie",
                    preferLong: "Preferuj długie",
                    preferHard: "Preferuj trudne"
                },
                complexity: {
                    easy: "Łatwa",
                    medium: "Średnia",
                    hard: "Trudna",
                    expert: "Ekspercka"
                },
                toasts: {
                    noGames: "Brak dostępnych gier dla podanej liczby graczy.",
                    success: "Wylosowano {{count}} gier.",
                    confirmed: "Sesja gier zatwierdzona!"
                }
            },
            tournaments: {
                title: "Turnieje",
                newTournament: "Nowy turniej",
                nameLabel: "Nazwa turnieju",
                gameLabel: "Gra",
                typeLabel: "Typ",
                typeCup: "Puchar",
                typeLeague: "Liga",
                playersLabel: "Gracze (po przecinku)",
                btnCreate: "Utwórz turniej",
                listTitle: "Lista turniejów",
                noTournaments: "Brak turniejów.",
                playersCount: "Graczy: {{count}}",
                emptyStateTitle: "Wybierz turniej z listy",
                emptyStateDesc: "lub utwórz nowy, aby zobaczyć szczegóły",
                actions: {
                    generateBracket: "Generuj drabinkę",
                    deleteTournament: "Usuń turniej"
                },
                matches: {
                    title: "Mecze",
                    noMatches: 'Brak meczów. Kliknij "Generuj drabinkę".',
                    btnResult: "Wynik",
                    scoreTitle: "Wynik: ",
                    btnSave: "Zapisz",
                    btnCancel: "Anuluj"
                },
                table: {
                    title: "Tabela ligowa",
                    thPlayer: "Gracz",
                    thPlayed: "M",
                    thWins: "W",
                    thDraws: "R",
                    thLosses: "P",
                    thPoints: "Pkt"
                },
                toasts: {
                    minPlayers: "Potrzeba minimum 2 graczy!",
                    created: 'Turniej "{{name}}" utworzony z {{count}} graczami.',
                    bracketGenerated: "Drabinka wygenerowana.",
                    deleted: "Turniej usunięty.",
                    scoreSaved: "Wynik meczu zapisany."
                }
            },
            games: {
                title: "Kolekcja gier",
                libraryTitle: "Biblioteka gier",
                total: "gier",
                btnAdd: "Dodaj grę",
                filterLabel: "Filtruj – min. graczy:",
                emptyState: "Brak gier w kolekcji.",
                filters: {
                    playersLabel: "Gracze",
                    any: "Dowolna",
                    players: "graczy",
                    availabilityLabel: "Dostępność",
                    all: "Wszystkie",
                    available: "Dostępna",
                    inUse: "W użyciu",
                    service: "Serwis"
                },
                editForm: {
                    titleNew: "Nowa gra",
                    titleEdit: "Edytuj grę",
                    subtitle: "Uzupełnij dane gry",
                    gameTitle: "Tytuł *",
                    gameTitlePlaceholder: "Np. Catan, Wingspan...",
                    description: "Opis",
                    descriptionPlaceholder: "Krótki opis gry...",
                    minPlayers: "Min. graczy",
                    maxPlayers: "Max. graczy",
                    playTime: "Czas (min)",
                    difficulty: "Trudność",
                    cover: "Kolor okładki",
                    statusLabel: "Status",
                    save: "Zapisz",
                    cancel: "Anuluj",
                    removeFromCatalog: "Usuń z katalogu",
                    emptyRight: "Kliknij grę, aby edytować"
                },
                complexity: {
                    easy: "Łatwa",
                    medium: "Średnia",
                    hard: "Trudna",
                    expert: "Ekspercka"
                },
                status: {
                    available: "Dostępna",
                    inUse: "W użyciu",
                    service: "Serwis",
                    descAvailable: "Gra gotowa do użycia",
                    descInUse: "Aktualnie wypożyczona",
                    descService: "W naprawie / niedostępna"
                },
                form: {
                    titleNew: "Nowa gra",
                    titleEdit: "Edytuj grę",
                    labelTitle: "Tytuł *",
                    labelDesc: "Opis",
                    labelPlayers: "Liczba graczy",
                    labelHours: "Czas (h)",
                    labelAccessibility: "Dostępna (uwzględniaj w losowaniu)",
                    btnSubmitEdit: "Zapisz zmiany",
                    btnSubmitNew: "Dodaj grę",
                    btnCancel: "Anuluj"
                },
                card: {
                    playersCount: "{{count}} graczy",
                    hoursCount: "{{count}}h",
                    statusAvailable: "✅ Dostępna",
                    statusUnavailable: "🚫 Niedostępna",
                    titleEdit: "Edytuj",
                    titleDelete: "Usuń"
                },
                toasts: {
                    requiredTitle: "Tytuł jest wymagany.",
                    updated: 'Zaktualizowano "{{title}}".',
                    added: 'Dodano "{{title}}".',
                    deleted: 'Usunięto "{{title}}".',
                    archived: 'Usunięto "{{title}}" z katalogu.'
                }
            },
            login: {
                themeLight: "Tryb jasny",
                themeDark: "Tryb ciemny",
                themeLightTitle: "Włącz tryb jasny",
                themeDarkTitle: "Włącz tryb ciemny",
                changeLanguage: "Zmień język",
                logoSubtitle: "Twoja platforma gier planszowych",
                features: {
                    catalogTitle: "Katalog Gier",
                    catalogDesc: "Baza z tagami, ocenami i filtrowaniem",
                    drawTitle: "Losowanie Tytułu",
                    drawDesc: "Inteligentny dobór gry wg liczby graczy",
                    tournamentsTitle: "Turnieje",
                    tournamentsDesc: "Drabinki pucharowe i ligi",
                    eventsTitle: "Wydarzenia",
                    eventsDesc: "Spotkania i listy obecności",
                    communityTitle: "Społeczność",
                    communityDesc: "Profile graczy i wymiana gier"
                },
                card: {
                    welcome: "Witaj w ",
                    subtitleLogin: "Zaloguj się, aby kontynuować",
                    subtitleRegister: "Utwórz nowe konto",
                    tabLogin: "Logowanie",
                    tabRegister: "Rejestracja",
                    labelDisplayName: "Wyświetlana nazwa (nick) *",
                    placeholderDisplayName: "Twój nick",
                    labelFullName: "Imię i nazwisko",
                    placeholderFullName: "np. Jan Kowalski",
                    labelEmail: "Adres e-mail",
                    labelPassword: "Hasło",
                    labelConfirmPassword: "Potwierdź hasło",
                    btnLogin: "Zaloguj się",
                    btnRegister: "Utwórz konto",
                    loadingLogin: "Logowanie...",
                    loadingRegister: "Tworzenie...",
                    demo: "Demo:",
                    registerHint: "Rejestracja tworzy nowe konto lokalnie."
                },
                errors: {
                    requiredPassword: "Podaj hasło!",
                    invalidCredentials: "Nieprawidłowy email lub hasło.",
                    connectionError: "Błąd połączenia: {{message}}",
                    passwordLength: "Hasło musi mieć minimum 6 znaków.",
                    passwordsNotMatch: "Hasła nie są identyczne!",
                    genericError: "Błąd: {{message}}"
                },
                messages: {
                    accountCreated: 'Konto "{{name}}" utworzone! Możesz się teraz zalogować.'
                }
            }
        }

    },
    en: {
        translation: {
            nav: {
                games: "Game Collection",
                drawing: "Draw",
                tournaments: "Tournaments",
                events: "Events",
                community: "Community"
            },
            theme: {
                light: "Light Mode",
                dark: "Dark Mode",
                lightTitle: "Switch to light mode",
                darkTitle: "Switch to dark mode"
            },
            user: {
                logout: "Log out"
            },
            notFound: {
                title: "404",
                subtitle: "Critical miss! Page doesn't exist",
                description: "It looks like this path is not on our board. It might have been moved or never existed in the first place.",
                btnBack: "Go Back",
                btnHome: "Home Page"
            },
            events: {
                title: "Events",
                newEvent: "New Event",
                form: {
                    name: "Name",
                    desc: "Description",
                    location: "Location",
                    date: "Date",
                    from: "From",
                    to: "To",
                    plannedGames: "Planned games (comma separated)",
                    btnCreate: "Create Event"
                },
                sections: {
                    upcoming: "Upcoming",
                    noUpcoming: "No upcoming events.",
                    past: "Completed / Cancelled",
                    noPast: "None."
                },
                details: {
                    emptyStateTitle: "Select an event from the list",
                    emptyStateDesc: "or create a new one to see details",
                    btnComplete: "Complete",
                    btnCancelEvent: "Cancel Event",
                    btnDelete: "Delete",
                    addAttendee: "Add attendee",
                    btnAdd: "Add",
                    attendanceList: "Attendance list",
                    noAttendees: "No attendees.",
                    attendeesCount: "Attendees"
                },
                status: {
                    Planned: "Planned",
                    Confirmed: "Confirmed",
                    InProgress: "In Progress",
                    Completed: "Completed",
                    Cancelled: "Cancelled"
                },
                attendeeStatus: {
                    Pending: "Pending",
                    Confirmed: "Confirmed",
                    Declined: "Declined",
                    Maybe: "Maybe"
                },
                toasts: {
                    created: 'Event "{{name}}" created!',
                    attendeeAdded: "Attendee added.",
                    statusChanged: "Status changed to: {{status}}.",
                    deleted: "Event deleted."
                }
            },
            community: {
                title: "Community",
                newPlayer: "New Player",
                nickname: "Nickname",
                fullName: "Full Name",
                ownedGamesLabel: "Owned games (comma separated)",
                favoriteGamesLabel: "Favorite games (comma separated)",
                btnAddPlayer: "Add Player",
                btnAdd: "+ Add",
                playersTitle: "Players",
                myPlayers: "My Players",
                noPlayers: "No players.",
                noPlayersAddFirst: "Add a player first.",
                gamesCount: "Games: {{count}}",
                gamesShort: "games",
                none: "None.",
                ownedGames: "Owned games",
                favoriteGames: "Favorite games",
                inPlayerList: "In player list",
                emptyStateTitle: "Select a player from the list",
                emptyStateDesc: "or add a new one to see profile",
                friends: "Friends",
                requests: "Requests",
                exchangeOfferGive: "Offering",
                exchangeWantGame: "Looking for",
                form: {
                    nicknameLabel: "Nickname *",
                    nicknamePlaceholder: "E.g. Player123",
                    fullNamePlaceholder: "E.g. John Smith",
                    ownedGamesLabel: "Owned games (comma separated)",
                    favoriteGamesLabel: "Favorite games (comma separated)"
                },
                search: {
                    placeholder: "Search player or user...",
                    noResults: "No results.",
                    games: "games",
                    profile: "Profile",
                    addFriend: "Add friend",
                    sent: "Sent",
                    friend: "Friend",
                    awaitingYou: "Awaiting you",
                    addAsPlayer: "Add to players"
                },
                profile: {
                    communityProfile: "Community profile",
                    platformUser: "Platform user",
                    yourPlayer: "Your player",
                    addAsPlayer: "Add as player"
                },
                actions: {
                    recommendations: "Recommendations",
                    deletePlayer: "Delete Player"
                },
                stats: {
                    title: "Statistics",
                    played: "Played",
                    won: "Won",
                    attended: "Events"
                },
                games: {
                    owned: "Owned games",
                    favorite: "Favorite games",
                    none: "None."
                },
                exchange: {
                    title: "Game Exchange",
                    offered: "Offering",
                    wanted: "Looking for",
                    btnAdd: "+ Add",
                    activeOffers: "Active Offers",
                    noOffers: "No offers.",
                    offeredPlaceholder: "Game title",
                    wantedPlaceholder: "Game title"
                },
                recommendations: {
                    title: "Recommendations",
                    basedOn: 'Based on "{{game}}" we recommend: {{game}} II, {{game}} – Expansion, Other games like {{game}}.',
                    empty: "Add player's favorite games to generate recommendations."
                },
                toasts: {
                    playerAdded: 'Player "{{nickname}}" added.',
                    playerDeleted: "Player deleted.",
                    offerAdded: "Exchange offer added."
                },
                toasts2: {
                    requestSent: "Friend request sent.",
                    requestAccepted: "Friend request accepted!",
                    requestDeclined: "Friend request declined.",
                    addedToPlayers: 'Added "{{nickname}}" to players.',
                    nicknameRequired: "Nickname is required.",
                    playerRemoved: "Player removed."
                }
            },
            drawing: {
                title: "Game Draw",
                headerTitle: "Board Game Draw",
                headerSubtitle: "Draw games for tonight",
                subtitle: "Draw the order of games from those available in the collection.",
                configTitle: "Configuration",
                minPlayersLabel: "Minimum number of players",
                minPlayersCfg: "Minimum number of players",
                selectionPreference: "Selection preference",
                btnDraw: "Draw",
                btnDrawGames: "Draw games",
                btnReroll: "Re-roll",
                btnConfirm: "Confirm!",
                resultsTitle: "Drawn games",
                resultsFound: "games",
                sessionTime: "Estimated session time",
                hoursShort: "h",
                boardGame: "Board game",
                players: "players",
                placeholderText: "Configure criteria and click",
                sessionConfirmed: "Session confirmed! Have fun!",
                emptyForPlayers: "No available games for ",
                emptyPlayersSuffix: "players.",
                emptyHint: "Add games to the collection or change criteria.",
                emptyState: "No game meets the criteria (available + min. {{count}} players).",
                totalTime: "Total time: ",
                weighting: {
                    random: "Random",
                    preferShort: "Prefer short",
                    preferLong: "Prefer long",
                    preferHard: "Prefer hard"
                },
                complexity: {
                    easy: "Easy",
                    medium: "Medium",
                    hard: "Hard",
                    expert: "Expert"
                },
                toasts: {
                    noGames: "No available games for the specified number of players.",
                    success: "Successfully drawn {{count}} games.",
                    confirmed: "Game session confirmed!"
                }
            },
            tournaments: {
                title: "Tournaments",
                newTournament: "New Tournament",
                nameLabel: "Tournament Name",
                gameLabel: "Game",
                typeLabel: "Type",
                typeCup: "Cup",
                typeLeague: "League",
                playersLabel: "Players (comma separated)",
                btnCreate: "Create Tournament",
                listTitle: "Tournament List",
                noTournaments: "No tournaments.",
                playersCount: "Players: {{count}}",
                emptyStateTitle: "Select a tournament from the list",
                emptyStateDesc: "or create a new one to see details",
                actions: {
                    generateBracket: "Generate Bracket",
                    deleteTournament: "Delete Tournament"
                },
                matches: {
                    title: "Matches",
                    noMatches: 'No matches. Click "Generate Bracket".',
                    btnResult: "Result",
                    scoreTitle: "Result: ",
                    btnSave: "Save",
                    btnCancel: "Cancel"
                },
                table: {
                    title: "League Standings",
                    thPlayer: "Player",
                    thPlayed: "P",
                    thWins: "W",
                    thDraws: "D",
                    thLosses: "L",
                    thPoints: "Pts"
                },
                toasts: {
                    minPlayers: "At least 2 players are required!",
                    created: 'Tournament "{{name}}" created with {{count}} players.',
                    bracketGenerated: "Bracket generated.",
                    deleted: "Tournament deleted.",
                    scoreSaved: "Match score saved."
                }
            },
            games: {
                title: "Game Collection",
                libraryTitle: "Game Library",
                total: "games",
                btnAdd: "Add game",
                filterLabel: "Filter – min. players:",
                emptyState: "No games in the collection.",
                filters: {
                    playersLabel: "Players",
                    any: "Any",
                    players: "players",
                    availabilityLabel: "Availability",
                    all: "All",
                    available: "Available",
                    inUse: "In Use",
                    service: "Maintenance"
                },
                editForm: {
                    titleNew: "New Game",
                    titleEdit: "Edit Game",
                    subtitle: "Fill in the game details",
                    gameTitle: "Title *",
                    gameTitlePlaceholder: "E.g. Catan, Wingspan...",
                    description: "Description",
                    descriptionPlaceholder: "Short game description...",
                    minPlayers: "Min. players",
                    maxPlayers: "Max. players",
                    playTime: "Play time (min)",
                    difficulty: "Difficulty",
                    cover: "Cover color",
                    statusLabel: "Status",
                    save: "Save",
                    cancel: "Cancel",
                    removeFromCatalog: "Remove from catalog",
                    emptyRight: "Click a game to edit"
                },
                complexity: {
                    easy: "Easy",
                    medium: "Medium",
                    hard: "Hard",
                    expert: "Expert"
                },
                status: {
                    available: "Available",
                    inUse: "In Use",
                    service: "Maintenance",
                    descAvailable: "Game ready to use",
                    descInUse: "Currently borrowed",
                    descService: "Under repair / unavailable"
                },
                form: {
                    titleNew: "New Game",
                    titleEdit: "Edit Game",
                    labelTitle: "Title *",
                    labelDesc: "Description",
                    labelPlayers: "Number of players",
                    labelHours: "Time (h)",
                    labelAccessibility: "Available (include in drawing)",
                    btnSubmitEdit: "Save changes",
                    btnSubmitNew: "Add game",
                    btnCancel: "Cancel"
                },
                card: {
                    playersCount: "{{count}} players",
                    hoursCount: "{{count}}h",
                    statusAvailable: "✅ Available",
                    statusUnavailable: "🚫 Unavailable",
                    titleEdit: "Edit",
                    titleDelete: "Delete"
                },
                toasts: {
                    requiredTitle: "Title is required.",
                    updated: 'Updated "{{title}}".',
                    added: 'Added "{{title}}".',
                    deleted: 'Deleted "{{title}}".',
                    archived: 'Removed "{{title}}" from catalog.'
                }
            },
            login: {
                themeLight: "Light mode",
                themeDark: "Dark mode",
                themeLightTitle: "Switch to light mode",
                themeDarkTitle: "Switch to dark mode",
                changeLanguage: "Change language",
                logoSubtitle: "Your board games platform",
                features: {
                    catalogTitle: "Game Catalog",
                    catalogDesc: "Database with tags, ratings, and filtering",
                    drawTitle: "Game Draw",
                    drawDesc: "Smart game selection by player count",
                    tournamentsTitle: "Tournaments",
                    tournamentsDesc: "Cup brackets and leagues",
                    eventsTitle: "Events",
                    eventsDesc: "Meetings and attendance lists",
                    communityTitle: "Community",
                    communityDesc: "Player profiles and game trading"
                },
                card: {
                    welcome: "Welcome to ",
                    subtitleLogin: "Log in to continue",
                    subtitleRegister: "Create a new account",
                    tabLogin: "Login",
                    tabRegister: "Register",
                    labelDisplayName: "Display name (nick) *",
                    placeholderDisplayName: "Your nick",
                    labelFullName: "Full name",
                    placeholderFullName: "e.g. John Smith",
                    labelEmail: "E-mail address",
                    labelPassword: "Password",
                    labelConfirmPassword: "Confirm password",
                    btnLogin: "Log In",
                    btnRegister: "Create Account",
                    loadingLogin: "Logging in...",
                    loadingRegister: "Creating...",
                    demo: "Demo:",
                    registerHint: "Registration creates a new local account."
                },
                errors: {
                    requiredPassword: "Password is required!",
                    invalidCredentials: "Invalid e-mail or password.",
                    connectionError: "Connection error: {{message}}",
                    passwordLength: "Password must be at least 6 characters long.",
                    passwordsNotMatch: "Passwords do not match!",
                    genericError: "Error: {{message}}"
                },
                messages: {
                    accountCreated: 'Account "{{name}}" created! You can now log in.'
                }
            }
        }
    }
};

const savedLanguage = localStorage.getItem('app_lang') || 'pl';


i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: savedLanguage,
        fallbackLng: 'pl',
        interpolation: {
            escapeValue: false
        }
    });

i18n.on('languageChanged', (lng) => {
    localStorage.setItem('app_lang', lng);
});

export default i18n;