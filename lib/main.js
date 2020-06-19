
var q = require('q')
var AWS = require('aws-sdk')
var moment = require('moment');

var Reporting = function (reporter, definition) {
  this.reporter = reporter
  this.definition = definition

  this.reporter.afterRenderListeners.add(definition.name, this, Reporting.prototype.handleAfterRender)

}

Reporting.prototype.handleAfterRender = function (request, response) {
  var self = this
  if (request.options.isChildRequest) {
    return
  }

  var renderDate = new Date()
  var renderDateString = renderDate.getFullYear() + "-" + ("0" + (renderDate.getMonth() + 1)).slice(-2) + "-" + ("0" + renderDate.getDate()).slice(-2) + "-" + ("0" + renderDate.getHours()).slice(-2) + "-" + ("0" + renderDate.getMinutes()).slice(-2) + "-" + ("0" + renderDate.getSeconds()).slice(-2)
  const folderName = moment().format('YYYY-MM')
  var reportKey = folderName + "/" + moment().format('YYYY-MM-DD') + `(${request.template.shortid}).` + response.meta.fileExtension

  return this.uploadBufferToS3Bucket(reportKey, response.content)
    .then(function(s3UploadResults) {
      response.meta.headers['s3-Link'] = self.reporter.options.s3ReportOutputStorage.s3OutputBaseURI + "/" + self.reporter.options.s3ReportOutputStorage.s3OutputBucketName + "/" + reportKey
    })
}

// Takes a complete buffer and uploads it to S3.
// Takes a complete buffer and uploads it to S3.
Reporting.prototype.uploadBufferToS3Bucket = function(reportKey, buffer) {
  var deferred = q.defer()
  var s3 = null;
  var s3 = new AWS.S3();

   var params = {
     Bucket: this.reporter.options.s3ReportOutputStorage.s3OutputBucketName,
     Key: `${this.reporter.options.s3ReportOutputStorage.s3KeyPrefix}${reportKey}`,
     Body: buffer,
     ACL: "public-read"
   }
   s3.upload(params, function(err, data) {
     if (err) {
       console.log("Error:", err)
       deferred.reject(err);
     }
     else {
       deferred.resolve(data);
     }
   })
   return deferred.promise
}


module.exports = function (reporter, definition) {
  var options = {}
  var enabled = false
  if (reporter.options.s3ReportOutputStorage) {
    options = reporter.options.s3ReportOutputStorage
    enabled = true
  }

  if (!enabled) {
    return
  }

  options.container = options.container || 'jsreport'

  if (!options.s3OutputBucketName) {
    if(process.env.AWS_S3_BUCKET_NAME) {
      options.s3OutputBucketName = process.env.AWS_S3_BUCKET_NAME
    } else {
      throw new Error('s3OutputBucketName must be provided to jsreport-s3-storage')
    }
  }

  if (!options.s3KeyPrefix) {
    if(process.env.AWS_S3_KEY_PREFIX) {
      options.s3OutputKeyPrefix = process.env.AWS_S3_KEY_PREFIX
    } else {
      throw new Error('s3OutputKeyPrefix must be provided to jsreport-s3-storage')
    }
  }

  if (!options.s3OutputBaseURI) {
    if(process.env.AWS_S3_BASE_URI) {
      options.s3OutputBaseURI = process.env.AWS_S3_BASE_URI
    } else {
      throw new Error('s3OutputBaseURI must be provided to jsreport-s3-storage');
    }
  }

  if (!!options.accessKeyId) {
    console.log("Using AWS KEY found in configuration file!")
  } else {
    console.log("Using AWS KEY found in ENVIRONMENT VARIABLE!");
  }
  if (!!options.secretAccessKey) {
    console.log("Using AWS SECRET KEY found in configuration file!")
  } else {
    console.log("Using AWS SECRET KEY found in ENVIRONMENT VARIABLE!");
  }

  reporter[definition.name] = new Reporting(reporter, definition)
  return

}
