#!bin/bash

read -p "Enter base stack name: " stackName
read -p "Enter region deployment: " awsRegion

# Step 3 - Deploying EC2 Instance
aws cloudformation deploy --template=deployment/instance.yml --stack-name $stackName-EC2 --capabilities CAPABILITY_NAMED_IAM --region $awsRegion && \

# Step 3 - Deploying Cloudwatch Schedulers
# aws cloudformation deploy --template=ip.yml --stack-name $stackName-SCHEDULERS --region $awsRegion 
echo "Operation completed."