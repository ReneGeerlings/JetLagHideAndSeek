import { TileLayer } from "react-leaflet";

const ATTR_CARTO =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors; &copy; <a href="https://carto.com/attributions">CARTO</a>; Powered by Esri and Turf.js';
const ATTR_TF =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors; &copy; <a href="http://www.thunderforest.com/">Thunderforest</a>; Powered by Esri and Turf.js';
const ATTR_OSM =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors; Powered by Esri and Turf.js';

type Props = {
    tileLayer: string;
    thunderforestApiKey: string;
};

export const MapTileLayer = ({ tileLayer, thunderforestApiKey }: Props) => {
    switch (tileLayer) {
        case "light":
            return (
                <TileLayer
                    attribution={ATTR_CARTO}
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    subdomains="abcd"
                    maxZoom={20}
                    minZoom={2}
                    noWrap
                />
            );
        case "dark":
            return (
                <TileLayer
                    attribution={ATTR_CARTO}
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    subdomains="abcd"
                    maxZoom={20}
                    minZoom={2}
                    noWrap
                />
            );
        case "transport":
            if (thunderforestApiKey)
                return (
                    <TileLayer
                        url={`https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=${thunderforestApiKey}`}
                        attribution={ATTR_TF}
                        maxZoom={22}
                        minZoom={2}
                        noWrap
                    />
                );
            break;
        case "neighbourhood":
            if (thunderforestApiKey)
                return (
                    <TileLayer
                        url={`https://tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png?apikey=${thunderforestApiKey}`}
                        attribution={ATTR_TF}
                        maxZoom={22}
                        minZoom={2}
                        noWrap
                    />
                );
            break;
        case "osmcarto":
            return (
                <TileLayer
                    attribution={ATTR_OSM}
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maxZoom={19}
                    minZoom={2}
                    noWrap
                />
            );
    }

    // Default: voyager
    return (
        <TileLayer
            attribution={ATTR_CARTO}
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
            maxZoom={20}
            minZoom={2}
            noWrap
        />
    );
};
