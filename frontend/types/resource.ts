/**
 * Resource inventory types — mirrors backend/models.py resource models.
 * Keep in sync with the backend models and docs/api-contract.md.
 */

export interface EC2Instance {
  id: string
  type: string
  state: 'running' | 'stopped' | 'pending' | 'terminated'
  region: string
  launch_time: string | null   // ISO 8601 UTC
  estimated_cost: number       // monthly USD estimate
  utilization: number | null   // average CPU % over evaluation period
}

export interface RDSInstance {
  id: string
  engine: string        // e.g. "postgres", "mysql"
  instance_class: string  // e.g. "db.t3.medium"
  status: string
  region: string
  estimated_cost: number
}

export interface S3Bucket {
  name: string
  region: string
  size_gb: number
  object_count: number
  estimated_cost: number
}

export interface ResourceInventory {
  ec2: EC2Instance[]
  rds: RDSInstance[]
  s3: S3Bucket[]
}
