declare module 'leaflet' {
  export class Map {
    // Add more methods/properties as needed
  }
  export class Icon {
    constructor(options: any);
  }
  export class Marker {
    // Add more methods/properties as needed
  }
  export class TileLayer {
    // Add more methods/properties as needed
  }
  export class Popup {
    // Add more methods/properties as needed
  }
}

declare module 'react-leaflet' {
  import { ComponentType, ReactNode, RefAttributes } from 'react';
  import * as L from 'leaflet';
  
  // MapContainer props
  export interface MapContainerProps {
    center: [number, number];
    zoom: number;
    style?: React.CSSProperties;
    children?: ReactNode;
  }
  export const MapContainer: ComponentType<MapContainerProps & RefAttributes<L.Map>>;
  
  // TileLayer props
  export interface TileLayerProps {
    attribution: string;
    url: string;
  }
  export const TileLayer: ComponentType<TileLayerProps & RefAttributes<L.TileLayer>>;
  
  // Marker props
  export interface MarkerProps {
    position: [number, number];
    icon?: L.Icon | any;
    children?: ReactNode;
  }
  export const Marker: ComponentType<MarkerProps & RefAttributes<L.Marker>>;
  
  // Popup props
  export interface PopupProps {
    children?: ReactNode;
  }
  export const Popup: ComponentType<PopupProps & RefAttributes<L.Popup>>;
}

// For image imports
declare module '*.png';
declare module '*.jpg';
declare module '*.svg';