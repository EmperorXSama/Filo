export type FeatureStatus = 'live' | 'in-development' | 'planned' | 'future'

export interface RoadmapFeature {
  id: string
  title: string
  description: string
  status: FeatureStatus
  icon: string
  version?: string
  phaseLabel?: string
}

export interface RoadmapPhase {
  id: string
  title: string
  version: string
  status: FeatureStatus
  features: RoadmapFeature[]
}

export interface RoadmapEdge {
  id: string
  source: string
  target: string
}

export interface RoadmapConfig {
  phases: RoadmapPhase[]
  liveFeatures: RoadmapFeature[]
  edges: RoadmapEdge[]
}
