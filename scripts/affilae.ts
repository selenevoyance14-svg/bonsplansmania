import { fetchAffilae } from "../functions/lib/affilae";

const [resource = "profiles", ...args] = process.argv.slice(2);
const params = new URLSearchParams();
for (const arg of args) {
  const index = arg.indexOf("=");
  if (index < 1) throw new Error("Paramètre attendu : nom=valeur");
  params.set(arg.slice(0, index), arg.slice(index + 1));
}
fetchAffilae(resource, params, { AFFILAE_API_TOKEN: process.env.AFFILAE_API_TOKEN, AFFILAE_PROFILE_ID: process.env.AFFILAE_PROFILE_ID }).then(data => {
  process.stdout.write(JSON.stringify(data, null, 2) + "\n");
}).catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
