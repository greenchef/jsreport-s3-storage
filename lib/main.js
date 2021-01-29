
const AWS = require('aws-sdk')
const moment = require('moment');

var Reporting = function (reporter, definition) {
  this.reporter = reporter
  this.definition = definition

  this.reporter.afterRenderListeners.add(definition.name, this, Reporting.prototype.handleAfterRender)

}

Reporting.prototype.handleAfterRender = function (request, response) {
  const self = this
  if (request.options.isChildRequest) {
    return
  }

  const rightNow = moment();
  const folderName = `${rightNow.format('YYYY')}/${rightNow.format('MM')}/${rightNow.format('DD')}`;
  const reportKey =`${folderName}/${rightNow.format('YYYY-MM-DD')}-${request.template.shortid}.` + response.meta.fileExtension

  return this.uploadBufferToS3Bucket(reportKey, response.content)
    .then(() => {
      response.meta.headers['s3-path'] = reportKey;
      response.meta.headers['s3-bucket'] = self.reporter.options.s3ReportOutputStorage.s3OutputBucketName;
    })
}

// Takes a complete buffer and uploads it to S3.
Reporting.prototype.uploadBufferToS3Bucket = function (reportKey, buffer) {
       const s3 = new AWS.S3();
    
       const params = {
         Body: buffer,
         Bucket: this.reporter.options.s3ReportOutputStorage.s3OutputBucketName,
         Key: reportKey,
       };

       return s3.putObject(params).promise(); 
 }

module.exports = function (reporter, definition) {
  let options = {};
  let enabled = false;
  if (reporter.options.s3ReportOutputStorage) {
    options = reporter.options.s3ReportOutputStorage;
    enabled = true;
  }

  if (!enabled) return;

  options.container = options.container || 'jsreport';

  options.s3OutputBucketName = options.s3OutputBucketName || process.env.AWS_S3_BUCKET_NAME;
  if (!options.s3OutputBucketName) throw new Error('s3OutputBucketName must be provided to jsreport-s3-storage');

  options.s3OutputBaseURI = options.s3OutputBaseURI || process.env.AWS_S3_BASE_URI;
  if (!options.s3OutputBaseURI) throw new Error('s3OutputBaseURI must be provided to jsreport-s3-storage');

  reporter[definition.name] = new Reporting(reporter, definition);
  return;

}
