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
            lang: {
                toEnglish: "English",
                toPolish: "Polski",
                switchToEnglish: "Switch to English",
                switchToPolish: "Zmień na Polski"
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
                    btnCreate: "Utwórz wydarzenie",
                    namePlaceholder: "Nazwa wydarzenia...",
                    descPlaceholder: "Krótki opis...",
                    locationPlaceholder: "np. Dom, klub, kawiarnia",
                    plannedGamesLabel: "Planowane gry",
                    plannedGamesPlaceholder: "np. Catan, Pandemic...",
                    invitePlayers: "Zaproś graczy",
                    optional: "opcjonalnie",
                    searchCommunity: "Szukaj ze społeczności...",
                    orManual: "lub wpisz ręcznie",
                    you: "Ty",
                    autoAdded: "zostanie automatycznie dodany jako uczestnik."
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
                    attendeesCount: "Uczestników",
                    games: "Gry",
                    gamesShort: "gier",
                    searchPlayer: "Szukaj gracza ze społeczności...",
                    orManualName: "lub wpisz imię ręcznie"
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
                    deleted: "Wydarzenie usunięte.",
                    nameRequired: "Podaj nazwę wydarzenia."
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
                playersTitle: "Gracze",
                noPlayers: "Brak graczy.",
                gamesCount: "Gier: {{count}}",
                emptyStateTitle: "Wybierz gracza z listy",
                emptyStateDesc: "lub skorzystaj z wyszukiwarki powyżej",
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
                    wanted: "Szukam",
                    btnAdd: "+ Dodaj",
                    activeOffers: "Aktywne oferty",
                    noOffers: "Brak ofert."
                },
                recommendations: {
                    title: "Rekomendacje",
                    basedOn: 'Na podstawie "{{game}}" polecamy: {{game}} II, {{game}} – Rozszerzenie, Inne gry w stylu {{game}}.',
                    empty: "Dodaj ulubione gry gracza, aby wygenerować rekomendacje."
                },
                search: {
                    placeholder: "Szukaj gracza po nicku lub imieniu i nazwisku...",
                    noResults: "Brak wyników dla",
                    games: "Gier",
                    friend: "Znajomy",
                    addAsPlayer: "Dodaj do graczy",
                    sent: "Wysłano",
                    awaitingYou: "Czeka na Ciebie",
                    addFriend: "Dodaj do znajomych",
                    profile: "profil"
                },
                form: {
                    nicknameLabel: "NICK",
                    nicknamePlaceholder: "np. KingPawn99",
                    fullNamePlaceholder: "np. Jan Kowalski",
                    ownedGamesLabel: "Posiadane gry (po przecinku)",
                    favoriteGamesLabel: "Ulubione gry (po przecinku)"
                },
                myPlayers: "Moi gracze",
                noPlayersAddFirst: "Brak graczy. Dodaj pierwszego!",
                requests: "Zaproszenia",
                friends: "Znajomi",
                inPlayerList: "gracz na liście",
                btnAdd: "Dodaj",
                profile: {
                    platformUser: "Użytkownik platformy",
                    communityProfile: "Profil społeczności",
                    yourPlayer: "Twój gracz",
                    addAsPlayer: "Dodaj do graczy"
                },
                ownedGames: "Posiadane gry",
                favoriteGames: "Ulubione gry",
                none: "Brak.",
                gamesShort: "Gier",
                exchangeOfferGive: "Gra do oddania",
                exchangeWantGame: "Gra poszukiwana",
                toasts2: {
                    requestSent: "Zaproszenie wysłane!",
                    requestAccepted: "Zaproszenie zaakceptowane!",
                    requestDeclined: "Zaproszenie odrzucone.",
                    addedToPlayers: 'Gracz "{{nickname}}" dodany do Twoich graczy!',
                    nicknameRequired: "Nick jest wymagany.",
                    playerRemoved: "Gracz usunięty."
                },
                toasts: {
                    playerAdded: 'Gracz "{{nickname}}" dodany.',
                    playerDeleted: "Gracz usunięty.",
                    offerAdded: "Oferta wymiany dodana."
                }
            },
            drawing: {
                title: "Losowanie gier",
                subtitle: "Wylosuj kolejność gier spośród dostępnych w kolekcji.",
                minPlayersLabel: "Minimalna liczba graczy",
                btnDraw: "Losuj",
                emptyState: "Żadna gra nie spełnia kryteriów (dostępna + min. {{count}} graczy).",
                totalTime: "Łączny czas: ",
                headerTitle: "Losowanie gry",
                headerSubtitle: "Nie wiesz w co zagrać? Algorytm dobierze optymalne gry na podstawie liczby graczy i Twojej biblioteki.",
                configTitle: "Konfiguracja",
                minPlayersCfg: "MINIMALNA LICZBA GRACZY",
                selectionPreference: "PREFERENCJE DOBORU",
                btnDrawGames: "LOSUJ GRY",
                sessionTime: "CZAS SESJI",
                hoursShort: " godz.",
                resultsTitle: "Wylosowane gry",
                resultsFound: "ZNALEZIONYCH",
                boardGame: "Gra planszowa",
                players: "graczy",
                btnReroll: "LOSUJ PONOWNIE",
                btnConfirm: "POTWIERDŹ SESJĘ",
                sessionConfirmed: "Sesja potwierdzona!",
                emptyForPlayers: "Brak dostępnych gier dla ",
                emptyPlayersSuffix: "graczy.",
                emptyHint: "Dodaj gry do kolekcji lub zmień filtry.",
                placeholderText: "Skonfiguruj ustawienia i kliknij",
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
                    confirmed: "Sesja potwierdzona!"
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
                btnAdd: "Dodaj grę",
                filterLabel: "Filtruj – min. graczy:",
                emptyState: "Brak gier w kolekcji.",
                libraryTitle: "Biblioteka gier",
                total: "ŁĄCZNIE",
                filters: {
                    playersLabel: "LICZBA GRACZY",
                    any: "Dowolna",
                    players: "graczy",
                    availabilityLabel: "DOSTĘPNOŚĆ",
                    all: "Wszystkie",
                    available: "Dostępna",
                    inUse: "W użyciu",
                    service: "Serwis"
                },
                status: {
                    available: "DOSTĘPNA",
                    inUse: "W UŻYCIU",
                    service: "SERWIS",
                    descAvailable: "Gotowa do gry",
                    descInUse: "Aktualnie używana",
                    descService: "Uszkodzona lub brakuje części"
                },
                editForm: {
                    titleEdit: "Edytuj grę",
                    titleNew: "Nowa gra",
                    subtitle: "Uzupełnij informacje o grze i jej dostępności",
                    cancel: "Anuluj",
                    save: "Zapisz",
                    gameTitle: "TYTUŁ GRY",
                    gameTitlePlaceholder: "Nazwa gry",
                    description: "OPIS",
                    descriptionPlaceholder: "Krótki opis gry",
                    minPlayers: "MIN. GRACZY",
                    maxPlayers: "MAX. GRACZY",
                    playTime: "CZAS GRY (MIN)",
                    difficulty: "TRUDNOŚĆ",
                    cover: "OKŁADKA GRY",
                    statusLabel: "STATUS",
                    removeFromCatalog: "USUŃ Z KATALOGU",
                    emptyRight: "Wybierz grę z listy lub dodaj nową"
                },
                complexity: {
                    easy: "Łatwa",
                    medium: "Średnia",
                    hard: "Trudna",
                    expert: "Ekspercka"
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
                    archived: 'Zarchiwizowano "{{title}}".'
                }
            },
            login: {
                themeLight: "Tryb jasny",
                themeDark: "Tryb ciemny",
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
                    registerNote: "Rejestracja tworzy nowe konto lokalnie."
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
                games: "Game Library",
                drawing: "Drawing",
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
            lang: {
                toEnglish: "English",
                toPolish: "Polski",
                switchToEnglish: "Switch to English",
                switchToPolish: "Zmień na Polski"
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
                    btnCreate: "Create Event",
                    namePlaceholder: "Event name...",
                    descPlaceholder: "Short description...",
                    locationPlaceholder: "e.g. Home, club, cafe",
                    plannedGamesLabel: "Planned games",
                    plannedGamesPlaceholder: "e.g. Catan, Pandemic...",
                    invitePlayers: "Invite players",
                    optional: "optional",
                    searchCommunity: "Search community...",
                    orManual: "or enter manually",
                    you: "You",
                    autoAdded: "will be automatically added as attendee."
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
                    attendeesCount: "Attendees",
                    games: "Games",
                    gamesShort: "games",
                    searchPlayer: "Search community player...",
                    orManualName: "or enter name manually"
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
                    deleted: "Event deleted.",
                    nameRequired: "Enter event name."
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
                playersTitle: "Players",
                noPlayers: "No players.",
                gamesCount: "Games: {{count}}",
                emptyStateTitle: "Select a player from the list",
                emptyStateDesc: "or use the search bar above",
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
                    offered: "Offered",
                    wanted: "Wanted",
                    btnAdd: "+ Add",
                    activeOffers: "Active Offers",
                    noOffers: "No offers."
                },
                recommendations: {
                    title: "Recommendations",
                    basedOn: 'Based on "{{game}}" we recommend: {{game}} II, {{game}} – Expansion, Other games like {{game}}.',
                    empty: "Add player's favorite games to generate recommendations."
                },
                search: {
                    placeholder: "Search player by nickname or name...",
                    noResults: "No results for",
                    games: "Games",
                    friend: "Friend",
                    addAsPlayer: "Add as player",
                    sent: "Sent",
                    awaitingYou: "Awaiting you",
                    addFriend: "Add friend",
                    profile: "profile"
                },
                form: {
                    nicknameLabel: "NICKNAME",
                    nicknamePlaceholder: "e.g. KingPawn99",
                    fullNamePlaceholder: "e.g. John Doe",
                    ownedGamesLabel: "Owned games (comma separated)",
                    favoriteGamesLabel: "Favorite games (comma separated)"
                },
                myPlayers: "My players",
                noPlayersAddFirst: "No players yet. Add the first one!",
                requests: "Requests",
                friends: "Friends",
                inPlayerList: "in player list",
                btnAdd: "Add",
                profile: {
                    platformUser: "Platform user",
                    communityProfile: "Community profile",
                    yourPlayer: "Your player",
                    addAsPlayer: "Add as player"
                },
                ownedGames: "Owned games",
                favoriteGames: "Favorite games",
                none: "None.",
                gamesShort: "Games",
                exchangeOfferGive: "Game to give",
                exchangeWantGame: "Wanted game",
                toasts2: {
                    requestSent: "Friend request sent!",
                    requestAccepted: "Friend request accepted!",
                    requestDeclined: "Request declined.",
                    addedToPlayers: 'Player "{{nickname}}" added to your players!',
                    nicknameRequired: "Nickname is required.",
                    playerRemoved: "Player removed."
                },
                toasts: {
                    playerAdded: 'Player "{{nickname}}" added.',
                    playerDeleted: "Player deleted.",
                    offerAdded: "Exchange offer added."
                }
            },
            drawing: {
                title: "Game Draw",
                subtitle: "Draw the order of games from those available in the collection.",
                minPlayersLabel: "Minimum number of players",
                btnDraw: "Draw",
                emptyState: "No game meets the criteria (available + min. {{count}} players).",
                totalTime: "Total time: ",
                headerTitle: "Game drawing",
                headerSubtitle: "Not sure what to play? The algorithm will pick optimal games based on player count and your library.",
                configTitle: "Configuration",
                minPlayersCfg: "MINIMUM PLAYERS",
                selectionPreference: "SELECTION PREFERENCE",
                btnDrawGames: "DRAW GAMES",
                sessionTime: "SESSION TIME",
                hoursShort: "h",
                resultsTitle: "Drawn games",
                resultsFound: "FOUND",
                boardGame: "Board game",
                players: "players",
                btnReroll: "REDRAW",
                btnConfirm: "CONFIRM SESSION",
                sessionConfirmed: "Session confirmed!",
                emptyForPlayers: "No games available for ",
                emptyPlayersSuffix: "players.",
                emptyHint: "Add games to your collection or change filters.",
                placeholderText: "Configure settings and click",
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
                    confirmed: "Session confirmed!"
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
                btnAdd: "Add game",
                filterLabel: "Filter – min. players:",
                emptyState: "No games in the collection.",
                libraryTitle: "Game library",
                total: "TOTAL",
                filters: {
                    playersLabel: "PLAYERS",
                    any: "Any",
                    players: "players",
                    availabilityLabel: "AVAILABILITY",
                    all: "All",
                    available: "Available",
                    inUse: "In Use",
                    service: "Service"
                },
                status: {
                    available: "AVAILABLE",
                    inUse: "IN USE",
                    service: "SERVICE",
                    descAvailable: "Ready to play",
                    descInUse: "Currently in use",
                    descService: "Damaged or missing parts"
                },
                editForm: {
                    titleEdit: "Edit game",
                    titleNew: "New game",
                    subtitle: "Fill in game details and availability",
                    cancel: "Cancel",
                    save: "Save",
                    gameTitle: "GAME TITLE",
                    gameTitlePlaceholder: "Game name",
                    description: "DESCRIPTION",
                    descriptionPlaceholder: "Short game description",
                    minPlayers: "MIN. PLAYERS",
                    maxPlayers: "MAX. PLAYERS",
                    playTime: "PLAY TIME (MIN)",
                    difficulty: "DIFFICULTY",
                    cover: "GAME COVER",
                    statusLabel: "STATUS",
                    removeFromCatalog: "REMOVE FROM CATALOG",
                    emptyRight: "Select a game or add a new one"
                },
                complexity: {
                    easy: "Easy",
                    medium: "Medium",
                    hard: "Hard",
                    expert: "Expert"
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
                    archived: 'Removed "{{title}}".'
                }
            },
            login: {
                themeLight: "Light mode",
                themeDark: "Dark mode",
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
                    registerNote: "Registration creates a new local account."
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