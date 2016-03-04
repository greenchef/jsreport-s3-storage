module.exports = function (reporter, definition) {
  console.log("HERE I AM!!!!!!!");
  /*
  var options = {}
  var enabled = false
  if (reporter.options.blobStorage && reporter.options.blobStorage.name.toLowerCase() === 'azure-storage') {
    options = reporter.options.blobStorage
    enabled = true
  }

  if (Object.getOwnPropertyNames(definition.options).length) {
    options = definition.options
    // just temporary fix for current jsreport-core, remove afterwards
    reporter.options.blobStorage = {name: 'azure-storage'}
    enabled = true
  }

  if (!enabled) {
    return
  }

  options.container = options.container || 'jsreport'

  if (!options.accountName) {
    throw new Error('accountName must be provided to jsreport-azure-storage')
  }

  if (!options.accountKey) {
    throw new Error('accountKey must be provided to jsreport-azure-storage')
  }

  reporter.blobStorage = new Storage(options)
  return reporter.blobStorage.init() */
}
