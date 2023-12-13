//selectors
let arrTimeInput = $('#arrivalTime')
let priorityInput = $('#piority')
let BurstTimeInput = $('#burstTime')
let addProcessBtn = $('#addprocess')
let tBody = $('tbody')
    //methods btns selectors
    let FCFS_btn = $('#FCFS')
    //outputs selectors
    let TAT_output = $('#TAT')
    let waiting_output = $('#waiting')

//events
$(addProcessBtn).click(
    e=>{
        e.preventDefault();

    // ckeck if all inputs are valid
        if(arrTimeInput.val() !== '' && priorityInput.val() !== '' && BurstTimeInput.val() !== ''){
            addProcess()
        }else{
            alert('you should enter value in all inputs')
        }
 }
);


$(FCFS_btn).click(FCFS)








//functions
let processes = []


function addProcess(){
processes.push({
    'arrTime': arrTimeInput.val(),
    'priority': priorityInput.val(),
    'BurstTime': BurstTimeInput.val()
})
getProcesses()
clearInputs()
console.log(processes);
}


function getProcesses() { 
    let tableContent= ``

    processes.forEach((process, i) => {
        tableContent += 
        `
            <tr class="table-primary">
                <td>P${i+1}</td>
                <td>${process.arrTime}</td>
                <td>${process.priority}</td>
                <td>${process.BurstTime}</td>
            </tr> 
        `
    });

    $(tBody).html(tableContent);
}

function clearInputs() { 
    $(arrTimeInput).val('');
    $(priorityInput).val('');
    $(BurstTimeInput).val('');
 }


function FCFS(){

    let TotalFinishTime = []
    let TAT = 0

    let Total_TAT = []
    let finishTime = 0

    let total_waitingTime = []
    let waitingTime = 0


    processes.forEach((process) => {
        //calculate finish time
        finishTime += Number(process.BurstTime)
        TotalFinishTime.push(finishTime)

        // calc TAT (finish time - arrival)
        TAT = finishTime - process.arrTime
        Total_TAT.push(TAT)

        // calc waiting time
        waitingTime = TAT - Number(process.BurstTime)
        total_waitingTime.push(waitingTime)
    });
    console.log('finish', TotalFinishTime);
    console.log('TAT', Total_TAT);
    console.log('waiting', total_waitingTime);

    // get avg TAT
    let avgTAT = 0 //------------------
    Total_TAT.forEach( TAT => {
        avgTAT += TAT
    });
    avgTAT /= Total_TAT.length;
    console.log('avg TAT' ,avgTAT);


    // get avg waiting time
    let avgWaitingTime = 0 //---------------
    total_waitingTime.forEach( waitingTime => {
        avgWaitingTime += waitingTime
    });
    avgWaitingTime /= total_waitingTime.length;
    console.log('avg wating' ,avgWaitingTime);

    $(TAT_output).html(avgTAT? avgTAT: 0)
    $(waiting_output).html(avgWaitingTime? avgWaitingTime:0)


}