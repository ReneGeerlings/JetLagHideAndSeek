import { useStore } from "@nanostores/react";

import { type Language, language } from "./index";

type SchemaMap = Record<string, string>;

const en: SchemaMap = {
    "Theme Parks": "Theme Parks",
    Zoos: "Zoos",
    Aquariums: "Aquariums",
    Museums: "Museums",
    Hospitals: "Hospitals",
    "Movie Theaters": "Movie Theaters",
    Libraries: "Libraries",
    "Custom Locations": "Custom Locations",
    "15 Miles (Typically)": "15 Miles (Typically)",
    "1 Mile (Typically)": "1 Mile (Typically)",
    "Hiding Zone Mode": "Hiding Zone Mode",
    "Coastline Question": "Coastline Question",
    "Commercial Airport In Zone Question":
        "Commercial Airport In Zone Question",
    "Major City (1,000,000+ people) In Zone Question":
        "Major City (1,000,000+ people) In Zone Question",
    "Major City (1,000,000+ people) Question":
        "Major City (1,000,000+ people) Question",
    "High-Speed Rail Question": "High-Speed Rail Question",
    "Aquarium Question": "Aquarium Question",
    "Zoo Question": "Zoo Question",
    "Theme Park Question": "Theme Park Question",
    "Mountain Question": "Mountain Question",
    "Museum Question": "Museum Question",
    "Hospital Question": "Hospital Question",
    "Cinema Question": "Cinema Question",
    "Library Question": "Library Question",
    "Golf Course Question": "Golf Course Question",
    "Foreign Consulate Question": "Foreign Consulate Question",
    "Park Question": "Park Question",
    "Aquarium Question (Small+Medium Games)":
        "Aquarium Question (Small+Medium Games)",
    "Zoo Question (Small+Medium Games)": "Zoo Question (Small+Medium Games)",
    "Theme Park Question (Small+Medium Games)":
        "Theme Park Question (Small+Medium Games)",
    "Mountain Question (Small+Medium Games)":
        "Mountain Question (Small+Medium Games)",
    "Museum Question (Small+Medium Games)":
        "Museum Question (Small+Medium Games)",
    "Hospital Question (Small+Medium Games)":
        "Hospital Question (Small+Medium Games)",
    "Cinema Question (Small+Medium Games)":
        "Cinema Question (Small+Medium Games)",
    "Library Question (Small+Medium Games)":
        "Library Question (Small+Medium Games)",
    "Golf Course Question (Small+Medium Games)":
        "Golf Course Question (Small+Medium Games)",
    "Foreign Consulate Question (Small+Medium Games)":
        "Foreign Consulate Question (Small+Medium Games)",
    "Park Question (Small+Medium Games)": "Park Question (Small+Medium Games)",
    "Zone Question": "Zone Question",
    "Zone Starts With Same Letter Question":
        "Zone Starts With Same Letter Question",
    "Station Starts With Same Letter Question":
        "Station Starts With Same Letter Question",
    "Station Has Same Length Question": "Station Has Same Length Question",
    "Station On Same Train Line Question":
        "Station On Same Train Line Question",
    "Custom Zone Question": "Custom Zone Question",
    "Custom Points Question": "Custom Points Question",
    "McDonald's Question": "McDonald's Question",
    "7-Eleven Question": "7-Eleven Question",
    "Train Station Question": "Train Station Question",
    "Custom Measuring Question": "Custom Measuring Question",
};

const nl: SchemaMap = {
    "Theme Parks": "Pretparken",
    Zoos: "Dierentuinen",
    Aquariums: "Aquariums",
    Museums: "Musea",
    Hospitals: "Ziekenhuizen",
    "Movie Theaters": "Bioscopen",
    Libraries: "Bibliotheken",
    "Custom Locations": "Aangepaste locaties",
    "15 Miles (Typically)": "15 mijl (gebruikelijk)",
    "1 Mile (Typically)": "1 mijl (gebruikelijk)",
    "Hiding Zone Mode": "Verstopzonemodus",
    "Coastline Question": "Kustlijn-vraag",
    "Commercial Airport In Zone Question": "Vliegveld in zone-vraag",
    "Major City (1,000,000+ people) In Zone Question":
        "Grote stad (1.000.000+ inwoners) in zone-vraag",
    "Major City (1,000,000+ people) Question":
        "Grote stad (1.000.000+ inwoners)-vraag",
    "High-Speed Rail Question": "Hogesnelheidstrein-vraag",
    "Aquarium Question": "Aquarium-vraag",
    "Zoo Question": "Dierentuin-vraag",
    "Theme Park Question": "Pretpark-vraag",
    "Mountain Question": "Berg-vraag",
    "Museum Question": "Museum-vraag",
    "Hospital Question": "Ziekenhuis-vraag",
    "Cinema Question": "Bioscoop-vraag",
    "Library Question": "Bibliotheek-vraag",
    "Golf Course Question": "Golfbaan-vraag",
    "Foreign Consulate Question": "Consulaat-vraag",
    "Park Question": "Park-vraag",
    "Aquarium Question (Small+Medium Games)":
        "Aquarium-vraag (kleine+middelgrote spellen)",
    "Zoo Question (Small+Medium Games)":
        "Dierentuin-vraag (kleine+middelgrote spellen)",
    "Theme Park Question (Small+Medium Games)":
        "Pretpark-vraag (kleine+middelgrote spellen)",
    "Mountain Question (Small+Medium Games)":
        "Berg-vraag (kleine+middelgrote spellen)",
    "Museum Question (Small+Medium Games)":
        "Museum-vraag (kleine+middelgrote spellen)",
    "Hospital Question (Small+Medium Games)":
        "Ziekenhuis-vraag (kleine+middelgrote spellen)",
    "Cinema Question (Small+Medium Games)":
        "Bioscoop-vraag (kleine+middelgrote spellen)",
    "Library Question (Small+Medium Games)":
        "Bibliotheek-vraag (kleine+middelgrote spellen)",
    "Golf Course Question (Small+Medium Games)":
        "Golfbaan-vraag (kleine+middelgrote spellen)",
    "Foreign Consulate Question (Small+Medium Games)":
        "Consulaat-vraag (kleine+middelgrote spellen)",
    "Park Question (Small+Medium Games)":
        "Park-vraag (kleine+middelgrote spellen)",
    "Zone Question": "Zone-vraag",
    "Zone Starts With Same Letter Question":
        "Zone begint met dezelfde letter-vraag",
    "Station Starts With Same Letter Question":
        "Station begint met dezelfde letter-vraag",
    "Station Has Same Length Question": "Station met dezelfde lengte-vraag",
    "Station On Same Train Line Question":
        "Station op dezelfde treinlijn-vraag",
    "Custom Zone Question": "Aangepaste zone-vraag",
    "Custom Points Question": "Aangepaste punten-vraag",
    "McDonald's Question": "McDonald's-vraag",
    "7-Eleven Question": "7-Eleven-vraag",
    "Train Station Question": "Treinstation-vraag",
    "Custom Measuring Question": "Aangepaste meet-vraag",
};

const dictionaries: Record<Language, SchemaMap> = { en, nl };

export function useSchemaDescription() {
    const lang = useStore(language);
    return (description: string): string =>
        dictionaries[lang][description] ?? description;
}
