export default class RawMaterialManagementColumnModel {
	static RawMaterialManagementColumn = [
	  {
	    title: 'Raw material code',
	    align: 'left',
	    field: 'rawMaterialCode'
	  },
	  {
		  title: 'Raw material name',
		  align: 'left',
		  field: 'rawMaterialName'
	  },
	  {
	    title: 'Alarm Limit',
	    align: 'left',
		  filtering: false,
	    type: 'numeric',
	    field: 'alarmLimit'
	  }
	]
}
