import fs from "fs";
import os from "os";
import path from "path";

type Config = {
  dbUrl: string;
  currentUserName: string;
};

function getConfigFilePath() {
  return path.join(os.homedir(), ".gatorconfig.json");
}

function writeConfig(cfg: Config) {
  const configPath = getConfigFilePath();
  const newConfig = {
    db_url: cfg.dbUrl,
    current_user_name: cfg.currentUserName,
  };
  fs.writeFileSync(configPath, JSON.stringify(newConfig), "utf-8");
}

function validateConfig(rawConfig: any): Config {
  if (!rawConfig || typeof rawConfig !== "object") {
    throw Error("config is not an object or is null!");
  }
  if (!rawConfig.db_url || typeof rawConfig.db_url !== "string") {
    throw Error("config missing db_url or not the correct type!");
  }
  if (
    !rawConfig.current_user_name ||
    typeof rawConfig.current_user_name !== "string"
  ) {
    throw Error("config missing current_user_name or not the correct type!");
  }

  return {
    dbUrl: rawConfig.db_url,
    currentUserName: rawConfig.current_user_name,
  };
}

export function readConfig(): Config {
  const configPath = getConfigFilePath();
  const configRaw = fs.readFileSync(configPath, "utf-8");
  return validateConfig(JSON.parse(configRaw));
}

export function setUser(user: string) {
  const config = readConfig();
  config.currentUserName = user;
  writeConfig(config);
}
