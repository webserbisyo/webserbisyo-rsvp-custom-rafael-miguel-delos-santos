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
  floatingControlsManaged?: boolean;
};

export function ClientPageFrame({ children, config, floatingControlsManaged = false }: ClientPageFrameProps) {
  const resolvedConfig = config ?? clientConfig;
  const { footerEnabled, navEnabled } = resolvedConfig.layout;

  if (!navEnabled && !footerEnabled) {
    return <>{children}</>;
  }

  return (
    <>
      {navEnabled ? <ClientNav config={resolvedConfig} /> : null}
      <FallingPetals />
      <div className="relative z-10">
        {children}
        {footerEnabled ? <ClientFooter config={resolvedConfig} /> : null}
      </div>
      {navEnabled && !floatingControlsManaged ? <FloatingGuestDock /> : null}
    </>
  );
}
