// Starts `next dev` with the app's settings loaded from AWS Secrets Manager.
// Usage: npm run dev:aws   (needs the AWS CLI, logged in to the dlp account)
import { execFileSync, spawn } from "node:child_process";

const SECRET_ID = "ci/dlp-access-next/deploy-app-secrets";

let secrets;
try {
  const secretString = execFileSync(
    "aws",
    ["secretsmanager", "get-secret-value", "--secret-id", SECRET_ID, "--query", "SecretString", "--output", "text"],
    { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] }
  );
  secrets = JSON.parse(secretString);
} catch {
  console.error(`Couldn't read ${SECRET_ID}. Check you're logged in to AWS (aws sts get-caller-identity) and try again.`);
  process.exit(1);
}

const dev = spawn("npx", ["next", "dev"], {
  stdio: "inherit",
  env: { ...process.env, ...secrets },
  shell: process.platform === "win32",
});
dev.on("exit", (code) => process.exit(code ?? 0));
