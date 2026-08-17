import type { DemoResourceInventory, DemoEC2Instance, DemoRDSInstance, DemoS3Bucket } from '@/types/resource'

// EC2 instances — 42 total
// Instances appearing in recommendations are flagged has_recommendation: true
const EC2_INSTANCES: DemoEC2Instance[] = [
  // ── High utilization — production ──────────────────────────────
  { id: 'i-0a1b2c3d4e5f00001', name: 'prod-api-01',         type: 'm5.2xlarge', state: 'running', region: 'us-east-1', launch_time: '2025-01-15T08:00:00Z', estimated_cost: 277.08, utilization: 74.3,  has_recommendation: false },
  { id: 'i-0a1b2c3d4e5f00002', name: 'prod-api-02',         type: 'm5.2xlarge', state: 'running', region: 'us-east-1', launch_time: '2025-01-15T08:00:00Z', estimated_cost: 277.08, utilization: 68.9,  has_recommendation: false },
  { id: 'i-0a1b2c3d4e5f00003', name: 'prod-api-03',         type: 'm5.xlarge',  state: 'running', region: 'us-east-1', launch_time: '2025-02-01T10:00:00Z', estimated_cost: 138.54, utilization: 62.1,  has_recommendation: false },
  { id: 'i-0a1b2c3d4e5f00004', name: 'prod-api-04',         type: 'm5.large',   state: 'running', region: 'eu-west-1', launch_time: '2025-03-01T09:00:00Z', estimated_cost:  69.77, utilization: 51.3,  has_recommendation: false },
  { id: 'i-0a1b2c3d4e5f00005', name: 'prod-api-05',         type: 'm5.large',   state: 'running', region: 'eu-west-1', launch_time: '2025-03-01T09:00:00Z', estimated_cost:  69.77, utilization: 47.8,  has_recommendation: false },
  { id: 'i-0a1b2c3d4e5f00006', name: 'prod-worker-01',      type: 'c5.xlarge',  state: 'running', region: 'us-east-1', launch_time: '2025-01-20T11:00:00Z', estimated_cost: 122.56, utilization: 81.2,  has_recommendation: false },
  { id: 'i-0a1b2c3d4e5f00007', name: 'prod-worker-02',      type: 'c5.xlarge',  state: 'running', region: 'us-east-1', launch_time: '2025-01-20T11:00:00Z', estimated_cost: 122.56, utilization: 77.5,  has_recommendation: false },
  { id: 'i-0a1b2c3d4e5f00008', name: 'prod-worker-03',      type: 'c5.xlarge',  state: 'running', region: 'us-east-1', launch_time: '2025-01-20T11:00:00Z', estimated_cost: 122.56, utilization: 71.8,  has_recommendation: false },
  { id: 'i-0a1b2c3d4e5f00009', name: 'prod-db-proxy-01',    type: 'r5.xlarge',  state: 'running', region: 'us-east-1', launch_time: '2025-01-10T08:00:00Z', estimated_cost: 182.52, utilization: 44.8,  has_recommendation: false },
  { id: 'i-0a1b2c3d4e5f00010', name: 'prod-cache-01',       type: 'r5.large',   state: 'running', region: 'us-east-1', launch_time: '2025-01-12T08:00:00Z', estimated_cost:  91.26, utilization: 38.4,  has_recommendation: false },
  { id: 'i-0a1b2c3d4e5f00011', name: 'prod-search-01',      type: 'r5.xlarge',  state: 'running', region: 'us-east-1', launch_time: '2025-02-14T09:00:00Z', estimated_cost: 182.52, utilization: 33.6,  has_recommendation: false },
  { id: 'i-0a1b2c3d4e5f00012', name: 'prod-redis-01',       type: 'r5.large',   state: 'running', region: 'us-east-1', launch_time: '2025-01-12T08:00:00Z', estimated_cost:  91.26, utilization: 35.7,  has_recommendation: false },
  { id: 'i-0a1b2c3d4e5f00013', name: 'data-lake-01',        type: 'r5.2xlarge', state: 'running', region: 'us-east-1', launch_time: '2025-02-08T07:00:00Z', estimated_cost: 365.04, utilization: 27.4,  has_recommendation: false },
  { id: 'i-0a1b2c3d4e5f00014', name: 'kafka-01',            type: 'm5.xlarge',  state: 'running', region: 'us-east-1', launch_time: '2025-01-25T10:00:00Z', estimated_cost: 138.54, utilization: 41.2,  has_recommendation: false },
  // ── Rightsizing candidates ──────────────────────────────────────
  { id: 'i-0a1b2c3d4e5f00015', name: 'prod-analytics-01',   type: 'm5.4xlarge', state: 'running', region: 'us-east-1', launch_time: '2025-03-02T08:00:00Z', estimated_cost: 554.16, utilization: 18.4,  has_recommendation: true  },
  { id: 'i-0a1b2c3d4e5f00016', name: 'prod-analytics-02',   type: 'm5.2xlarge', state: 'running', region: 'us-east-1', launch_time: '2025-03-02T08:00:00Z', estimated_cost: 277.08, utilization: 21.3,  has_recommendation: true  },
  { id: 'i-0a1b2c3d4e5f00017', name: 'data-processing-01',  type: 'c5.2xlarge', state: 'running', region: 'us-east-1', launch_time: '2025-03-15T09:00:00Z', estimated_cost: 245.12, utilization: 16.9,  has_recommendation: true  },
  { id: 'i-0a1b2c3d4e5f00018', name: 'reporting-svc-01',    type: 'r5.2xlarge', state: 'running', region: 'us-east-1', launch_time: '2025-02-20T10:00:00Z', estimated_cost: 365.04, utilization: 19.2,  has_recommendation: true  },
  // ── Underutilized ───────────────────────────────────────────────
  { id: 'i-0a1b2c3d4e5f00019', name: 'batch-worker-07',     type: 'm5.xlarge',  state: 'running', region: 'us-east-1', launch_time: '2025-06-14T08:00:00Z', estimated_cost: 138.54, utilization:  4.8,  has_recommendation: true  },
  { id: 'i-0a1b2c3d4e5f00020', name: 'dev-api-01',          type: 't3.large',   state: 'running', region: 'us-east-1', launch_time: '2025-05-18T09:00:00Z', estimated_cost:  60.74, utilization:  3.2,  has_recommendation: true  },
  { id: 'i-0a1b2c3d4e5f00021', name: 'dev-worker-01',       type: 'm5.large',   state: 'running', region: 'us-east-1', launch_time: '2025-06-23T10:00:00Z', estimated_cost:  69.77, utilization:  6.1,  has_recommendation: true  },
  { id: 'i-0a1b2c3d4e5f00022', name: 'test-runner-01',      type: 'c5.large',   state: 'running', region: 'us-east-1', launch_time: '2025-07-09T11:00:00Z', estimated_cost:  61.28, utilization:  7.8,  has_recommendation: true  },
  { id: 'i-0a1b2c3d4e5f00023', name: 'ml-experiment-01',    type: 'm5.2xlarge', state: 'running', region: 'us-east-1', launch_time: '2025-06-30T08:00:00Z', estimated_cost: 277.08, utilization:  2.3,  has_recommendation: true  },
  { id: 'i-0a1b2c3d4e5f00024', name: 'sandbox-01',          type: 't3.large',   state: 'running', region: 'us-east-1', launch_time: '2025-06-06T09:00:00Z', estimated_cost:  60.74, utilization:  5.5,  has_recommendation: true  },
  { id: 'i-0a1b2c3d4e5f00025', name: 'legacy-service-01',   type: 'm5.xlarge',  state: 'running', region: 'us-east-1', launch_time: '2025-04-26T07:00:00Z', estimated_cost: 138.54, utilization:  8.9,  has_recommendation: true  },
  // ── Stopped ─────────────────────────────────────────────────────
  { id: 'i-0a1b2c3d4e5f00026', name: 'prod-worker-04',      type: 'c5.xlarge',  state: 'stopped', region: 'us-east-1', launch_time: '2025-01-20T11:00:00Z', estimated_cost:   0,    utilization: null, has_recommendation: false },
  { id: 'i-0a1b2c3d4e5f00027', name: 'dev-api-02',          type: 't3.medium',  state: 'stopped', region: 'us-east-1', launch_time: '2025-04-10T09:00:00Z', estimated_cost:   0,    utilization: null, has_recommendation: false },
  { id: 'i-0a1b2c3d4e5f00028', name: 'test-env-01',         type: 'm5.large',   state: 'stopped', region: 'us-east-1', launch_time: '2025-05-01T10:00:00Z', estimated_cost:   0,    utilization: null, has_recommendation: false },
  // ── Other running ───────────────────────────────────────────────
  { id: 'i-0a1b2c3d4e5f00029', name: 'monitoring-01',       type: 't3.large',   state: 'running', region: 'us-east-1', launch_time: '2025-01-18T08:00:00Z', estimated_cost:  60.74, utilization: 15.3,  has_recommendation: false },
  { id: 'i-0a1b2c3d4e5f00030', name: 'logging-01',          type: 'm5.large',   state: 'running', region: 'us-east-1', launch_time: '2025-01-18T08:00:00Z', estimated_cost:  69.77, utilization: 22.7,  has_recommendation: false },
  { id: 'i-0a1b2c3d4e5f00031', name: 'kafka-02',            type: 'm5.xlarge',  state: 'running', region: 'us-east-1', launch_time: '2025-01-25T10:00:00Z', estimated_cost: 138.54, utilization: 38.8,  has_recommendation: false },
  { id: 'i-0a1b2c3d4e5f00032', name: 'ci-build-01',         type: 'c5.2xlarge', state: 'running', region: 'us-east-1', launch_time: '2025-02-05T09:00:00Z', estimated_cost: 245.12, utilization: 29.4,  has_recommendation: false },
  { id: 'i-0a1b2c3d4e5f00033', name: 'ci-build-02',         type: 'c5.2xlarge', state: 'running', region: 'us-east-1', launch_time: '2025-02-05T09:00:00Z', estimated_cost: 245.12, utilization: 26.8,  has_recommendation: false },
  { id: 'i-0a1b2c3d4e5f00034', name: 'zookeeper-01',        type: 't3.medium',  state: 'running', region: 'us-east-1', launch_time: '2025-04-13T10:00:00Z', estimated_cost:  30.36, utilization:  8.4,  has_recommendation: true  },
  { id: 'i-0a1b2c3d4e5f00035', name: 'staging-api-01',      type: 'm5.xlarge',  state: 'running', region: 'us-west-2', launch_time: '2025-03-10T09:00:00Z', estimated_cost: 138.54, utilization: 28.4,  has_recommendation: false },
  { id: 'i-0a1b2c3d4e5f00036', name: 'staging-api-02',      type: 'm5.large',   state: 'running', region: 'us-west-2', launch_time: '2025-03-10T09:00:00Z', estimated_cost:  69.77, utilization: 24.1,  has_recommendation: false },
  { id: 'i-0a1b2c3d4e5f00037', name: 'staging-db-01',       type: 'r5.large',   state: 'running', region: 'us-west-2', launch_time: '2025-03-10T09:00:00Z', estimated_cost:  91.26, utilization: 18.2,  has_recommendation: false },
  { id: 'i-0a1b2c3d4e5f00038', name: 'staging-worker-01',   type: 'c5.large',   state: 'running', region: 'us-west-2', launch_time: '2025-03-10T09:00:00Z', estimated_cost:  61.28, utilization: 31.7,  has_recommendation: false },
  { id: 'i-0a1b2c3d4e5f00039', name: 'prod-bastion',        type: 't3.small',   state: 'running', region: 'us-east-1', launch_time: '2025-01-10T07:00:00Z', estimated_cost:  15.18, utilization:  2.1,  has_recommendation: false },
  { id: 'i-0a1b2c3d4e5f00040', name: 'prod-nat-01',         type: 't3.medium',  state: 'running', region: 'us-east-1', launch_time: '2025-01-10T07:00:00Z', estimated_cost:  30.36, utilization:  5.2,  has_recommendation: false },
  { id: 'i-0a1b2c3d4e5f00041', name: 'vpn-gateway',         type: 't3.small',   state: 'running', region: 'us-east-1', launch_time: '2025-01-10T07:00:00Z', estimated_cost:  15.18, utilization:  4.1,  has_recommendation: false },
  { id: 'i-0a1b2c3d4e5f00042', name: 'ml-experiment-02',    type: 'm5.xlarge',  state: 'running', region: 'us-east-1', launch_time: '2025-07-16T10:00:00Z', estimated_cost: 138.54, utilization:  9.7,  has_recommendation: false },
]

// RDS instances — 8 total
const RDS_INSTANCES: DemoRDSInstance[] = [
  { id: 'prod-postgres-01',    engine: 'PostgreSQL', engine_version: '15.4', instance_class: 'db.r6g.2xlarge', status: 'available', region: 'us-east-1', estimated_cost: 756.29, multi_az: true  },
  { id: 'prod-aurora-01',      engine: 'Aurora PostgreSQL', engine_version: '15.4', instance_class: 'db.r6g.2xlarge', status: 'available', region: 'us-east-1', estimated_cost: 756.29, multi_az: true  },
  { id: 'prod-mysql-01',       engine: 'MySQL',      engine_version: '8.0.35', instance_class: 'db.r6g.xlarge',  status: 'available', region: 'us-east-1', estimated_cost: 378.14, multi_az: true  },
  { id: 'analytics-postgres-01', engine: 'PostgreSQL', engine_version: '14.9', instance_class: 'db.r6g.xlarge', status: 'available', region: 'us-east-1', estimated_cost: 378.14, multi_az: false },
  { id: 'staging-postgres-01', engine: 'PostgreSQL', engine_version: '15.4', instance_class: 'db.t3.large',   status: 'available', region: 'us-west-2', estimated_cost: 124.56, multi_az: false },
  { id: 'reporting-mysql-01',  engine: 'MySQL',      engine_version: '8.0.35', instance_class: 'db.t3.medium',  status: 'available', region: 'us-east-1', estimated_cost:  52.56, multi_az: false },
  { id: 'dev-postgres-01',     engine: 'PostgreSQL', engine_version: '15.4', instance_class: 'db.t3.small',   status: 'available', region: 'us-east-1', estimated_cost:  26.28, multi_az: false },
  { id: 'test-mysql-01',       engine: 'MySQL',      engine_version: '8.0.35', instance_class: 'db.t3.micro',   status: 'stopped',   region: 'us-east-1', estimated_cost:  13.14, multi_az: false },
]

// S3 buckets — 97 total
// Key buckets that appear in recommendations are flagged
const S3_BUCKETS: DemoS3Bucket[] = [
  // ── Large / recommendation buckets ──────────────────────────────
  { name: 'analytics-archive',        region: 'us-east-1', size_gb: 8421.4, object_count: 2841923, estimated_cost: 193.69, has_recommendation: true  },
  { name: 'ml-training-data',         region: 'us-east-1', size_gb: 6128.3, object_count: 1420834, estimated_cost: 140.95, has_recommendation: true  },
  { name: 'data-lake-backup',         region: 'us-west-2', size_gb: 4218.7, object_count:  983421, estimated_cost:  97.03, has_recommendation: true  },
  { name: 'data-lake-raw',            region: 'us-east-1', size_gb: 2841.2, object_count: 1284192, estimated_cost:  65.35, has_recommendation: false },
  { name: 'data-lake-processed',      region: 'us-east-1', size_gb: 1924.8, object_count:  748291, estimated_cost:  44.27, has_recommendation: false },
  // ── Production ──────────────────────────────────────────────────
  { name: 'prod-api-assets',          region: 'us-east-1', size_gb:  124.5, object_count:   48291, estimated_cost:   2.86, has_recommendation: false },
  { name: 'prod-user-uploads',        region: 'us-east-1', size_gb:  892.3, object_count:  381042, estimated_cost:  20.52, has_recommendation: false },
  { name: 'prod-app-config',          region: 'us-east-1', size_gb:    2.4, object_count:    1284, estimated_cost:   0.06, has_recommendation: false },
  { name: 'prod-static-assets',       region: 'us-east-1', size_gb:   84.2, object_count:   38421, estimated_cost:   1.94, has_recommendation: false },
  { name: 'prod-media-storage',       region: 'us-east-1', size_gb:  471.8, object_count:  128430, estimated_cost:  10.85, has_recommendation: false },
  { name: 'prod-build-artifacts',     region: 'us-east-1', size_gb:   38.4, object_count:    8421, estimated_cost:   0.88, has_recommendation: false },
  { name: 'prod-lambda-deployments',  region: 'us-east-1', size_gb:    4.8, object_count:    1842, estimated_cost:   0.11, has_recommendation: false },
  { name: 'prod-terraform-state',     region: 'us-east-1', size_gb:    0.4, object_count:      84, estimated_cost:   0.01, has_recommendation: false },
  { name: 'prod-code-artifacts',      region: 'us-east-1', size_gb:   18.4, object_count:    4821, estimated_cost:   0.42, has_recommendation: false },
  { name: 'prod-env-configs',         region: 'us-east-1', size_gb:    0.8, object_count:     284, estimated_cost:   0.02, has_recommendation: false },
  // ── Staging ──────────────────────────────────────────────────────
  { name: 'staging-api-assets',       region: 'us-west-2', size_gb:   48.2, object_count:   18421, estimated_cost:   1.11, has_recommendation: false },
  { name: 'staging-user-uploads',     region: 'us-west-2', size_gb:  124.8, object_count:   48291, estimated_cost:   2.87, has_recommendation: false },
  { name: 'staging-app-config',       region: 'us-west-2', size_gb:    1.8, object_count:     842, estimated_cost:   0.04, has_recommendation: false },
  { name: 'staging-media',            region: 'us-west-2', size_gb:   84.4, object_count:   28410, estimated_cost:   1.94, has_recommendation: false },
  { name: 'staging-build',            region: 'us-west-2', size_gb:   18.2, object_count:    4821, estimated_cost:   0.42, has_recommendation: false },
  { name: 'staging-terraform',        region: 'us-west-2', size_gb:    0.3, object_count:      48, estimated_cost:   0.01, has_recommendation: false },
  { name: 'staging-lambda',           region: 'us-west-2', size_gb:    2.4, object_count:     841, estimated_cost:   0.06, has_recommendation: false },
  { name: 'staging-env-configs',      region: 'us-west-2', size_gb:    0.6, object_count:     192, estimated_cost:   0.01, has_recommendation: false },
  // ── Backup ───────────────────────────────────────────────────────
  { name: 'prod-database-backups',    region: 'us-east-1', size_gb:  841.2, object_count:   28410, estimated_cost:  19.35, has_recommendation: false },
  { name: 'prod-snapshot-archives',   region: 'us-east-1', size_gb:  482.4, object_count:   18421, estimated_cost:  11.10, has_recommendation: false },
  { name: 'staging-database-backups', region: 'us-west-2', size_gb:  248.4, object_count:    8421, estimated_cost:   5.71, has_recommendation: false },
  { name: 'dr-archives',              region: 'us-west-2', size_gb: 1248.4, object_count:   48291, estimated_cost:  28.71, has_recommendation: false },
  { name: 'compliance-archives',      region: 'us-east-1', size_gb:  384.2, object_count:   14821, estimated_cost:   8.84, has_recommendation: false },
  { name: 'config-backups',           region: 'us-east-1', size_gb:    8.4, object_count:    2841, estimated_cost:   0.19, has_recommendation: false },
  { name: 'ami-backups',              region: 'us-east-1', size_gb:  284.8, object_count:     841, estimated_cost:   6.55, has_recommendation: false },
  { name: 'audit-logs-archive',       region: 'us-east-1', size_gb:  648.2, object_count:   28410, estimated_cost:  14.91, has_recommendation: false },
  // ── Logs ─────────────────────────────────────────────────────────
  { name: 'prod-application-logs',    region: 'us-east-1', size_gb:  284.2, object_count:  284102, estimated_cost:   6.54, has_recommendation: false },
  { name: 'prod-access-logs',         region: 'us-east-1', size_gb:  148.4, object_count:  148421, estimated_cost:   3.41, has_recommendation: false },
  { name: 'prod-error-logs',          region: 'us-east-1', size_gb:   48.2, object_count:   48291, estimated_cost:   1.11, has_recommendation: false },
  { name: 'prod-audit-logs',          region: 'us-east-1', size_gb:   84.8, object_count:   84102, estimated_cost:   1.95, has_recommendation: false },
  { name: 'prod-lambda-logs',         region: 'us-east-1', size_gb:   24.4, object_count:   24102, estimated_cost:   0.56, has_recommendation: false },
  { name: 'staging-application-logs', region: 'us-west-2', size_gb:   84.2, object_count:   84291, estimated_cost:   1.94, has_recommendation: false },
  { name: 'staging-access-logs',      region: 'us-west-2', size_gb:   48.4, object_count:   48421, estimated_cost:   1.11, has_recommendation: false },
  { name: 'cloudtrail-logs',          region: 'us-east-1', size_gb:  124.8, object_count:  124102, estimated_cost:   2.87, has_recommendation: false },
  { name: 'vpc-flow-logs',            region: 'us-east-1', size_gb:  248.4, object_count:  248102, estimated_cost:   5.71, has_recommendation: false },
  { name: 'elb-access-logs',          region: 'us-east-1', size_gb:   84.2, object_count:   84291, estimated_cost:   1.94, has_recommendation: false },
  // ── Dev / Test ───────────────────────────────────────────────────
  { name: 'dev-api-assets',           region: 'us-east-1', size_gb:   12.4, object_count:    4821, estimated_cost:   0.29, has_recommendation: false },
  { name: 'dev-user-uploads',         region: 'us-east-1', size_gb:   18.8, object_count:    7291, estimated_cost:   0.43, has_recommendation: false },
  { name: 'dev-test-data',            region: 'us-east-1', size_gb:   48.4, object_count:   18421, estimated_cost:   1.11, has_recommendation: false },
  { name: 'dev-build-artifacts',      region: 'us-east-1', size_gb:   14.2, object_count:    4102, estimated_cost:   0.33, has_recommendation: false },
  { name: 'dev-lambda-deployments',   region: 'us-east-1', size_gb:    1.8, object_count:     841, estimated_cost:   0.04, has_recommendation: false },
  { name: 'dev-env-configs',          region: 'us-east-1', size_gb:    0.4, object_count:     128, estimated_cost:   0.01, has_recommendation: false },
  { name: 'dev-temp',                 region: 'us-east-1', size_gb:    8.4, object_count:    2841, estimated_cost:   0.19, has_recommendation: false },
  { name: 'dev-sandbox',              region: 'us-east-1', size_gb:   24.8, object_count:    8421, estimated_cost:   0.57, has_recommendation: false },
  { name: 'dev-experiments',          region: 'us-east-1', size_gb:   48.2, object_count:   18291, estimated_cost:   1.11, has_recommendation: false },
  // ── Test ─────────────────────────────────────────────────────────
  { name: 'test-fixtures',            region: 'us-east-1', size_gb:    4.8, object_count:    1841, estimated_cost:   0.11, has_recommendation: false },
  { name: 'test-snapshots',           region: 'us-east-1', size_gb:   14.4, object_count:    4821, estimated_cost:   0.33, has_recommendation: false },
  { name: 'test-coverage-reports',    region: 'us-east-1', size_gb:    2.4, object_count:     841, estimated_cost:   0.06, has_recommendation: false },
  { name: 'test-output',              region: 'us-east-1', size_gb:    8.4, object_count:    2841, estimated_cost:   0.19, has_recommendation: false },
  { name: 'qa-test-data',             region: 'us-east-1', size_gb:   24.8, object_count:    8421, estimated_cost:   0.57, has_recommendation: false },
  { name: 'integration-test-data',    region: 'us-east-1', size_gb:   18.4, object_count:    6821, estimated_cost:   0.42, has_recommendation: false },
  { name: 'performance-test-results', region: 'us-east-1', size_gb:   12.8, object_count:    4821, estimated_cost:   0.29, has_recommendation: false },
  // ── ML / AI ──────────────────────────────────────────────────────
  { name: 'ml-experiment-01-data',    region: 'us-east-1', size_gb:  248.4, object_count:   48291, estimated_cost:   5.71, has_recommendation: false },
  { name: 'ml-experiment-02-data',    region: 'us-east-1', size_gb:  184.8, object_count:   28410, estimated_cost:   4.25, has_recommendation: false },
  { name: 'ml-feature-store',         region: 'us-east-1', size_gb:  841.2, object_count:  284102, estimated_cost:  19.35, has_recommendation: false },
  { name: 'llm-fine-tuning',          region: 'us-east-1', size_gb:  384.4, object_count:   84102, estimated_cost:   8.84, has_recommendation: false },
  { name: 'nlp-models',               region: 'us-east-1', size_gb:  124.8, object_count:    4821, estimated_cost:   2.87, has_recommendation: false },
  { name: 'cv-models',                region: 'us-east-1', size_gb:   84.4, object_count:    2841, estimated_cost:   1.94, has_recommendation: false },
  { name: 'ml-inference-cache',       region: 'us-east-1', size_gb:   48.2, object_count:   18421, estimated_cost:   1.11, has_recommendation: false },
  { name: 'ml-models',                region: 'us-east-1', size_gb:  284.8, object_count:    8421, estimated_cost:   6.55, has_recommendation: false },
  // ── Analytics ────────────────────────────────────────────────────
  { name: 'analytics-reports',        region: 'us-east-1', size_gb:   84.2, object_count:   28410, estimated_cost:   1.94, has_recommendation: false },
  { name: 'analytics-dashboards',     region: 'us-east-1', size_gb:    4.8, object_count:    1841, estimated_cost:   0.11, has_recommendation: false },
  { name: 'data-exports',             region: 'us-east-1', size_gb:  148.4, object_count:   48291, estimated_cost:   3.41, has_recommendation: false },
  { name: 'bi-reports',               region: 'us-east-1', size_gb:   24.8, object_count:    8421, estimated_cost:   0.57, has_recommendation: false },
  // ── Archive ──────────────────────────────────────────────────────
  { name: 'archive-2023',             region: 'us-east-1', size_gb:  841.2, object_count:  284102, estimated_cost:  19.35, has_recommendation: false },
  { name: 'archive-2022',             region: 'us-east-1', size_gb: 1248.4, object_count:  384102, estimated_cost:  28.71, has_recommendation: false },
  { name: 'deprecated-config',        region: 'us-east-1', size_gb:    2.4, object_count:     841, estimated_cost:   0.06, has_recommendation: false },
  { name: 'old-media-archive',        region: 'us-east-1', size_gb:  484.8, object_count:  148291, estimated_cost:  11.15, has_recommendation: false },
  // ── Media / Assets ───────────────────────────────────────────────
  { name: 'media-originals',          region: 'us-east-1', size_gb:  648.4, object_count:   84291, estimated_cost:  14.91, has_recommendation: false },
  { name: 'media-thumbnails',         region: 'us-east-1', size_gb:   84.8, object_count:  248102, estimated_cost:   1.95, has_recommendation: false },
  { name: 'media-transcoded',         region: 'us-east-1', size_gb:  284.4, object_count:   48291, estimated_cost:   6.54, has_recommendation: false },
  { name: 'assets-cdn',               region: 'us-east-1', size_gb:   48.2, object_count:   18421, estimated_cost:   1.11, has_recommendation: false },
  { name: 'static-site-assets',       region: 'us-east-1', size_gb:   12.4, object_count:    4821, estimated_cost:   0.29, has_recommendation: false },
  { name: 'public-uploads',           region: 'us-east-1', size_gb:  124.8, object_count:   48291, estimated_cost:   2.87, has_recommendation: false },
  // ── Misc ─────────────────────────────────────────────────────────
  { name: 'compliance-reports',       region: 'us-east-1', size_gb:   84.2, object_count:   28410, estimated_cost:   1.94, has_recommendation: false },
  { name: 'security-scan-results',    region: 'us-east-1', size_gb:   24.8, object_count:    8421, estimated_cost:   0.57, has_recommendation: false },
  { name: 'monitoring-data',          region: 'us-east-1', size_gb:  124.8, object_count:   84291, estimated_cost:   2.87, has_recommendation: false },
  { name: 'infra-docs',               region: 'us-east-1', size_gb:    1.4, object_count:     841, estimated_cost:   0.03, has_recommendation: false },
  { name: 'terraform-backend',        region: 'us-east-1', size_gb:    0.8, object_count:     284, estimated_cost:   0.02, has_recommendation: false },
  { name: 'api-documentation',        region: 'us-east-1', size_gb:    4.8, object_count:    1841, estimated_cost:   0.11, has_recommendation: false },
  { name: 'third-party-integrations', region: 'us-east-1', size_gb:   14.4, object_count:    4821, estimated_cost:   0.33, has_recommendation: false },
  { name: 'infra-automation',         region: 'us-east-1', size_gb:    8.4, object_count:    2841, estimated_cost:   0.19, has_recommendation: false },
  { name: 'runbooks',                 region: 'us-east-1', size_gb:    2.4, object_count:     841, estimated_cost:   0.06, has_recommendation: false },
]

export const DEMO_RESOURCES: DemoResourceInventory = {
  ec2: EC2_INSTANCES,
  rds: RDS_INSTANCES,
  s3: S3_BUCKETS,
}
