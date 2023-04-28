import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AwsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ECS cdk stack service running in ecs cluster based on fargate

    // cdk construct for an existing vpc identified by vpc id vpc-0036655239c74a244
    const vpc = ec2.Vpc.fromLookup(this, 'VPC', {
      vpcId: 'vpc-0036655239c74a244',
    });

    // new ecs cluster
    const cluster = new ecs.Cluster(this, 'Cluster', {
      vpc: vpc,
    });

    // Create a new ecr repository in the above vpc
    const repository = new ecr.Repository(this, 'Repository', {
      repositoryName: 'shipping-aggregator-front-end',
    });

    // Create an application load balancer in the above vpc
    const loadBalancer = new elbv2.ApplicationLoadBalancer(
      this,
      'LoadBalancer',
      {
        vpc: vpc,
        internetFacing: true,
        //securityGroup: ec2.SecurityGroup.fromSecurityGroupId(this, 'SecurityGroupELB', "sg-0019b13b2fa8a1d41"),
        // Create and assign a new secutiry group to the ALB
        securityGroup: new ec2.SecurityGroup(this, 'SecurityGroupELBPublic', {
          vpc: vpc,
          allowAllOutbound: true,
        }),
        // Place the ALB in the public subnets of the VPC
        vpcSubnets: {
          subnetType: ec2.SubnetType.PUBLIC,
        },
      },
    );

    // Create a listener for the ALB
    const listener = loadBalancer.addListener('Listener', {
      port: 80,
      open: true,
      defaultAction: elbv2.ListenerAction.redirect({
        protocol: 'HTTPS',
        port: '443',
        permanent: true,
      }),
    });


    // Create a load-balanced Fargate service and make it public
    const fargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(
      this,
      'FargateService',
      {
        cluster: cluster, // Required
        cpu: 256, // Default is 256
        desiredCount: 1, // Default is 1
        taskImageOptions: {
          image: ecs.ContainerImage.fromRegistry("shipping-aggregator-front-end:latest"),
          containerPort: 80,
          taskRole: iam.Role.fromRoleArn(this, 'TaskRole', "arn:aws-us-gov:iam::334390688036:role/ecsRunTaskRole"),
          executionRole: iam.Role.fromRoleArn(this, 'ExecutionRole', "arn:aws-us-gov:iam::334390688036:role/ecsTaskExecutionRole"),
          containerName: 'shipping-aggregator-front-end',
          logDriver: new ecs.AwsLogDriver({
            streamPrefix: 'shipping-aggregator-front-end',
            logGroup: new logs.LogGroup(this, 'LogGroup', {
              logGroupName: 'shipping-aggregator-front-end',
              removalPolicy: cdk.RemovalPolicy.DESTROY,
              retention: logs.RetentionDays.ONE_WEEK,
            }),
          }),
        },

        memoryLimitMiB: 512, // Default is 512
        publicLoadBalancer: true, // Default is false
        loadBalancer: loadBalancer,
        //securityGroups: [ec2.SecurityGroup.fromSecurityGroupId(this, 'SecurityGroupECS', "sg-015ba512b630ed65d")],
        taskSubnets: {
          subnets: [
            ec2.Subnet.fromSubnetId(this, 'SubnetPrivate1', 'subnet-08d33010b82857dc2'),
            ec2.Subnet.fromSubnetId(this, 'SubnetPrivate2', 'subnet-05adf1d4a3dd41b3f'),
          ],
        },
      }
    );






  }
}
