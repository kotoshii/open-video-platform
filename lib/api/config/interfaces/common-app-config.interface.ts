import { NodeEnv } from "@ovp-lib/common/types/node-env";

export interface ICommonAppConfig {
	nodeEnv: NodeEnv;
	port: number;
	corsDomains: string[] | "*";
}
