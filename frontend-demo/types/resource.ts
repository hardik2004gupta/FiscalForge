export interface DemoEC2Instance {
  id: string
  name: string
  type: string
  state: 'running' | 'stopped' | 'stopping' | 'pending'
  region: string
  launch_time: string
  estimated_cost: number
  utilization: number | null
  has_recommendation: boolean
}

export interface DemoRDSInstance {
  id: string
  engine: string
  engine_version: string
  instance_class: string
  status: 'available' | 'stopped' | 'backing-up'
  region: string
  estimated_cost: number
  multi_az: boolean
}

export interface DemoS3Bucket {
  name: string
  region: string
  size_gb: number
  object_count: number
  estimated_cost: number
  has_recommendation: boolean
}

export interface DemoResourceInventory {
  ec2: DemoEC2Instance[]
  rds: DemoRDSInstance[]
  s3: DemoS3Bucket[]
}
