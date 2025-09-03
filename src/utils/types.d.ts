export {};

declare global {
  // 🔹 HNG Configuration
  interface WelcomeConfig {
    MESSAGE: string;
    PORT: number;
    SWAGGER_DOC: string;
  }

  // 🔹 Application Configuration
  interface ApplicationConfig {
    PORT: number;
    ENVIRONMENT: string;
    JWT_SECRET: string;
    ACCESS_TOKEN_EXPIRES_IN: string;
    REFRESH_TOKEN_EXPIRES_IN: string;
    RESET_TOKEN_EXPIRES_IN: string;
    OTP_EXPIRES_IN: string;
    IS_WORKER: boolean;
    FRONTEND_URL: string;
    DOMAIN: string;
    HOST: string;
    BASE_URL: string;
    RULE_ENGINE_URL: string;
    FLASK_BASE_URL: string;
  }

  // 🔹 PostgreSQL Configuration
  interface PostgresConfig {
    HOST: string;
    PORT: number;
    DB: string;
    USERNAME: string;
    PASSWORD: string;
  }

  // 🔹 Mail Configuration
  interface MailConfig {
    DOMAIN: string;
    KEY: string;
    USERNAME: string;
    FROM: string;
    FROM_NAME: string;
    INQUIRY_DESTINATION: string;
    MAIL_USER: string;
    MAIL_PASS: string;
  }
  // 🔹 Mail Configuration
  interface MongoDbConfig {
    URI: string;
  }

  // 🔹 Full Config Structure
  interface Config {
    WELCOME: WelcomeConfig;
    APPLICATION: ApplicationConfig;
    MONGODB: MongoDbConfig;
    POSTGRES_CLOUD: MongoDbConfig;
    POSTGRES: PostgresConfig;
    MAIL: MailConfig;
  }

  interface AuthPayload {
    userId: string;
    role: string
  }
  
  
}
