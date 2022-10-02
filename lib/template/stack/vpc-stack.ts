import {aws_ec2, Duration, Stack, StackProps} from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class VPCStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const projectName = "sbcntr"
        const vpc = new aws_ec2.Vpc(this, `${projectName}Vpc`, {
            cidr: "10.0.0.0/16",
            subnetConfiguration: [],
        })

        const internetGateway = new aws_ec2.CfnInternetGateway(
            this, `${projectName}-InternetGateway`,
            {
            },
        )
        new aws_ec2.CfnVPCGatewayAttachment(
            this, `${projectName}VpcgwAttachment`,
            {
                vpcId: vpc.vpcId,
                internetGatewayId: internetGateway.attrInternetGatewayId,
            }
        )

        const pubSubnet1 = new aws_ec2.Subnet(
            this,
            `${projectName}-subnet-public-ingress-1a`,
            {
                vpcId: vpc.vpcId,
                cidrBlock: "10.0.0.0/24",
                availabilityZone: "ap-northeast-2a",
            },
        )
        const pubSubnet2 = new aws_ec2.Subnet(
            this,
            `${projectName}-subnet-public-ingress-1c`,
            {
                vpcId: vpc.vpcId,
                cidrBlock: "10.0.1.0/24",
                availabilityZone: "ap-northeast-2c",
            },
        )
        const ingressRouteTable = new aws_ec2.CfnRouteTable(
            this,
            `${projectName}RouteIngree`,
            {
                vpcId: vpc.vpcId,
            }
        )
        new aws_ec2.CfnRoute(this, `${projectName}IngressDefault`,
            {
                routeTableId: ingressRouteTable.attrRouteTableId,
                gatewayId: internetGateway.attrInternetGatewayId,
                destinationCidrBlock: "0.0.0.0/0"
            },
        )
        new aws_ec2.CfnSubnetRouteTableAssociation(
            this,
            `${projectName}RouteIngressAssociation1A`,
            {
                routeTableId: ingressRouteTable.attrRouteTableId,
                subnetId: pubSubnet1.subnetId,
            }
        )
        new aws_ec2.CfnSubnetRouteTableAssociation(
            this,
            `${projectName}RouteIngressAssociation1C`,
            {
                routeTableId: ingressRouteTable.attrRouteTableId,
                subnetId: pubSubnet2.subnetId,
            }
        )
        const pubSubnet3 = new aws_ec2.Subnet(
            this,
            `${projectName}-subnet-public-management-1a`,
            {
                vpcId: vpc.vpcId,
                cidrBlock: "10.0.240.0/24",
                availabilityZone: "ap-northeast-2a",
            },
        )
        const pubSubnet4 = new aws_ec2.Subnet(
            this,
            `${projectName}-subnet-public-management-1c`,
            {
                vpcId: vpc.vpcId,
                cidrBlock: "10.0.241.0/24",
                availabilityZone: "ap-northeast-2c",
            },
        )
        new aws_ec2.CfnSubnetRouteTableAssociation(
            this,
            `${projectName}RouteManagementAssociation1A`,
            {
                routeTableId: ingressRouteTable.attrRouteTableId,
                subnetId: pubSubnet3.subnetId,
            }
        )
        new aws_ec2.CfnSubnetRouteTableAssociation(
            this,
            `${projectName}RouteManagementAssociation1C`,
            {
                routeTableId: ingressRouteTable.attrRouteTableId,
                subnetId: pubSubnet4.subnetId,
            }
        )

        const privateSubnet1 = new aws_ec2.Subnet(
            this,
            `${projectName}-subnet-private-container-1a`,
            {
                vpcId: vpc.vpcId,
                cidrBlock: "10.0.8.0/24",
                availabilityZone: "ap-northeast-2a",
            }
        )
        const privateSubnet2 = new aws_ec2.Subnet(
            this,
            `${projectName}-subnet-private-container-1c`,
            {
                vpcId: vpc.vpcId,
                cidrBlock: "10.0.9.0/24",
                availabilityZone: "ap-northeast-2c",
            }
        )
        const appRouteTable = new aws_ec2.CfnRouteTable(
            this,
            `${projectName}RouteApp`,
            {
                vpcId: vpc.vpcId,
            }
        )
        new aws_ec2.CfnSubnetRouteTableAssociation(
            this,
            `${projectName}RouteAppAssociation1A`,
            {
                routeTableId: appRouteTable.attrRouteTableId,
                subnetId: privateSubnet1.subnetId,
            }
        )
        new aws_ec2.CfnSubnetRouteTableAssociation(
            this,
            `${projectName}RouteAppAssociation1C`,
            {
                routeTableId: appRouteTable.attrRouteTableId,
                subnetId: privateSubnet2.subnetId,
            }
        )

        const privateSubnet3 = new aws_ec2.Subnet(
            this,
            `${projectName}-subnet-private-db-1a`,
            {
                vpcId: vpc.vpcId,
                cidrBlock: "10.0.16.0/24",
                availabilityZone: "ap-northeast-2a",
            }
        )
        const privateSubnet4 = new aws_ec2.Subnet(
            this,
            `${projectName}-subnet-private-db-1c`,
            {
                vpcId: vpc.vpcId,
                cidrBlock: "10.0.17.0/24",
                availabilityZone: "ap-northeast-2c",
            }
        )
        const dbRouteTable = new aws_ec2.CfnRouteTable(
            this,
            `${projectName}RouteDb`,
            {
                vpcId: vpc.vpcId,
            }
        )
        new aws_ec2.CfnSubnetRouteTableAssociation(
            this,
            `${projectName}RouteDbAssociation1A`,
            {
                routeTableId: dbRouteTable.attrRouteTableId,
                subnetId: privateSubnet3.subnetId,
            }
        )
        new aws_ec2.CfnSubnetRouteTableAssociation(
            this,
            `${projectName}RouteDbAssociation1C`,
            {
                routeTableId: dbRouteTable.attrRouteTableId,
                subnetId: privateSubnet4.subnetId,
            }
        )


        // Security Group
        const sgIngress = new aws_ec2.SecurityGroup(this, `${projectName}SgIngress`,
            {
                vpc: vpc,
                allowAllOutbound: true,
                securityGroupName: `${projectName}SgIngress`,
            },
        )
        sgIngress.addIngressRule(
            aws_ec2.Peer.anyIpv4(),
            aws_ec2.Port.tcp(80),
        )

        const sgManagement = new aws_ec2.SecurityGroup(this, `${projectName}SgManagement`,
            {
                vpc: vpc,
                allowAllOutbound: true,
                securityGroupName: `${projectName}SgManagement`,
            },
        )
        const sgContainer = new aws_ec2.SecurityGroup(this, `${projectName}SgContainer`,
            {
                vpc: vpc,
                allowAllOutbound: true,
                securityGroupName: `${projectName}SgContainer`,
            }
        )

        const sgFrontContainer = new aws_ec2.SecurityGroup(this, `${projectName}SgFrontContainer`,
            {
                vpc: vpc,
                allowAllOutbound: true,
                securityGroupName: `${projectName}SgFrontContainer`,
            },
        )
        const sgInternal = new aws_ec2.SecurityGroup(this, `${projectName}SgInternal`,
            {
                vpc: vpc,
                allowAllOutbound: true,
                securityGroupName: `${projectName}SgInternalContainer`,
            }
        )
        const sgDb = new aws_ec2.SecurityGroup(this, `${projectName}SgDb`,
            {
                vpc: vpc,
                allowAllOutbound: true,
            }
        )

        sgFrontContainer.addIngressRule(
            aws_ec2.Peer.securityGroupId(sgIngress.securityGroupId),
            aws_ec2.Port.tcp(80),
        )

        sgInternal.addIngressRule(
            aws_ec2.Peer.securityGroupId(sgFrontContainer.securityGroupId),
            aws_ec2.Port.tcp(80),
        )
        sgInternal.addIngressRule(
            aws_ec2.Peer.securityGroupId(sgManagement.securityGroupId),
            aws_ec2.Port.tcp(80),
        )

        sgContainer.addIngressRule(
            aws_ec2.Peer.securityGroupId(sgInternal.securityGroupId),
            aws_ec2.Port.tcp(80),
        )

        sgDb.addIngressRule(
            aws_ec2.Peer.securityGroupId(sgContainer.securityGroupId),
            aws_ec2.Port.tcp(3306),
        )
        sgDb.addIngressRule(
            aws_ec2.Peer.securityGroupId(sgContainer.securityGroupId),
            aws_ec2.Port.tcp(3306),
        )
        sgDb.addIngressRule(
            aws_ec2.Peer.securityGroupId(sgManagement.securityGroupId),
            aws_ec2.Port.tcp(3306),
        )


    }
}
