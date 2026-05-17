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
                playersTitle: "Gracze",
                noPlayers: "Brak graczy.",
                gamesCount: "Gier: {{count}}",
                emptyStateTitle: "Wybierz gracza z listy",
                emptyStateDesc: "lub dodaj nowego, aby zobaczyć profil",
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
                toasts: {
                    noGames: "Brak dostępnych gier dla podanej liczby graczy.",
                    success: "Wylosowano {{count}} gier."
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
                    deleted: 'Usunięto "{{title}}".'
                }
            },
            login: {
                themeLight: "Tryb jasny",
                themeDark: "Tryb ciemny",
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
                    labelDisplayName: "Wyświetlana nazwa",
                    labelEmail: "Adres e-mail",
                    labelPassword: "Hasło",
                    labelConfirmPassword: "Potwierdź hasło",
                    btnLogin: "Zaloguj się",
                    btnRegister: "Utwórz konto",
                    loadingLogin: "Logowanie...",
                    loadingRegister: "Tworzenie..."
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
                playersTitle: "Players",
                noPlayers: "No players.",
                gamesCount: "Games: {{count}}",
                emptyStateTitle: "Select a player from the list",
                emptyStateDesc: "or add a new one to see profile",
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
                toasts: {
                    noGames: "No available games for the specified number of players.",
                    success: "Successfully drawn {{count}} games."
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
                    deleted: 'Deleted "{{title}}".'
                }
            },
            login: {
                themeLight: "Light mode",
                themeDark: "Dark mode",
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
                    labelDisplayName: "Display name",
                    labelEmail: "E-mail address",
                    labelPassword: "Password",
                    labelConfirmPassword: "Confirm password",
                    btnLogin: "Log In",
                    btnRegister: "Create Account",
                    loadingLogin: "Logging in...",
                    loadingRegister: "Creating..."
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