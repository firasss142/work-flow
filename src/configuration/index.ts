require("dotenv").config();

export const DATA_BASE_CONFIGURATION = {
  mongoConnectionString:
    process.env.NODE_ENV === "dev"
      ? (process.env.CLEAN_NEST_MONGO_CONNECTION_STRING as string)
      : `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/?tls=false&authSource=admin`,
};
export const MAILER_HOST = process.env.MAILER_HOST;
export const MAILER_PORT = process.env.MAILER_PORT;
export const MAILER_USER = process.env.MAILER_USER;
export const MAILER_PASSWORD = process.env.MAILER_PASSWORD;
export const MAILER_SENDER = process.env.MAILER_SENDER;
export const SECRET_KEY = process.env.SECRET_KEY;
export const BASE_URL = process.env.BASE_URL;
export const FRONT_END_URL = process.env.FRONT_END_URL;

export const PROVIDER = process.env.PROVIDER;
export const SIGNER = process.env.SIGNER;
export const EAS_CONTRACT_ADDRESS = process.env.EAS_CONTRACT_ADDRESS;
export const SCHEMA_UID = process.env.SCHEMA_T_001_UID;
