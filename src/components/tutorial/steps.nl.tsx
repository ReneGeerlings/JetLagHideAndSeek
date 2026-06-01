import {
    MatchingQuestionComponent,
    MeasuringQuestionComponent,
    RadiusQuestionComponent,
    TentacleQuestionComponent,
    ThermometerQuestionComponent,
} from "@/components/QuestionCards";
import { SidebarGroup, SidebarMenu } from "@/components/ui/sidebar-l";

import type { TutorialStep } from "./types";

export const tutorialStepsNl: TutorialStep[] = [
    {
        title: "Welkom bij de Jet Lag Hide and Seek Map Generator!",
        content: (
            <>
                Welkom bij de Hide and Seek-kaartgenerator gemaakt voor het Jet
                Lag Home Game! Deze uitgebreide tutorial loodst je door elke
                functie, optie en vraagtype die deze krachtige tool biedt.
                <br />
                <br />
                Deze tool is bedoeld voor wie het Jet Lag Hide and Seek Home
                Game heeft gekocht, al is hij niet officieel verbonden aan de
                makers. Hij ondersteunt meer dan 48 vraagvariaties uit het spel!
                <br />
                <br />
                Ben je al bekend met de basis? Dan kun je gerust{" "}
                <strong>
                    de tutorial overslaan door naar beneden te scrollen
                </strong>
                . Toch behandelt deze gids ook geavanceerde functies die je
                misschien nog niet kent. Wil je deze gratis tool steunen,
                overweeg dan om{" "}
                <a
                    href="https://github.com/taibeled/JetLagHideAndSeek"
                    className="text-blue-500 cursor-pointer"
                    target="_blank"
                    rel="noreferrer"
                >
                    de repository een ster te geven op GitHub
                </a>{" "}
                of hem te delen met andere Jet Lag-fans! Beide zijn gratis
                manieren om je waardering te tonen.
            </>
        ),
        position: "center",
    },
    {
        title: "Overzicht: Spelopzet",
        content: (
            <>
                Voor we de details induiken, hier de typische werkwijze:
                <br />
                <br />
                <strong>1. Locatie instellen:</strong> Bepaal je speelgebied via
                voorgedefinieerde locaties of door zelf een polygoon te tekenen
                <br />
                <br />
                <strong>2. Vragen aanmaken:</strong> Voeg de 5 vraagtypes toe en
                stel ze in (Radius, Thermometer, Tentakels, Matching, Meten)
                <br />
                <br />
                <strong>3. Delen:</strong> Deel de vragen en spelgrenzen met
                andere spelers
                <br />
                <br />
                <strong>4. Verstoppermodus:</strong> Laat de verstopper de
                vragen automatisch beantwoorden op basis van zijn locatie
                <br />
                <br />
                <strong>5. Zone-analyse:</strong> Bekijk mogelijke verstopzones
                en hun beperkingen
                <br />
                <br />
                Laten we elke stap in detail bekijken!
            </>
        ),
        position: "center",
    },
    {
        title: "Locatie instellen: Plaatskiezer",
        content: (
            <>
                Met de Plaatskiezer bepaal je het speelgebied op basis van
                voorinstellingen. Klik op het zoekvak om locaties te verkennen.
                <br />
                <br />
                <strong>Ondersteunde locatietypes:</strong>
                <br />• Steden, dorpen en wijken
                <br />• Bestuurlijke regio&rsquo;s (landen, staten, prefecturen)
                <br />• Geografische kenmerken (eilanden, parken)
            </>
        ),
        targetSelector: '[data-tutorial-id="place-picker"]',
        position: "bottom",
    },
    {
        title: "Locatiebeheer: Toevoegen, aftrekken, verwijderen",
        content: (
            <>
                Zodra je naar locaties zoekt, biedt dit menu krachtige
                beheeropties:
                <br />
                <br />
                <strong>Locaties toevoegen (+ knop):</strong> Vergroot je
                speelgebied door de geselecteerde regio toe te voegen
                <br />
                <br />
                <strong>Locaties aftrekken (- knop):</strong> Maakt &ldquo;
                gaten&rdquo; in je speelgebied door specifieke regio&rsquo;s uit
                te sluiten. Ideaal om water, verboden gebieden of complexe
                grenzen weg te halen.
                <br />
                <br />
                <strong>Locaties verwijderen (X knop):</strong> Haalt de locatie
                volledig uit je spel
                <br />
                <br />
                <strong>
                    &ldquo;Vragen &amp; cache wissen&rdquo;-knop:
                </strong>{" "}
                Reset alle vragen en wist gecachte data wanneer je de locatie
                ingrijpend verandert
                <br />
                <br />
                <strong>
                    &ldquo;Voorinstellingen hergebruiken&rdquo;-knop:
                </strong>{" "}
                Verschijnt als er aangepaste polygonen bestaan, zodat je terug
                kunt naar de voorinstellingsmodus
            </>
        ),
        targetSelector: '[data-tutorial-id="place-picker-content"]',
        position: "bottom",
    },
    {
        title: "Geavanceerde locatie-opzet: aangepaste polygonen tekenen",
        content: (
            <>
                Voor maatwerk speelgebieden kun je met de Polygoon-tool zelf
                tekenen:
                <br />
                <br />
                <strong>Polygoon-tool:</strong> Teken aangepaste grenzen die
                exact je beoogde speelgebied volgen. Handig voor onregelmatige
                vormen of als de voorinstellingen niet perfect passen.
                <br />
                <br />
                <strong>Teken-tips:</strong>
                <br />• Klik om te starten, blijf klikken om punten toe te
                voegen
                <br />• Klik opnieuw op het eerste punt om de polygoon te
                sluiten
                <br />• Gebruik meerdere polygonen voor complexe gebieden
                <br />
                <br />
                <strong>Toepassingen:</strong> Universiteitscampussen,
                specifieke wijken, op maat gemaakte spelgrenzen of gebieden die
                meerdere bestuurlijke regio&rsquo;s overspannen.
            </>
        ),
        targetSelector: ".leaflet-draw-draw-polygon",
        position: "top",
    },
    {
        title: "De vragen-zijbalk openen",
        content: (
            <>
                Vragen toevoegen kan op twee manieren: via de zijbalk, of op de
                kaart zelf. Klik op de gemarkeerde knop om de zijbalk te openen,
                of ga door naar de volgende stap. Om een vraag op de kaart toe
                te voegen, klik je rechts (desktop) of houd je lang ingedrukt
                (mobiel). Op die plek wordt een vraag toegevoegd, waarna je het
                type kunt kiezen.
            </>
        ),
        targetSelector: '[data-tutorial-id="left-sidebar-trigger"]',
        position: "bottom",
    },
    {
        title: "Vragen-aanmaakinterface (deel 1)",
        content: (
            <>
                Deze zijbalk is je commandocentrum voor vragen. Elke knop maakt
                een ander vraagtype aan. Ga door naar de volgende stap voor
                uitleg per vraagtype.
            </>
        ),
        targetSelector: '[data-tutorial-id="add-questions-buttons"]',
        position: "top",
    },
    {
        title: "Vragen-aanmaakinterface (deel 2)",
        content: (
            <>
                Hier zijn voorbeelden van de vragen:
                <br />
                <br />
                <strong>1. RADIUS:</strong> &ldquo;Bevindt de verstopper zich
                binnen X afstand van dit punt?&rdquo;
                <br />
                <br />
                <strong>2. THERMOMETER:</strong> &ldquo;Is de verstopper dichter
                bij punt A of bij punt B?&rdquo;
                <br />
                <br />
                <strong>3. TENTAKELS:</strong> &ldquo;Welke specifieke locatie
                binnen X afstand van de zoekers is het dichtst bij de
                verstopper?&rdquo;
                <br />
                <br />
                <strong>4. MATCHING:</strong> &ldquo;Heeft de verstopper
                dezelfde eigenschap als dit referentiepunt?&rdquo;
                <br />
                <br />
                <strong>5. METEN:</strong> &ldquo;Is de verstopper dichterbij of
                verder dan de zoeker bij dit kenmerk?&rdquo;
                <br />
                <br />
                Daarnaast zijn er de extra knoppen:
                <br />
                <br />
                <strong>&ldquo;Vraag plakken&rdquo;:</strong> Importeer vragen
                vanaf het klembord (JSON-formaat)
                <br />
                <br />
                <strong>&ldquo;Opslaan&rdquo;-knop:</strong> Verschijnt wanneer
                automatisch opslaan uitstaat, zodat je handmatig kunt opslaan
            </>
        ),
        position: "center",
    },
    {
        title: "Radius-vragen: het fundament",
        content: (
            <>
                Radius-vragen zijn het simpelste vraagtype. Hier een
                voorbeeldinterface:
                <br />
                <br />
                <SidebarGroup className="text-foreground">
                    <SidebarMenu>
                        <RadiusQuestionComponent
                            questionKey={Math.random()}
                            data={{
                                collapsed: false,
                                drag: true,
                                lat: 35.6762,
                                lng: 139.6503,
                                radius: 10,
                                unit: "miles",
                                color: "blue",
                                within: false,
                            }}
                        />
                    </SidebarMenu>
                </SidebarGroup>
                <br />
                <strong>Radius-instelling:</strong> Stel elke afstand in
                (decimalen toegestaan)
                <br />
                <br />
                <strong>Eenheden:</strong> Mijl, kilometer of meter
                <br />
                <br />
                <strong>Positie:</strong> Sleep de marker op de kaart of voer
                exacte coördinaten in. Je kunt ook je huidige locatie gebruiken
                of een locatie plakken.
                <br />
                <br />
                <strong>Binnen/Buiten:</strong> Schakel of de verstopper binnen
                of buiten de radius zit
                <br />
                <br />
                <strong>Vergrendelen/Ontgrendelen:</strong> Voorkomt ongewenste
                wijzigingen wanneer vergrendeld
            </>
        ),
        isDescription: false,
        position: "center",
    },
    {
        title: "Thermometer-vragen: relatieve positie",
        content: (
            <>
                Thermometer-vragen verdelen de kaart in twee gebieden, elk met
                alle punten die dichter bij start of eind liggen:
                <br />
                <br />
                <SidebarGroup className="text-foreground">
                    <SidebarMenu>
                        <ThermometerQuestionComponent
                            questionKey={Math.random()}
                            data={{
                                collapsed: false,
                                drag: true,
                                latA: 35.6762,
                                lngA: 139.6503,
                                latB: 35.6762,
                                lngB: 139.7503,
                                colorA: "red",
                                colorB: "blue",
                                warmer: false,
                            }}
                        />
                    </SidebarMenu>
                </SidebarGroup>
                <br />
                <strong>Twee-puntensysteem:</strong> Punt A (startpunt) en punt
                B (eindpunt), elk met eigen coördinaten en kleuren
                <br />
                <br />
                <strong>&ldquo;Warmer&rdquo;-logica:</strong>
                <br />• Warmer = verstopper is dichter bij punt B (eindpunt)
                <br />• Kouder = verstopper is dichter bij punt A (startpunt)
                <br />
                <br />
                <strong>Coördinaten invoeren:</strong> Stel exacte locaties in
                of versleep de markers visueel
                <br />
                <br />
                <strong>Kleurcodering:</strong> Verschillende kleuren helpen om
                de punten op de kaart uit elkaar te houden
            </>
        ),
        position: "center",
    },
    {
        title: "Tentakel-vragen: locatie-ontdekking",
        content: (
            <>
                Tentakel-vragen identificeren specifieke locaties binnen een
                radius — perfect om verstopplekken nauwkeurig te lokaliseren:
                <br />
                <br />
                <SidebarGroup className="text-foreground">
                    <SidebarMenu>
                        <TentacleQuestionComponent
                            questionKey={Math.random()}
                            data={{
                                collapsed: false,
                                drag: true,
                                lat: 35.6762,
                                lng: 139.6503,
                                radius: 15,
                                unit: "miles",
                                color: "red",
                                locationType: "theme_park",
                                location: false,
                            }}
                        />
                    </SidebarMenu>
                </SidebarGroup>
                <br />
                <strong>Locatietypes:</strong>
                <br />• <strong>15-mijl-radius:</strong> Pretparken,
                dierentuinen, aquariums
                <br />• <strong>1-mijl-radius:</strong> Musea, ziekenhuizen,
                bioscopen, bibliotheken
                <br />• <strong>Aangepast:</strong> Definieer je eigen
                interessepunten
                <br />
                <br />
                <strong>Radius-instelling:</strong> Past het zoekgebied aan voor
                het vinden van locaties
                <br />
                <br />
                <strong>Slimme detectie:</strong> Vindt automatisch alle
                kwalificerende locaties binnen de radius op basis van
                OpenStreetMap-data
                <br />
                <br />
                <strong>Aangepaste modus:</strong> Schakel tekenmodus in om
                punten handmatig te plaatsen of te bewerken
            </>
        ),
        position: "center",
    },
    {
        title: "Matching-vragen: eigenschapsvergelijking (deel 1)",
        content: (
            <>
                Matching-vragen vergelijken eigenschappen tussen de locatie van
                de verstopper en een referentiepunt. Dit is het meest complexe
                vraagtype met talloze varianten:
                <br />
                <br />
                <SidebarGroup className="text-foreground">
                    <SidebarMenu>
                        <MatchingQuestionComponent
                            questionKey={Math.random()}
                            data={{
                                collapsed: false,
                                drag: true,
                                lat: 35.6762,
                                lng: 139.6503,
                                color: "blue",
                                same: true,
                                type: "airport",
                            }}
                        />
                    </SidebarMenu>
                </SidebarGroup>
                <br />
                <strong>Zone-gebaseerde matching:</strong>
                <br />• <strong>Zelfde zone:</strong> Bestuurlijke regio&rsquo;s
                (prefecturen, staten, etc.)
                <br />• <strong>Zelfde eerste letter van zone:</strong> Zones
                die met dezelfde letter beginnen
                <br />• <strong>Zone-niveaus:</strong> OSM-bestuursniveaus 3-10
                voor verschillende detailniveaus
                <br />
                <br />
                <strong>Vliegveld-matching:</strong>
                <br />• Vergelijkt het dichtstbijzijnde commerciële vliegveld
                (alleen met IATA-code)
                <br />• Gebruikt Voronoi-diagrammen om
                vliegveld-verzorgingsgebieden te bepalen
                <br />
                <br />
                <strong>Stad-matching:</strong>
                <br />• Vergelijkt de dichtstbijzijnde grote stad (1.000.000+
                inwoners)
                <br />• Handig voor grootschalige geografische vragen
            </>
        ),
        position: "center",
    },
    {
        title: "Matching-vragen: eigenschapsvergelijking (deel 2)",
        content: (
            <>
                <strong>
                    Volledige spelvarianten (kleine/middelgrote spellen):
                </strong>
                <br />
                Hiervoor moet het speelgebied relatief klein zijn (er zijn ook
                varianten die werken met Verstopzonemodus voor grotere spellen):
                <br />• Aquariums, dierentuinen, pretparken
                <br />• Bergen, musea, ziekenhuizen, bioscopen
                <br />• Bibliotheken, golfbanen, consulaten, parken
                <br />
                <br />
                <strong>Verstopzonemodus-varianten:</strong>
                <br />
                Deze werken specifiek met treinstation-data:
                <br />• <strong>Zelfde eerste letter van station:</strong>{" "}
                Stations waarvan de naam met dezelfde letter begint
                <br />• <strong>Stationsnaam met zelfde lengte:</strong>{" "}
                Stations met evenveel tekens in de naam
                <br />• <strong>Zelfde treinlijn:</strong> Stations verbonden
                door dezelfde spoorlijn
                <br />
                <br />
                <strong>Aangepaste matching:</strong>
                <br />• <strong>Aangepaste zone:</strong> Teken je eigen zones
                ter vergelijking
                <br />• <strong>Aangepaste punten:</strong> Definieer je eigen
                puntcategorieën
            </>
        ),
        position: "center",
    },
    {
        title: "Meet-vragen: afstandsvergelijking (deel 1)",
        content: (
            <>
                Meet-vragen vergelijken de afstand van de verstopper tot een
                kenmerk met die van de zoeker:
                <br />
                <br />
                <SidebarGroup className="text-foreground">
                    <SidebarMenu>
                        <MeasuringQuestionComponent
                            questionKey={Math.random()}
                            data={{
                                collapsed: false,
                                drag: true,
                                lat: 35.6762,
                                lng: 139.6503,
                                color: "green",
                                hiderCloser: true,
                                type: "coastline",
                            }}
                        />
                    </SidebarMenu>
                </SidebarGroup>
                <br />
                <strong>Geografische kenmerken:</strong>
                <br />• <strong>Kustlijn:</strong> Afstand tot de
                dichtstbijzijnde kust met gedetailleerde kustlijndata
                <br />• <strong>Commerciële vliegvelden:</strong> Afstand tot
                het dichtstbijzijnde vliegveld met IATA-code
                <br />• <strong>Grote steden:</strong> Afstand tot steden met
                1M+ inwoners
                <br />• <strong>Hogesnelheidstrein:</strong> Afstand tot
                hogesnelheidslijnen (zoals Shinkansen)
                <br />
                <br />
                <strong>Volledige spelvarianten:</strong>
                <br />
                Dezelfde locatietypes als bij Matching, maar gericht op afstand
                in plaats van categorie:
                <br />• Aquariums, dierentuinen, pretparken, bergen,
                <br />• Musea, ziekenhuizen, bioscopen, bibliotheken
                <br />• Golfbanen, consulaten, parken
                <br />
                <br />
                <strong>Dichterbij/Verder-logica:</strong> Schakel of de
                verstopper dichterbij of verder zat dan de zoeker
            </>
        ),
        position: "center",
    },
    {
        title: "Meet-vragen: afstandsvergelijking (deel 2)",
        content: (
            <>
                <strong>Verstopzonemodus-varianten:</strong>
                <br />
                Deze werken met het zone-analyse-systeem:
                <br />• <strong>McDonald&rsquo;s:</strong> Afstand tot
                dichtstbijzijnde McDonald&rsquo;s-vestiging
                <br />• <strong>7-Eleven:</strong> Afstand tot dichtstbijzijnde
                7-Eleven-winkel
                <br />• <strong>Treinstation:</strong> Afstand tot
                dichtstbijzijnde treinstation
                <br />
                <br />
                <strong>Aangepast meten:</strong>
                <br />• <strong>Aangepaste meting:</strong> Teken je eigen
                kenmerken om afstand naar te meten
                <br />• Schakel tekenmodus in om aangepaste punten of gebieden
                te maken
                <br />• Perfect voor spel-specifieke kenmerken of lokale
                herkenningspunten
                <br />
                <br />
                <strong>Implementatiedetails:</strong>
                <br />• Gebruikt geodetische afstandsberekeningen voor
                nauwkeurigheid
                <br />• Buffers rond kenmerken vormen zones van gelijke afstand
                <br />• Resultaten tonen welke gebieden dichterbij/verder liggen
                dan het referentiepunt
            </>
        ),
        position: "center",
    },
    {
        title: "Delen en samenwerking",
        content: (
            <>
                Naadloos delen is cruciaal voor multiplayer-spellen. Het
                deel-systeem biedt meerdere methodes:
                <br />
                <br />
                <strong>URL delen:</strong>
                <br />• <strong>Directe links:</strong> De volledige spelstaat
                in de URL
                <br />• <strong>Gecomprimeerde links:</strong> Kortere
                URL&rsquo;s voor complexe spellen
                <br />• <strong>Pastebin-integratie:</strong> Voor zeer grote
                spelstaten
                <br />
                <br />
                <strong>Wat gedeeld wordt:</strong>
                <br />• Alle locatiegrenzen (voorinstellingen en aangepast)
                <br />• Volledige vraag-configuraties
                <br />• Vraagantwoorden/uitkomsten
                <br />• Spelopties en instellingen
                <br />• Visuele aanpassingen (kleuren, eenheden)
                <br />
                <br />
                <strong>Wat niet gedeeld wordt:</strong>
                <br />• De daadwerkelijke locatie van de verstopper (bij
                Verstoppermodus)
                <br />• Persoonlijke API-sleutels
            </>
        ),
        targetSelector: '[data-tutorial-id="share-questions-button"]',
        position: "top",
    },
    {
        title: "Verstoppermodus: vragen automatisch beantwoorden",
        content: (
            <>
                Verstoppermodus is de krachtigste functie om de gameplay te
                stroomlijnen:
                <br />
                <br />
                <strong>Hoe het werkt:</strong>
                <br />
                1. De verstopper ontvangt de spel-link van de zoekers
                <br />
                2. Schakelt Verstoppermodus in en voert zijn exacte locatie in
                <br />
                3. Alle vragen worden automatisch beantwoord op basis van zijn
                positie
                <br />
                4. De verstopper deelt de bijgewerkte link met antwoorden terug
                naar de zoekers
                <br />
                <br />
                <strong>Privacy:</strong> De exacte coördinaten van de
                verstopper worden nooit gedeeld — alleen de vraagantwoorden.
            </>
        ),
        position: "center",
    },
    {
        title: "Geavanceerde opties en instellingen",
        content: (
            <>
                Het optiesmenu bevat krachtige aanpassingen die je spelervaring
                sterk beïnvloeden:
                <br />
                <br />
                <strong>Weergaveopties:</strong>
                <br />• <strong>Automatisch zoomen:</strong> De kaart past zich
                automatisch aan relevante gebieden aan bij het toevoegen van
                vragen of analyseren van zones. Schakel uit voor handmatige
                zoom.
                <br />• <strong>Kaartbewegingen animeren:</strong> Soepele
                overgangen tussen kaartposities versus directe sprongen.
                <br />• <strong>Treinlijnen markeren:</strong> Visuele nadruk op
                spoornetwerken. Vereist een Thunderforest API-sleutel maar geeft
                cruciale visuele context bij trein-vragen.
                <br />• <strong>Volg mij:</strong> GPS-tracking voor mobiel
                gebruik. Plaatst een marker die je locatie in realtime volgt.
                <br />
                <br />
                <strong>Eenheidsvoorkeuren:</strong>
                <br />• <strong>Standaardeenheid:</strong> Mijl, kilometer of
                meter voor nieuwe vragen. Wordt de standaard voor alle nieuwe
                vragen. Kies op basis van wat in jouw regio gebruikelijk is.
                <br />• Beïnvloedt alle afstand-gerelateerde vragen en metingen
                in het hele spel
                <br />
                <br />
                <strong>Automatisering:</strong>
                <br />• <strong>Automatisch opslaan:</strong> Continu opslaan
                versus handmatige controle. Wanneer uitgeschakeld verschijnen er
                &ldquo;Opslaan&rdquo;-knoppen op vraagkaarten voor handmatige
                bediening.{" "}
                <strong>
                    Ik raad sterk aan dit uit te schakelen — ik vind dat het
                    bewerken van data zo makkelijker wordt.
                </strong>
                <br />• <strong>Planmodus:</strong> Bekijk de effecten van een
                vraag voordat je deze definitief maakt.{" "}
                <strong>
                    Ik raad sterk aan dit aan te zetten — je ziet zo alle
                    mogelijke uitkomsten van een vraag, wat je strategie
                    verbetert.
                </strong>
                <br />
                <br />
                <strong>API-integratie:</strong>
                <br />• <strong>Thunderforest API-sleutel:</strong> Verbeterde
                kaarttegels
                <br />• <strong>Pastebin API-sleutel:</strong> Verbeterd delen
                voor grote spellen
                <br />• <strong>Pastebin altijd gebruiken:</strong> Forceer
                externe hosting voor alle deelacties. Ook handig als je een
                QR-code wilt genereren met de link, want dat maakt de QR-code
                veel minder ingewikkeld.
            </>
        ),
        targetSelector: '[data-tutorial-id="option-questions-button"]',
        position: "top",
    },
    {
        title: "Databronnen, nauwkeurigheid en beperkingen",
        content: (
            <>
                Inzicht in de onderliggende databronnen helpt om realistische
                verwachtingen te stellen:
                <br />
                <br />
                <strong>OpenStreetMap (OSM) als basis:</strong>
                <br />• Alle geografische data komt uit OpenStreetMap
                <br />• Community-gedreven kartografie met wisselende
                volledigheid
                <br />• Doorgaans uitstekend in stedelijke gebieden, schaarser
                op het platteland
                <br />• Datakwaliteit hangt af van de activiteit van de lokale
                mapping-community
                <br />• Wordt regelmatig bijgewerkt, maar kan achterlopen op de
                werkelijkheid
                <br />
                <br />
                <strong>Bestuurlijke grenzen:</strong>
                <br />• Officiële overheidsgrenzen geïmporteerd uit
                gezaghebbende bronnen
                <br />• Hoge nauwkeurigheid voor grote bestuurlijke indelingen
                <br />• Vereenvoudigd tot ±100 meter voor browser-prestaties
                <br />• Sommige betwiste of veranderende grenzen kunnen
                verouderd zijn
                <br />
                <br />
                <strong>Vervoersdata:</strong>
                <br />• Treinstations: goede dekking in ontwikkelde
                regio&rsquo;s
                <br />• Commerciële vliegvelden: beperkt tot die met IATA-code
                <br />• Hogesnelheidstreinen: dekt grote systemen (Shinkansen,
                TGV, etc.)
                <br />• Bedrijfsdata (McDonald&rsquo;s, 7-Eleven) hangt af van
                lokale mapping
                <br />
                <br />
                <strong>Interessepunten:</strong>
                <br />• Musea, ziekenhuizen, bioscopen: stedelijke nadruk in
                dekking
                <br />• Pretparken, dierentuinen: grote attracties zijn goed
                vertegenwoordigd
                <br />• Bibliotheken, golfbanen, bergen: volledigheid varieert
                per regio
                <br />• Verifieer altijd kritische locaties voor jouw specifieke
                gebied
                <br />
                <br />
                <strong>Coördinaat-nauwkeurigheid:</strong>
                <br />• Afstandsberekeningen gebruiken geodetische formules
                <br />• Houden rekening met de kromming en ellipsoïde-vorm van
                de aarde
                <br />• Typische nauwkeurigheid binnen 1-2 meter voor positie
                <br />• Kustlijn-data nauwkeurig tot circa ±100 meter
                <br />• Vereenvoudiging van bestuurlijke grenzen kan precisie
                beïnvloeden
                <br />
                <br />
                <strong>Prestatiebeperkingen:</strong>
                <br />• Grote datasets kunnen browser-vertragingen veroorzaken
                <br />• Geheugengebruik neemt toe met de grootte van het
                speelgebied
                <br />• Complexe polygonen worden vereenvoudigd voor
                rendering-prestaties
                <br />• API-rate-limits kunnen real-time data-laden beïnvloeden
                <br />• Mobiele apparaten hebben extra geheugenbeperkingen
            </>
        ),
        position: "center",
    },
    {
        title: "Je bent klaar om Hide and Seek te beheersen!",
        content: (
            <>
                Gefeliciteerd! Je hebt nu uitgebreide kennis van alle 48+
                vraagvariaties en geavanceerde functies van deze tool.
                <br />
                <br />
                <strong>Snelle-start checklist:</strong>
                <br />✓ Stel je speelgebied in via Plaatskiezer of aangepaste
                polygonen
                <br />✓ Voeg vragen toe en stel ze in via de vijf hoofdtypes
                <br />✓ Test je opzet eventueel met Planmodus
                <br />✓ Configureer opties voor optimale prestaties en ervaring
                <br />✓ Deel de spel-link met alle spelers via de Delen-knop
                <br />✓ Gebruik Verstoppermodus voor automatisch beantwoorden
                <br />✓ Analyseer de resultaten
                <br />
                <br />
                <strong>Beheers de vijf vraagtypes:</strong>
                <br />• <strong>Radius:</strong> afstandscirkels (binnen/buiten)
                <br />• <strong>Thermometer:</strong> relatieve
                afstands­vergelijking (warmer/kouder)
                <br />• <strong>Tentakels:</strong> specifieke
                locatie-identificatie per categorie
                <br />• <strong>Matching:</strong> eigenschapsvergelijking
                (zelfde zone, dichtstbijzijnde vliegveld, etc...)
                <br />• <strong>Meten:</strong> afstandsvergelijking ten
                opzichte van de zoekers
                <br />
                <br />
                <strong>Hulp nodig?</strong> Deze tutorial is altijd beschikbaar
                via de Tutorial-knop. Voel je vrij om{" "}
                <a
                    href="https://github.com/taibeled/JetLagHideAndSeek/issues"
                    className="text-blue-500 cursor-pointer"
                    target="_blank"
                    rel="noreferrer"
                >
                    problemen te melden of functies aan te vragen op GitHub
                </a>
                . Jouw feedback helpt de tool voor iedereen te verbeteren!
                <br />
                <br />
                <strong>Steun het project:</strong> Als deze tool jouw Jet
                Lag-spellen verrijkt, overweeg dan om{" "}
                <a
                    href="https://github.com/taibeled/JetLagHideAndSeek"
                    className="text-blue-500 cursor-pointer"
                    target="_blank"
                    rel="noreferrer"
                >
                    een GitHub-ster achter te laten
                </a>{" "}
                en het project te delen met andere fans. Elke ster motiveert tot
                doorontwikkeling! Ten tijde van schrijven bevat dit project meer
                dan 12.002 regels code. Bij een ruime schatting van 50 regels
                per uur hebben de ontwikkelaars samen meer dan 240 uur in dit
                project gestoken! Een gratis ster geven is een mooie manier om
                je waardering te tonen.
                <br />
                <br />
                Veel plezier met verstoppen en zoeken!
            </>
        ),
        position: "center",
    },
];
