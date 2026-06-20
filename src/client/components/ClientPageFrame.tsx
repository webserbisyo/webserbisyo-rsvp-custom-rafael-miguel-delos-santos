import type { ReactNode } from "react";
import { ClientFooter } from "@/client/components/ClientFooter";
import { ClientNav } from "@/client/components/ClientNav";
import { clientConfig, type ClientConfig } from "@/client/client.config";

import type { EventWebsiteRenderModel } from "@/types/public-event";

type ClientPageFrameProps = {
  children: ReactNode;
  config?: ClientConfig;
  event?: EventWebsiteRenderModel;
};

export function ClientPageFrame({ children, config }: ClientPageFrameProps) {
  const resolvedConfig = config ?? clientConfig;
  const { footerEnabled, navEnabled } = resolvedConfig.layout;

  if (!navEnabled && !footerEnabled) {
    return <>{children}</>;
  }

  return (
    <>
      {navEnabled ? <ClientNav config={resolvedConfig} /> : null}
      {children}
      {footerEnabled ? <ClientFooter config={resolvedConfig} /> : null}
    </>
  );
}
