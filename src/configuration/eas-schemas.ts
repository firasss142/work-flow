import { AssetData } from "src/core";

export const easAssetSchemas = (asset: AssetData) => ({
  Asset: {
    expire: 5 * 1738156816,

    schema_uid: process.env.SCHEMA_A_001_UID,
    schemaEncoded:
      "string T08v01a,string T08v01b,string T08v01c,string T08v01d,string T08v01e,string T08v01f,string T08v01g,string T08v01h,string T08v01j,string T08v01k,string T08v01m,bool T08v01n,uint32 T08v01p,uint32 T08v01q,string T08v01r,string T08v01s,string T08v01t",
    encodedSchema: [
      { name: "T08v01a", value: asset.assetTypeLevel1, type: "string" },
      { name: "T08v01b", value: asset.creatorCred, type: "string" },
      { name: "T08v01c", value: asset.assetName, type: "string" },
      { name: "T08v01d", value: asset.assetImage1Hash, type: "string" },
      { name: "T08v01e", value: asset.assetImage2Hash, type: "string" },
      { name: "T08v01f", value: asset.assetImage3Hash, type: "string" },
      { name: "T08v01g", value: asset.assetOriginalHash, type: "string" },
      { name: "T08v01h", value: asset.assetCreatorName, type: "string" },
      { name: "T08v01j", value: asset.assetCreationDate, type: "string" },
      {
        name: "T08v01k",
        value: asset.assetCreationLocation,
        type: "string",
      },
      { name: "T08v01m", value: asset.assetDescription, type: "string" },
      { name: "T08v01n", value: asset.isLimitedSeries, type: "bool" },
      {
        name: "T08v01p",
        value: asset.limitedSeriesUnitNumber,
        type: "uint32",
      },
      {
        name: "T08v01q",
        value: asset.totalUnitsInLimitedEdition,
        type: "uint32",
      },
      {
        name: "T08v01r",
        value: asset.assetProductNumber,
        type: "string",
      },
      { name: "T08v01s", value: asset.assetSerialNumber, type: "string" },
      {
        name: "T08v01t",
        value: asset.schemaVersionNumber,
        type: "string",
      },
    ],
    refUID: process.env.SCHEMA_T_004_UID,
  },
});

export const easUserSchemas = (
  email?: string,
  firstName?: string,
  middleName?: string,
  lastName?: string,
) => ({
  Citizen: {
    expire: 1 * 1738156816,
    schema_uid: process.env.SCHEMA_T_001_UID,
    schemaEncoded: "bool T01v01a,string T01v01b",
    encodedSchema: [
      { name: "T01v01a", value: true, type: "bool" },
      { name: "T01v01b", value: "1.0", type: "string" },
    ],
    refUID:
      "0x0000000000000000000000000000000000000000000000000000000000000000",
  },

  HumanL1: {
    expire: 1 * 1738156816,
    schema_uid: process.env.SCHEMA_T_002_UID,
    schemaEncoded: "bool T02v01a,string T02v01b",
    encodedSchema: [
      { name: "T02v01a", value: true, type: "bool" },
      { name: "T02v01b", value: "1.0", type: "string" },
    ],
    refUID: process.env.SCHEMA_T_001_UID,
  },
  HumanL2: {
    expire: 2 * 1738156816,

    schema_uid: process.env.SCHEMA_T_003_UID,
    schemaEncoded: "bool T003v00001A,uint16 T003v00001B",
    encodedSchema: [
      { name: "T003v00001A", value: true, type: "bool" },
      { name: "T003v00001B", value: 1, type: "uint16" },
    ],
    refUID: process.env.SCHEMA_T_001_UID,
  },
  HumanL3: {
    expire: 5 * 1738156816,

    schema_uid: process.env.SCHEMA_T_004_UID,
    schemaEncoded: "bool T004v00001A,uint16 T004v00001B",
    encodedSchema: [
      { name: "T004v00001A", value: true, type: "bool" },
      { name: "T004v00001B", value: 1, type: "uint16" },
    ],
    refUID: process.env.SCHEMA_T_001_UID,
  },
  HumanEmail: {
    expire: 2 * 1738156816,

    schema_uid: process.env.SCHEMA_T_005_UID,
    schemaEncoded: "string T005v00001A,uint16 T005v00001B",
    encodedSchema: [
      { name: "T005v00001A", value: email, type: "string" },
      { name: "T005v00001B", value: 1, type: "uint16" },
    ],
    refUID: process.env.SCHEMA_T_004_UID,
  },
  Creator: {
    expire: 5 * 1738156816,

    schema_uid: process.env.SCHEMA_T_006_UID,
    schemaEncoded: "bool T06v01a,string T06v01b",
    encodedSchema: [
      { name: "T06v01a", value: true, type: "bool" },
      { name: "T06v01b", value: "1", type: "string" },
    ],
    refUID: process.env.SCHEMA_T_006_UID,
  },
  Owner: {
    expire: 0 * 1738156816,

    schema_uid: process.env.SCHEMA_T_007_UID,
    schemaEncoded: "bool T07v01a,string T07v01b",
    encodedSchema: [
      { name: "T07v01a", value: true, type: "bool" },
      { name: "T07v01b", value: "1", type: "string" },
    ],
    refUID: process.env.SCHEMA_T_007_UID,
  },
  HumanName: {
    expire: 5 * 1738156816,

    schema_uid: process.env.SCHEMA_T_008_UID,
    schemaEncoded:
      "string T008v00001A,string T008v00001B,string T008v00001C,uint16 T008v00001D",
    encodedSchema: [
      { name: "T008v00001A", value: firstName, type: "string" },
      { name: "T008v00001B", value: middleName, type: "string" },
      { name: "T008v00001C", value: lastName, type: "string" },
      { name: "T008v00001D", value: 1, type: "uint16" },
    ],
    refUID: process.env.SCHEMA_T_004_UID,
  },
});
