# jsreport-s3-storage

A jsreport extension that saves jsreport output to Amazon S3.

Configure your config options as follows:

    "s3ReportOutputStorage": {
      "accessKeyId" : "yourS3AccessKeyId",
      "secretAccessKey" : "yourS3SecretAccessKey",
      "s3OutputBucketName ": "yourS3BucketName",
      "s3OutputBaseURI": yourS3BucketRegion Base URI - Example: "https://s3-us-west-2.amazonaws.com"
    },
