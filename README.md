# jsreport-s3-storage

A jsreport extension that saves jsreport output to Amazon S3.

The general purpose is to save all rendered report output to an Amazon S3 bucket and then return the link to the rendered output so any client can retrieve the output directly from S3.

This project does not save any jsrepose related report templates or blobs to Amazon S3, just rendered report output.

## Global Config Settings

Configure your config options as follows in the global jsreport's prod.config.json (or whatever environment config.json you are working with):

    "s3ReportOutputStorage": {
      "accessKeyId" : "yourS3AccessKeyId",
      "secretAccessKey" : "yourS3SecretAccessKey",
      "s3OutputBucketName ": "yourS3BucketName",
      "s3OutputBaseURI": yourS3BucketRegion Base URI - Example: "https://s3-us-west-2.amazonaws.com"
    },
    
### Settings
* accessKeyId
	* Your S3 accessKeyId
* secretAccessKey
	* Your S3 secretAccessKey
* s3OutputBucketName
	* The S3 bucketname report output will be written to. Make sure this bucket is created in S3 with the proper permissions so the supplied accessKeyId and secretAccessKey can write to the bucket.
* s3OutputBaseURI
	* This should be the base URI of the region your bucket resides on in S3. This value is used to return the full link (s3-link) to the saved, rendered output so your requesting consumer can use the link to view/download the jsreport output from S3.

## Behavior
Rendered report output is saved to S3 using the following structure:

	bucketname/shortId1
		all rendered output for that template (shortId1)
	bucketname/shortId2
		all rendered output for that template (shortId2)
	...etc...	
	
Folders are created for each report template using the shortId and report output is stored there using the report's render date/time.

##Rendered Report Response
The rendered report response will include the header 's3-link' which will be the URL to your rendered report output in S3. Make sure you have the s3OutputBaseURI config value correct as this is used when constructing the final URL to the rendered report output.	
