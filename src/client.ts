git push origin rama_secundariagit push origin rama_secundariaimport { createClient, type Client } from "@osdk/client";
import { createPublicOauthClient, type PublicOauthClient } from "@osdk/oauth";

function getMetaTagContent(tagName: string): string {
  const elements = document.querySelectorAll(`meta[name="${tagName}"]`);
  const element = elements.item(elements.length - 1);
  const value = element ? element.getAttribute("content") : null;
  if (value == null || value === "") {
    throw new Error(`Meta tag ${tagName} not found or empty`);
  }
  if (value.match(/%.+%/)) {
    throw new Error(
      `Meta tag ${tagName} contains placeholder value. Please add ${value.replace(
        /%/g,
        ""
      )} to your .env files`
    );
  }
  return value;
}

const foundryUrl = getMetaTagContent("osdk-foundryUrl");
const clientId = getMetaTagContent("osdk-clientId");
const redirectUrl = getMetaTagContent("osdk-redirectUrl");

const scopes = [
  "api:ontologies-read",
  "api:ontologies-write",
  "api:read-data",
  "api:write-data",
];

export const auth: PublicOauthClient = createPublicOauthClient(
  clientId,
  foundryUrl,
  redirectUrl,
  { scopes }
);

/**
 * Initialize the client to interact with the Platform SDK
 */
export const client: Client = createClient(
  foundryUrl,
  "ri.ontology.main.ontology.122b5e19-6632-4dd9-acb1-4a41f4571048",
  auth,
  {
    // Habilitar preview mode para permitir el uso de APIs en desarrollo
    preview: true,
  }
);

export default client;
