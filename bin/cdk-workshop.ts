#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
// import { CdkWorkshopStack } from '../lib/cdk-workshop-stack';
import {VPCStack} from "../lib/template/stack/vpc-stack";

const app = new cdk.App();
new VPCStack(app, "VPCStack")
// new CdkWorkshopStack(app, 'CdkWorkshopStack');

