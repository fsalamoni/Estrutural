import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Static assets cache: ideal para este projeto onde todos os dados
// são carregados client-side via Firebase (sem SSR/ISR). Não requer R2 bucket.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
