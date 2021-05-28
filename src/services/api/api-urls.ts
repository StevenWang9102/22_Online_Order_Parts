export const urlType: any = {
  Get: 'get',
  GetById: 'getById',
  Create: 'create',
  Update: 'update',
  Delete: 'delete'
}

const getUrlObjValue = (pre: string, suffix: string) => {
  return {
    [urlType.Get]: pre + '/GetAll' + suffix,
    [urlType.GetById]: pre + '/Get' + suffix + 'ById',
    [urlType.Create]: pre + '/Add' + suffix,
    [urlType.Update]: pre + '/Update' + suffix,
    [urlType.Delete]: pre + '/Delete' + suffix
  }
}

export const urlKey: any = {
  Brand: 'brand',
  Department: 'dept',
  Role: 'role',
  City: 'city',
  CustomerSource: 'source',
  CustomerStatus: 'status',
  PaymentCycle: 'paymentCycle',
  CustomerGroup1: 'group1',
  CustomerGroup2: 'group2',
  CustomerGroup3: 'group3',
  CustomerGroup4: 'group4',
  CustomerGroup5: 'group5',
  PageGroup: 'group',
  Page: 'page',
  Customer: 'customer',
  Employee: 'employee',
  BaseProduct: 'baseProduct',
  Product: 'product',
  PackagingType: 'packagingType',
  ProductType: 'productType',
  PlateType: 'plateType',
  Plate: 'plate',
  RawMaterial: 'rawMaterial',
  RawMaterialBox: 'rawMaterialBox',
  DeliveryMethod: 'deliveryMethod',
  Quotation: 'quotation',
  QuotationItem: 'quotationItem', // a Column of Quotation table
  QuotationOption: 'quotationOption', // a Column of Quotation table
  QuotationOptionItem: 'quotationOptionItem', // the selection part of the only one column of Quotation Option table
  SalesOrder: 'order',
  OrderStatus: 'orderStatus',
  OrderProduct: 'orderProduct',
  WorkOrder: 'workOrder',
  WorkOrderSource: 'workOrderSource',
  WorkOrderType: 'orderType',
  RawMaterialApplication: 'application',
  StockMonitor: 'stockMonitor',
  Box: 'box',
  ApplicationDetails: 'details',
  ExtraAddress: 'address',
  AvailablePlate: 'plate',
  AwaitingDispatch: 'awaitingDispatchOrder',
  Dispatch: 'dispatch',
  Courier: 'courier',
  PurchaseOrder: 'po',
  Supplier: 'suplier',
  SupplierQualification: 'qualification',
  ProductOption: 'option',
  UnloadingInspection: 'inspection',
}

export const allUrls: any = {
  [urlKey.Brand]: getUrlObjValue('Brand', 'Brand'),
  [urlKey.Department]: getUrlObjValue('Dept', 'Department'),
  [urlKey.Role]: getUrlObjValue('Role', 'Role'),
  [urlKey.City]: getUrlObjValue('City', 'City'),
  [urlKey.CustomerSource]: getUrlObjValue('CustomerSource', 'CustomerSource'),
  [urlKey.CustomerStatus]: getUrlObjValue('CustomerStatus', 'CustomerStatus'),
  [urlKey.PaymentCycle]: getUrlObjValue('PaymentCycle', 'PaymentCycle'),
  [urlKey.CustomerGroup1]: getUrlObjValue('CustomerGrp1', 'Group1'),
  [urlKey.CustomerGroup2]: getUrlObjValue('CustomerGrp2', 'Group2'),
  [urlKey.CustomerGroup3]: getUrlObjValue('CustomerGrp3', 'Group3'),
  [urlKey.CustomerGroup4]: getUrlObjValue('CustomerGrp4', 'Group4'),
  [urlKey.CustomerGroup5]: getUrlObjValue('CustomerGrp5', 'Group5'),
  [urlKey.PageGroup]: getUrlObjValue('PageGroup', 'PageGroup'),
  [urlKey.ProductType]: getUrlObjValue('ProductType', 'ProductType'),
  [urlKey.PackagingType]: getUrlObjValue('PackagingType', 'PackagingType'),
  [urlKey.PlateType]: getUrlObjValue('PlateType', 'PlateType'),
  [urlKey.RawMaterial]: getUrlObjValue('RawMaterial', 'RawMaterial'),
  [urlKey.Page]: {
    ...getUrlObjValue('Page', 'Page'),
    [urlType.Get]: 'Page/GetAllPagesByPageGroupId'
  },
  [urlKey.Customer]: getUrlObjValue('Customer', 'Customer'),
  [urlKey.Employee]: getUrlObjValue('Employee', 'Employee'),
  [urlKey.BaseProduct]: getUrlObjValue('BaseProduct', 'BaseProduct'),
  [urlKey.Product]: getUrlObjValue('Product', 'Product'),
  [urlKey.DeliveryMethod]: getUrlObjValue('DeliveryMethod', 'DeliveryMethod'),
  [urlKey.Quotation]: getUrlObjValue('Quotation', 'Quotation'),
  [urlKey.QuotationItem]: getUrlObjValue('QuotationItem', 'QuotationItem'),
  [urlKey.QuotationOption]: getUrlObjValue('QuotationOption', 'QuotationOption'),
  [urlKey.QuotationOptionItem]: getUrlObjValue('QuotationOptionItem', 'QuotationOptionItem'),
  [urlKey.SalesOrder]: getUrlObjValue('SalesOrder', 'Order'),
  [urlKey.OrderStatus]: getUrlObjValue('OrderStatus', 'OrderStatus'),
  [urlKey.OrderProduct]: getUrlObjValue('OrderProduct', 'OrderProduct'),
  [urlKey.WorkOrder]: getUrlObjValue('WorkOrder', 'WorkOrder'),
  [urlKey.WorkOrderSource]: getUrlObjValue('WorkOrderSource', 'WorkOrderSource'),
  [urlKey.WorkOrderType]: getUrlObjValue('OrderType', 'OrderType'),
  [urlKey.RawMaterialApplication]: getUrlObjValue('RawMaterialApplication', 'RawMaterialApplication'),
  [urlKey.StockMonitor]: getUrlObjValue('StockMonitor', 'StockInfo'),
  [urlKey.Box]: {
    ...getUrlObjValue('Box', 'Box'),
    [urlType.Delete]: 'Box/ObsoleteBox'
  },
  [urlKey.ApplicationDetails]: getUrlObjValue('ApplicationDetails', 'ApplicationDetails'),
  [urlKey.Plate]: getUrlObjValue('Plate', 'Plate'),
  [urlKey.ExtraAddress]: getUrlObjValue('ExtraAddress', 'ExtraAddress'),
  [urlKey.AvailablePlate]: {
    [urlType.Get]: 'Plate/GetAvailablePlate'
  },
  [urlKey.AwaitingDispatch]: {
    [urlType.Get]: 'SalesOrder/GetDispachableOrder'
  },
  [urlKey.Dispatch]: getUrlObjValue('Dispatching', 'Dispatching'),
  [urlKey.Courier]: getUrlObjValue('Courier', 'Courier'),
  [urlKey.PurchaseOrder]: getUrlObjValue('PurchaseOrder', 'PurchaseOrder'),
  [urlKey.Supplier]: getUrlObjValue('Supplier', 'Supplier'),
  [urlKey.SupplierQualification]: getUrlObjValue('Supplier', 'Qualification'),
  [urlKey.ProductOption]: getUrlObjValue('ProductOption', 'ProductOption'),
  [urlKey.RawMaterialBox]: {
    ...getUrlObjValue('RawMaterialBox', 'RawMaterialBox'),
    [urlType.Delete]: 'RawMaterialBox/ObsoleteRawMaterialBox'
  },
  [urlKey.UnloadingInspection]: getUrlObjValue('UnloadingInspection', 'UnloadingInspection'),
}
