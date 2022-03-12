"use strict";

var AWS = require("aws-sdk");

module.exports = class AWSManager {
  _region;
  _serverKeyName;
  constructor() {
    this._region = "sa-east-1";
    // this._serverKeyName = "seven-days-server";

    //Only development environment
    if (process.env.MODE === "TEST") {
      const credentials = new AWS.SharedIniFileCredentials({
        profile: "personal-tf",
      });
      AWS.config.credentials = credentials;
    }

    AWS.config.getCredentials(function (error) {
      if (error) {
        console.error("Impossible to reach AWS IAM privileges", error.stack);
        throw error;
      }
    });
  }

  checkInstanceStatus() {
    const ec2 = new AWS.EC2({
      region: this._region,
    });

    return new Promise((resolve, reject) => {
      ec2.describeInstances(function (err, data) {
        if (err) return reject(err);
        else {
          const serverName = "seven-days-server";
          const reservation = data.Reservations.shift();
          const instance = reservation.Instances.find(
            (ins) => ins.KeyName === serverName
          );
          return resolve({
            instanceId: instance.InstanceId,
            instanceStatus: instance.State.Code ?? 0,
          });
        }
      });
    });
  }

  runInstance(instanceId) {
    const ec2 = new AWS.EC2({
      region: this._region,
    });

    return new Promise((resolve, reject) => {
      const params = {
        InstanceIds: [instanceId],
      };

      ec2.startInstances(params, function (err, data) {
        if (err) return reject(err);
        else return resolve(data);
      });
    });
  }
};
