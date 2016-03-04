# jsreport-s3-storage

A jsreport extension that saves jsreport output to Amazon S3.

**Note: this is a work in progress**

Global Config Settings

Configure your config options as follows in the global jsreport's prod.config.json (or whatever environment config.json you are working with):

    "s3ReportOutputStorage": {
      "accessKeyId" : "yourS3AccessKeyId",
      "secretAccessKey" : "yourS3SecretAccessKey",
      "s3OutputBucketName ": "yourS3BucketName",
      "s3OutputBaseURI": yourS3BucketRegion Base URI - Example: "https://s3-us-west-2.amazonaws.com"
    },

