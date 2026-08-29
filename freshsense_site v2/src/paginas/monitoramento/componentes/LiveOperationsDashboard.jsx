import { useCallback, useMemo, useState } from "react";
import { AlertCenter } from "./AlertCenter";
import { InventoryPanel } from "./InventoryPanel";
import { MetricOverview } from "./MetricOverview";
import { MonitoringCommandBar } from "./MonitoringCommandBar";
import { OperationsNetwork } from "./OperationsNetwork";
import { OperationsCopilot } from "./OperationsCopilot";
import { QualityCompliancePanel } from "./QualityCompliancePanel";
import { SensorFleet } from "./SensorFleet";
import { TelemetryPanel } from "./TelemetryPanel";
import { MonitoringViewNav } from "./MonitoringViewNav";
import { LotMonitor } from "./LotMonitor";

function createScopedMetrics(metrics, facility) {
  if (!facility) return metrics;

  return {
    ...metrics,
    stock: Math.round((facility.capacity * facility.occupancy) / 100),
    production: facility.production,
    availability: Math.max(
      92,
      metrics.availability - facility.alertCount * 1.8,
    ),
    coldChainCompliance: Math.max(
      93,
      metrics.coldChainCompliance - facility.alertCount * 1.4,
    ),
    sensorCoverage: (facility.onlineSensors / facility.totalSensors) * 100,
    quality: Math.max(90, metrics.quality - facility.alertCount * 1.2),
    wasteAvoided: Math.round(metrics.wasteAvoided * facility.productionShare),
    avgResponse: metrics.avgResponse + facility.alertCount * 1.6,
    activeLots: Math.round(metrics.activeLots * facility.productionShare),
    shipments: Math.max(
      1,
      Math.round(metrics.shipments * facility.productionShare),
    ),
  };
}

function createScopedHistory(history, facility) {
  if (!facility) return history;

  return history.map((point) => ({
    ...point,
    stock: Math.round(point.stock * facility.productionShare),
    production: Math.round(point.production * facility.productionShare),
    availability: Math.max(92, point.availability - facility.alertCount * 1.8),
    coldChainCompliance: Math.max(
      93,
      point.coldChainCompliance - facility.alertCount * 1.4,
    ),
    sensorCoverage: (facility.onlineSensors / facility.totalSensors) * 100,
    quality: Math.max(90, point.quality - facility.alertCount * 1.2),
    wasteAvoided: Math.round(point.wasteAvoided * facility.productionShare),
    avgResponse: point.avgResponse + facility.alertCount * 1.6,
  }));
}

function createScopedInventory(inventory, facility) {
  if (!facility) return inventory;

  return inventory.map((item) => {
    const amount = Math.round(item.amount * facility.productionShare);
    const capacity = Math.round(item.capacity * facility.productionShare);
    return {
      ...item,
      amount,
      capacity,
      occupancy: Math.round((amount / capacity) * 100),
    };
  });
}

export function LiveOperationsDashboard({ monitoring }) {
  const [activeView, setActiveView] = useState("overview");
  const [selectedMetric, setSelectedMetric] = useState("coldChainCompliance");
  const [facilityId, setFacilityId] = useState("todas");
  const [timeWindow, setTimeWindow] = useState(20);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [copilotIncident, setCopilotIncident] = useState(null);
  const selectedFacility = useMemo(
    () =>
      monitoring.facilities.find((facility) => facility.id === facilityId) ??
      null,
    [facilityId, monitoring.facilities],
  );
  const scopedMetrics = useMemo(
    () => createScopedMetrics(monitoring.metrics, selectedFacility),
    [monitoring.metrics, selectedFacility],
  );
  const scopedHistory = useMemo(
    () => createScopedHistory(monitoring.metricHistory, selectedFacility),
    [monitoring.metricHistory, selectedFacility],
  );
  const scopedInventory = useMemo(
    () => createScopedInventory(monitoring.inventory, selectedFacility),
    [monitoring.inventory, selectedFacility],
  );
  const visibleFacilities = useMemo(
    () => (selectedFacility ? [selectedFacility] : monitoring.facilities),
    [monitoring.facilities, selectedFacility],
  );
  const visibleSensors = useMemo(
    () =>
      selectedFacility
        ? monitoring.sensors.filter(
            (sensor) => sensor.facilityId === selectedFacility.id,
          )
        : monitoring.sensors,
    [monitoring.sensors, selectedFacility],
  );
  const visibleRoutes = useMemo(
    () =>
      selectedFacility
        ? monitoring.routes.filter(
            (route) => route.facilityId === selectedFacility.id,
          )
        : monitoring.routes,
    [monitoring.routes, selectedFacility],
  );
  const viewCounts = {
    overview: monitoring.pendingAlertCount,
    operation: visibleFacilities.length + visibleRoutes.length,
    assets: visibleSensors.length + monitoring.lots.length,
  };
  const openCopilot = useCallback((incident = null) => {
    setCopilotIncident(incident);
    setCopilotOpen(true);
  }, []);
  const closeCopilot = useCallback(() => setCopilotOpen(false), []);
  const copilotContext = useMemo(
    () => ({
      metrics: scopedMetrics,
      events: monitoring.events,
      lots: monitoring.lots,
      sensors: visibleSensors,
      routes: visibleRoutes,
      facilities: visibleFacilities,
      facility: selectedFacility,
      updatedAt: monitoring.updatedAt,
      selectedIncident: copilotIncident,
    }),
    [
      copilotIncident,
      monitoring.events,
      monitoring.lots,
      monitoring.updatedAt,
      scopedMetrics,
      selectedFacility,
      visibleFacilities,
      visibleRoutes,
      visibleSensors,
    ],
  );

  return (
    <section className="monitoring-enterprise-section">
      <div className="container monitoring-enterprise-shell">
        <MonitoringCommandBar
          monitoring={monitoring}
          facilities={monitoring.facilities}
          facilityId={facilityId}
          onFacilityChange={setFacilityId}
          timeWindow={timeWindow}
          onTimeWindowChange={setTimeWindow}
          onOpenCopilot={() => openCopilot()}
        />

        <MonitoringViewNav
          activeView={activeView}
          onChange={setActiveView}
          counts={viewCounts}
        />

        {activeView === "overview" && (
          <div
            className="monitoring-view-panel"
            id="monitoring-view-overview"
            role="tabpanel"
            aria-labelledby="monitoring-tab-overview"
          >
            <MetricOverview
              metrics={scopedMetrics}
              history={scopedHistory}
              selectedMetric={selectedMetric}
              onSelect={setSelectedMetric}
            />
            <div className="monitoring-primary-grid">
              <TelemetryPanel
                history={scopedHistory}
                selectedMetric={selectedMetric}
                timeWindow={timeWindow}
              />
              <AlertCenter
                events={monitoring.events}
                onAcknowledge={monitoring.acknowledgeEvent}
                onAssign={monitoring.assignEvent}
                onResolve={monitoring.resolveEvent}
                onAnalyze={openCopilot}
              />
            </div>
          </div>
        )}

        {activeView === "operation" && (
          <div
            className="monitoring-view-panel"
            id="monitoring-view-operation"
            role="tabpanel"
            aria-labelledby="monitoring-tab-operation"
          >
            <OperationsNetwork
              facilities={visibleFacilities}
              routes={visibleRoutes}
            />
            <div className="monitoring-secondary-grid">
              <QualityCompliancePanel
                compliance={monitoring.compliance}
                distribution={monitoring.qualityDistribution}
                metrics={scopedMetrics}
              />
              <InventoryPanel
                inventory={scopedInventory}
                metrics={scopedMetrics}
              />
            </div>
          </div>
        )}

        {activeView === "assets" && (
          <div
            className="monitoring-view-panel"
            id="monitoring-view-assets"
            role="tabpanel"
            aria-labelledby="monitoring-tab-assets"
          >
            <SensorFleet
              sensors={visibleSensors}
              facilities={visibleFacilities}
            />
            <LotMonitor lots={monitoring.lots} />
          </div>
        )}
      </div>
      <OperationsCopilot
        open={copilotOpen}
        onClose={closeCopilot}
        context={copilotContext}
      />
    </section>
  );
}
