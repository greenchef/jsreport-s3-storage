
var q = require('q')
var awsSDK = require('aws-sdk')

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
  var reportKey = request.template.shortid + "/rpt" + renderDateString + "." + response.headers['File-Extension']

  return this.uploadBufferToS3Bucket(reportKey, response.content)
    .then(function(s3UploadResults) {
      response.headers['s3-Link'] = self.reporter.options.s3ReportOutputStorage.s3OutputBaseURI + "/" + self.reporter.options.s3ReportOutputStorage.s3OutputBucketName + "/" + reportKey
    })
}

// Takes a complete buffer and uploads it to S3.
Reporting.prototype.uploadBufferToS3Bucket = function(reportKey, buffer) {
       var deferred = q.defer()
       var s3 = new awsSDK.S3({accessKeyId: this.reporter.options.s3ReportOutputStorage.accessKeyId, secretAccessKey: this.reporter.options.s3ReportOutputStorage.secretAccessKey})
       var params = {
         Bucket: this.reporter.options.s3ReportOutputStorage.s3OutputBucketName,
         Key: reportKey,
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

  if (!options.accessKeyId) {
    throw new Error('accessKeyId must be provided to jsreport-s3-storage')
  }

  if (!options.secretAccessKey) {
    throw new Error('secretAccessKey must be provided to jsreport-s3-storage')
  }

  if (!options.s3OutputBucketName) {
    throw new Error('s3OutputBucketName must be provided to jsreport-s3-storage')
  }

  console.log(definition.name);
  reporter[definition.name] = new Reporting(reporter, definition)
  return

}
