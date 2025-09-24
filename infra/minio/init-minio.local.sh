#!/bin/sh
# Start MinIO in background
minio server --console-address ":9001" /data/ &

# Wait for MinIO to be ready
sleep 5

# Create buckets
mc alias set local http://localhost:9000 admin admin_pass
mc mb local/videos --ignore-existing
echo 'Videos bucket created successfully'

# Keep MinIO running in foreground
wait