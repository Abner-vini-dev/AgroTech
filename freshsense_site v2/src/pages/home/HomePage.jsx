import { BenefitsSection } from "./components/BenefitsSection";
import { ConnectedOperationSection } from "./components/ConnectedOperationSection";
import { FeatureGateway } from "./components/FeatureGateway";
import { HomeHero } from "./components/HomeHero";
import { ImpactStrip } from "./components/ImpactStrip";
import { OperationsSection } from "./components/OperationsSection";
import { PlatformSection } from "./components/PlatformSection";
import { ProductSection } from "./components/ProductSection";

export function HomePage() {
  return (
    <>
      <HomeHero />
      <ImpactStrip />
      <FeatureGateway />
      <ConnectedOperationSection />
      <ProductSection />
      <BenefitsSection />
      <PlatformSection />
      <OperationsSection />
    </>
  );
}
