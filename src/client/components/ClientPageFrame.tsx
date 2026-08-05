import type { ReactNode } from "react";
import { ClientFooter } from "@/client/components/ClientFooter";
import { ClientNav } from "@/client/components/ClientNav";
import { FloatingGuestDock } from "@/client/components/FloatingGuestDock";
import { clientConfig, type ClientConfig } from "@/client/client.config";
import { FallingPetals } from "@/client/components/FallingPetals";

import type { EventWebsiteRenderModel } from "@/types/public-event";
import { getVisibleClientSectionKeys } from "@/client/client-section-registry";
import { buildClientViewModel } from "@/client/types/build-client-view-model";

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

  const branding = event
    ? buildClientViewModel((event.raw.renderModel ?? {}) as Record<string, unknown>).branding
    : undefined;

  return (
    <div className="relative" data-wedding-theme={resolvedConfig.theme.id}>
      {navEnabled ? (
        <ClientNav
          config={resolvedConfig}
          coupleDisplayName={event?.coupleDisplayName}
          visibleSectionKeys={visibleSectionKeys}
          branding={branding}
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
    </div>
  );
}
