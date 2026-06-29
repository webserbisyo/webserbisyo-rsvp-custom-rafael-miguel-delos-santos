import type { ReactNode } from "react";
import { ClientFooter } from "@/client/components/ClientFooter";
import { ClientNav } from "@/client/components/ClientNav";
import { FloatingGuestDock } from "@/client/components/FloatingGuestDock";
import { clientConfig, type ClientConfig } from "@/client/client.config";
import { FallingPetals } from "@/client/components/FallingPetals";

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
      <FallingPetals />
      {children}
      {footerEnabled ? <ClientFooter config={resolvedConfig} /> : null}
      {navEnabled ? <FloatingGuestDock /> : null}
    </>
  );
}
