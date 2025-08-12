const { execSync } = require("node:child_process");
const os = require("node:os");
const fs = require("node:fs");
const path = require("node:path");

const PB_FILES_DIR = "src";
const PB_FILES_DIR_PATH = path.join(process.cwd(), PB_FILES_DIR);
const TYPES_DIR = "generated";
const TYPES_DIR_PATH = path.join(process.cwd(), TYPES_DIR);

const isWindows = os.platform() === "win32";
const pluginPath = isWindows
	? "./node_modules/.bin/protoc-gen-ts_proto.cmd"
	: "./node_modules/.bin/protoc-gen-ts_proto";

const command = [
	"protoc",
	`--plugin=${pluginPath}`,
	`--proto_path=${PB_FILES_DIR_PATH}`,
	`--ts_proto_out=${TYPES_DIR_PATH}`,
	`${PB_FILES_DIR_PATH}/*.proto`,
	"--ts_proto_opt=lowerCaseServiceMethods=true",
	"--ts_proto_opt=outputEncodeMethods=false",
	"--ts_proto_opt=outputJsonMethods=false",
	"--ts_proto_opt=outputClientImpl=false",
	"--ts_proto_opt=snakeToCamel=true",
].join(" ");

try {
	if (!fs.existsSync(TYPES_DIR_PATH)) {
		fs.mkdirSync(TYPES_DIR_PATH);
		console.warn('"generated" directory not found! Created.');
	}

	execSync(command, { stdio: "inherit" });
	console.log("Protobuf types generated successfully");
} catch (error) {
	console.error("Failed to generate protobuf types:", error.message);
	process.exit(1);
}
