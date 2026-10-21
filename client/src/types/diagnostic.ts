export type SetupRecommendations = {
  brakeBias?: number;
  rearWing?: number;
  frontRideHeight?: number;
  rearRideHeight?: number;
  frontArb?: number;
  rearArb?: number;
  tirePressures?: number;
  tcCut?: number;
  tcSlip?: number;
};

export type DiagnosticResponse = {
  recommendations: SetupRecommendations;
};
