#!/bin/bash

# AWS Infrastructure setup script for static website hosting
set -e

# Configuration
PROJECT_NAME="serverless-web-app"
REGION="us-east-1"

# Environment-specific configurations
DEV_BUCKET="${PROJECT_NAME}-frontend-dev"
PROD_BUCKET="${PROJECT_NAME}-frontend-prod"

echo "🚀 Setting up AWS infrastructure for static website hosting..."

# Function to create S3 bucket for static website hosting
create_s3_bucket() {
    local bucket_name=$1
    local env=$2
    
    echo "📦 Creating S3 bucket: $bucket_name"
    
    # Create bucket
    aws s3 mb s3://$bucket_name --region $REGION
    
    # Enable static website hosting
    aws s3 website s3://$bucket_name --index-document index.html --error-document index.html
    
    # Set bucket policy for public read access
    cat > bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$bucket_name/*"
        }
    ]
}
EOF
    
    aws s3api put-bucket-policy --bucket $bucket_name --policy file://bucket-policy.json
    rm bucket-policy.json
    
    echo "✅ S3 bucket $bucket_name created and configured"
}

# Function to create CloudFront distribution
create_cloudfront_distribution() {
    local bucket_name=$1
    local env=$2
    
    echo "🌐 Creating CloudFront distribution for $env environment..."
    
    cat > cloudfront-config.json << EOF
{
    "CallerReference": "$bucket_name-$(date +%s)",
    "Comment": "$PROJECT_NAME $env environment",
    "DefaultCacheBehavior": {
        "TargetOriginId": "$bucket_name-origin",
        "ViewerProtocolPolicy": "redirect-to-https",
        "TrustedSigners": {
            "Enabled": false,
            "Quantity": 0
        },
        "ForwardedValues": {
            "QueryString": false,
            "Cookies": {
                "Forward": "none"
            }
        },
        "MinTTL": 0,
        "DefaultTTL": 86400,
        "MaxTTL": 31536000,
        "Compress": true
    },
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "$bucket_name-origin",
                "DomainName": "$bucket_name.s3-website-$REGION.amazonaws.com",
                "CustomOriginConfig": {
                    "HTTPPort": 80,
                    "HTTPSPort": 443,
                    "OriginProtocolPolicy": "http-only"
                }
            }
        ]
    },
    "Enabled": true,
    "DefaultRootObject": "index.html",
    "CustomErrorResponses": {
        "Quantity": 1,
        "Items": [
            {
                "ErrorCode": 404,
                "ResponsePagePath": "/index.html",
                "ResponseCode": "200",
                "ErrorCachingMinTTL": 300
            }
        ]
    },
    "PriceClass": "PriceClass_100"
}
EOF
    
    # Create CloudFront distribution
    DISTRIBUTION_ID=$(aws cloudfront create-distribution --distribution-config file://cloudfront-config.json --query 'Distribution.Id' --output text)
    rm cloudfront-config.json
    
    echo "✅ CloudFront distribution created: $DISTRIBUTION_ID"
    echo "📋 Distribution ID for $env: $DISTRIBUTION_ID"
    
    # Get CloudFront domain name
    DOMAIN_NAME=$(aws cloudfront get-distribution --id $DISTRIBUTION_ID --query 'Distribution.DomainName' --output text)
    echo "🌐 CloudFront URL for $env: https://$DOMAIN_NAME"
}

# Create development environment
echo "🔧 Setting up Development environment..."
create_s3_bucket $DEV_BUCKET "development"
create_cloudfront_distribution $DEV_BUCKET "development"

echo ""

# Create production environment
echo "🔧 Setting up Production environment..."
create_s3_bucket $PROD_BUCKET "production"
create_cloudfront_distribution $PROD_BUCKET "production"

echo ""
echo "🎉 AWS infrastructure setup completed!"
echo ""
echo "📝 Next steps:"
echo "1. Add the following secrets to your GitHub repository:"
echo "   - AWS_ACCESS_KEY_ID"
echo "   - AWS_SECRET_ACCESS_KEY"
echo "   - AWS_REGION (set to: $REGION)"
echo "   - S3_BUCKET_DEV (set to: $DEV_BUCKET)"
echo "   - S3_BUCKET_PROD (set to: $PROD_BUCKET)"
echo "   - CLOUDFRONT_DISTRIBUTION_ID_DEV"
echo "   - CLOUDFRONT_DISTRIBUTION_ID_PROD"
echo "   - VITE_API_BASE_URL (your backend API URL)"
echo "   - VITE_AWS_REGION"
echo "   - VITE_USER_POOL_ID"
echo "   - VITE_USER_POOL_CLIENT_ID"
echo ""
echo "2. Push your code to trigger the deployment pipeline!"