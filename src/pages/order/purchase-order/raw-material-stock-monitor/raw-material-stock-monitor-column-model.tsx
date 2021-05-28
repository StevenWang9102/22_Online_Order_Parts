const RawMaterialStockMonitorColumnModel = () => {
  return [
    {
      title: 'Code',
      field: 'rawMaterialCode',
    },
    {
      title: 'Name',
      field: 'rawMaterialName',
    },
    {
      title: 'Alarm Limit',
      field: 'alarmLimit',
    },
    {
      title: 'inStock',
      field: 'inStock',
    },
    {
      title: 'Unloading Zone',
      field: 'unloadingZone',
    },
    {
      title: 'Pending PO',
      field: 'pendingPo',
    },
    {
      title: 'Pending Application',
      field: 'pendingApplication',
    },
    {
      title: 'Suggested PO',
      field: 'suggestedPo',
    },
    {
      title: 'Name',
      field: 'rawMaterialName',
    },
    {
      title: 'Low',
      field: 'low',
      defaultFilter: ['1'],
      lookup: {0: 'No', 1: 'Yes'},
    }
  ]
}

export default RawMaterialStockMonitorColumnModel
