import type { ClientConfig } from "@/client/client.config";
import type { EventWebsiteRenderModel } from "@/types/public-event";

export type ClientEventRendererProps = {
  config: ClientConfig;
  event: EventWebsiteRenderModel;
};
