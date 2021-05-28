import server from "./api/api-services";
import {baseUrl} from "./api/base-url";

export const getAllWorkingArrangementRequest = () =>{
    return server({
        method: "GET",
        url: baseUrl + 'WorkingArrangement/GetAllWorkingArrangement?workingDate=2021-04-08'
    })
}

export const getSuborderByMachineId = (machineId:number) => {
    return server({
        method: "GET",
        url: baseUrl + `Suborder/GetSuborderByMachineId?id=${machineId}&completeDate=2021-04-08`
    })
}