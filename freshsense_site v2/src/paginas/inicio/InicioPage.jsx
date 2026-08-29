import { BenefitsSection } from "./componentes/BenefitsSection";
import { ConnectedOperationSection } from "./componentes/ConnectedOperationSection";
import { CopilotSpotlight } from "./componentes/CopilotSpotlight";
import { FeatureGateway } from "./componentes/FeatureGateway";
import { HomeHero } from "./componentes/HomeHero";
import { ImpactStrip } from "./componentes/ImpactStrip";
import { OperationsSection } from "./componentes/OperationsSection";
import { PlatformSection } from "./componentes/PlatformSection";
import { ProductSection } from "./componentes/ProductSection";

export function InicioPage() {
  return (
    <>
      <HomeHero />
      <ImpactStrip />
      <CopilotSpotlight />
      <FeatureGateway />
      <ConnectedOperationSection />
      <ProductSection />
      <BenefitsSection />
      <PlatformSection />
      <OperationsSection />
    </>
  );
}
