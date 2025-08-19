import type { DirectusUser, DirectusFile } from "@directus/sdk";

export interface Schema {
  albums: Album[];
  photos: Photo[];
}

export interface Album {
  id: number;
  sort: number | null;
  user_created: string | DirectusUser<Schema> | null;
  date_created: string | null;
  user_updated: string | DirectusUser<Schema> | null;
  date_updated: string | null;
  title: string | null;
  photos: number[] | Photo[] | null;
}

export interface Photo {
  id: number;
  sort: number | null;
  user_created: string | DirectusUser<Schema> | null;
  date_created: string | null;
  user_updated: string | DirectusUser<Schema> | null;
  date_updated: string | null;
  photo: string | DirectusFile<Schema>;
  album_id: number | Album | null;
}

// GeoJSON Types

export interface GeoJSONPoint {
  type: "Point";
  coordinates: [number, number];
}

export interface GeoJSONLineString {
  type: "LineString";
  coordinates: Array<[number, number]>;
}

export interface GeoJSONPolygon {
  type: "Polygon";
  coordinates: Array<Array<[number, number]>>;
}

export interface GeoJSONMultiPoint {
  type: "MultiPoint";
  coordinates: Array<[number, number]>;
}

export interface GeoJSONMultiLineString {
  type: "MultiLineString";
  coordinates: Array<Array<[number, number]>>;
}

export interface GeoJSONMultiPolygon {
  type: "MultiPolygon";
  coordinates: Array<Array<Array<[number, number]>>>;
}

export interface GeoJSONGeometryCollection {
  type: "GeometryCollection";
  geometries: Array<
    | GeoJSONPoint
    | GeoJSONLineString
    | GeoJSONPolygon
    | GeoJSONMultiPoint
    | GeoJSONMultiLineString
    | GeoJSONMultiPolygon
  >;
}
