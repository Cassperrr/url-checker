import { ConfigService, type Path } from '@nestjs/config';

type ConfigKey<TConfig> = Extract<keyof TConfig, string> & Path<TConfig>;

export function getConfigValue<
  TConfig extends Record<string, unknown>,
  K extends ConfigKey<TConfig>,
>(config: ConfigService<TConfig, true>, key: K): TConfig[K] {
  return config.get(key, { infer: true });
}
