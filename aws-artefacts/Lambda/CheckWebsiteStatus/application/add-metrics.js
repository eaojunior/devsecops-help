const cloudWatchParams = {
  Namespace: 'Website/Status',
  MetricData: [
  ]
}

const addMetricData = (name, value) => {
  let metricData = {
    MetricName: 'Site Availability',
      Dimensions: [
        {
          Name: 'Site',
          Value: name
        }
      ],
      Unit: 'None',
      Value: value
    }
  cloudWatchParams.MetricData.push(metricData);
}

module.exports = {
  cloudWatchParams,
  addMetricData
}