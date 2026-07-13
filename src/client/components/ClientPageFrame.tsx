import type { ReactNode } from "react";
import { ClientFooter } from "@/client/components/ClientFooter";
import { ClientNav } from "@/client/components/ClientNav";
import { FloatingGuestDock } from "@/client/components/FloatingGuestDock";
import { clientConfig, type ClientConfig } from "@/client/client.config";
import { FallingPetals } from "@/client/components/FallingPetals";

import type { EventWebsiteRenderModel } from "@/types/public-event";
import { getVisibleClientSectionKeys } from "@/client/client-section-registry";

type ClientPageFrameProps = {
  children: ReactNode;
  config?: ClientConfig;
  event?: EventWebsiteRenderModel;
  floatingControlsManaged?: boolean;
};

export function ClientPageFrame({
  children,
  config,
  event,
  floatingControlsManaged = false,
}: ClientPageFrameProps) {
  const resolvedConfig = config ?? clientConfig;
  const { footerEnabled, navEnabled } = resolvedConfig.layout;
  const visibleSectionKeys = event ? getVisibleClientSectionKeys(event) : [];

  if (!navEnabled && !footerEnabled) {
    return <>{children}</>;
  }

  return (
    <>
      {navEnabled ? (
        <ClientNav
          config={resolvedConfig}
          coupleDisplayName={event?.coupleDisplayName}
          visibleSectionKeys={visibleSectionKeys}
        />
      ) : null}
      <FallingPetals />
      <div className="relative">
        {children}
        {footerEnabled ? <ClientFooter config={resolvedConfig} /> : null}
      </div>
      {navEnabled && !floatingControlsManaged ? (
        <FloatingGuestDock visibleSectionKeys={visibleSectionKeys} />
      ) : null}
    </>
  );
}
