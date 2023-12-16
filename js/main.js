//selectors
let arrTimeInput = $('#arrivalTime')
let priorityInput = $('#piority')
let BurstTimeInput = $('#burstTime')
let addProcessBtn = $('#addprocess')
let tBody = $('tbody')
    //methods btns selectors
    let FCFS_btn = $('#FCFS')
    let SJF_Preemptive = $('#SJF_Preemptive')
    let SJF_NonPreemptive = $('#SJF_NonPreemptive')
    let RR = $('#RR')


    //outputs selectors
    let TAT_output = $('#TAT')
    let waiting_output = $('#waiting')

let startFinishTime = $('#startFinishTime')










let processess = []
class Process {
    static count = 0;
    constructor(arrivalTime, burstTime, priority) {
        this.id = ++Process.count;
        this.arrivalTime = arrivalTime;
        this.burstTime = burstTime;
        this.remainingTime = burstTime;
        this.priority = priority
        this.startTime = 0;
        this.endTime = 0;
        this.waitingTime = 0;
        this.turnaroundTime = 0;

        this.showNumOfProcesses()
    }
    showNumOfProcesses(){
        console.log('number of processes = '+this.id);
    }
}



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

$(SJF_Preemptive).click(()=>{
updateUI( sjf(processess) )
})

$(SJF_NonPreemptive).click(()=>{
    updateUI( sjfNonPreemptive(processess) )
})


$(RR).click(()=>{
    updateUI( roundRobin(processess) )
})





//functions

let processes = []

function addProcess(){
processes.push({
    'arrTime': arrTimeInput.val(),
    'priority': priorityInput.val(),
    'BurstTime': BurstTimeInput.val()
})
getProcesses()
console.log(processes);

// sjfffff
// processess.push(new Process(arrTimeInput.val(), BurstTimeInput.val(), priorityInput.val()))
processess.push(new Process(processes[processes.length -1].arrTime, processes[processes.length -1].BurstTime, processes[processes.length - 1].priority))
console.log(processess);




clearInputs()
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






 function updateUI(method) { 
    //----- ATAT AND WAITING TIME SECTION
    $(TAT_output).html(method.averageTurnaroundTime)
    $(waiting_output).html(method.averageWaitingTime)

    //----- start and finish time section

    let startFinishTimeContent = ``;
    console.log(method);
    method.processes.forEach(process => {

    //show startTime and Finish time
    startFinishTimeContent += `
    <span>
        P<strong>${process.id}</strong> : <strong>${process.startTime}</strong> - <strong>${process.endTime}</strong>
    </span>
    `

    });
    $(startFinishTime).html(startFinishTimeContent)
 }




















function FCFS(){

    let TotalFinishTime = []
    let TAT = 0

    let Total_TAT = []
    let finishTime = 0

    let total_waitingTime = []
    let waitingTime = 0

    let startFinishTimeContent = ``
    processes.forEach((process, i) => {
        //calculate finish time
        finishTime += Number(process.BurstTime)
        TotalFinishTime.push(finishTime)

        // calc TAT (finish time - arrival)
        TAT = finishTime - process.arrTime
        Total_TAT.push(TAT)

        // calc waiting time
        waitingTime = TAT - Number(process.BurstTime)
        total_waitingTime.push(waitingTime)


//----------------------------------------------------------

        //show startTime and Finish time
        startFinishTimeContent += `
        <span>
            P<strong>${i+1}</strong> : <strong>${TotalFinishTime[i-1]? TotalFinishTime[i-1]:0}</strong> - <strong>${TotalFinishTime[i]}</strong>
        </span>
        `
    //---------------------------------------------------------------------------------------



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



    //---------------------------------------------------------------------------------------
    $(TAT_output).html(avgTAT? avgTAT: 0)
    $(waiting_output).html(avgWaitingTime? avgWaitingTime:0)
    // updateUI(avgTAT? avgTAT: 0, avgWaitingTime?avgWaitingTime:0)

// show finish time and start time
$(startFinishTime).html(startFinishTimeContent)
    //---------------------------------------------------------------------------------------

}






function sjf(processes) {
    const n = processes.length;
    const remainingTime = new Array(n).fill(0);
    let currentTime = 0;
    let completed = 0;
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;

    while (completed < n) {
        let minIndex = -1;
        let minBurst = Number.MAX_VALUE;

        for (let i = 0; i < n; i++) {
            if (processes[i].arrivalTime <= currentTime && processes[i].remainingTime < minBurst && processes[i].remainingTime > 0) {
                minBurst = processes[i].remainingTime;
                minIndex = i;
            }
        }

        if (minIndex === -1) {
            currentTime++;
        } else {
            processes[minIndex].remainingTime--;
            remainingTime[minIndex] = processes[minIndex].remainingTime;

            if (remainingTime[minIndex] === processes[minIndex].burstTime - 1) {
                processes[minIndex].startTime = currentTime;
            }

            currentTime++;

            if (processes[minIndex].remainingTime === 0) {
                completed++;
                processes[minIndex].endTime = currentTime;
                processes[minIndex].turnaroundTime = processes[minIndex].endTime - processes[minIndex].arrivalTime;
                processes[minIndex].waitingTime = processes[minIndex].turnaroundTime - processes[minIndex].burstTime;

                totalWaitingTime += processes[minIndex].waitingTime;
                totalTurnaroundTime += processes[minIndex].turnaroundTime;
            }
        }
    }

    const averageWaitingTime = totalWaitingTime / n;
    const averageTurnaroundTime = totalTurnaroundTime / n;

    return {
        processes,
        averageWaitingTime,
        averageTurnaroundTime
    };
}






function sjfNonPreemptive(processes) {
    processes.sort((a, b) => a.burstTime - b.burstTime);

    const n = processes.length;
    let currentTime = 0;
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;

    for (let i = 0; i < n; i++) {
        const currentProcess = processes[i];

        currentProcess.startTime = Number(currentTime);
        currentProcess.endTime = Number(currentTime) + Number(currentProcess.burstTime)
        currentProcess.turnaroundTime = Number(currentProcess.endTime) - currentProcess.arrivalTime;
        currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime;

        totalWaitingTime += Number(currentProcess.waitingTime);
        totalTurnaroundTime += Number(currentProcess.turnaroundTime);

        currentTime = currentProcess.endTime;
    }

    const averageWaitingTime = totalWaitingTime / n;
    const averageTurnaroundTime = totalTurnaroundTime / n;

    return {
        processes,
        averageWaitingTime,
        averageTurnaroundTime
    };
}









// let quantum = 3;

function roundRobin(processes, quantum = 3) {
    let n = processes.length;
    let queue = [];
    let currentTime = 0;

    while (true) {
        let allProcessesDone = true;

        for (let i = 0; i < n; i++) {
            if (processes[i].remainingTime > 0) {
                allProcessesDone = false;

                if (processes[i].arrivalTime <= currentTime) {
                    if (!queue.includes(processes[i])) {
                        queue.push(processes[i]);
                    }
                }
            }
        }

        if (allProcessesDone) {
            break;
        }

        let currentProcess = queue.shift();

        if (currentProcess.remainingTime > quantum) {
            currentProcess.startTime = currentTime;
            currentTime += quantum;
            currentProcess.endTime = currentTime;
            currentProcess.remainingTime -= quantum;
        } else {
            currentProcess.startTime = currentTime;
            currentTime += currentProcess.remainingTime;
            currentProcess.endTime = currentTime;
            currentProcess.remainingTime = 0;
        }

        for (let i = 0; i < n; i++) {
            if (processes[i].id === currentProcess.id) {
                processes[i] = { ...currentProcess };
                break;
            }
        }

        queue.push(currentProcess);
    }

    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;

    for (let i = 0; i < n; i++) {
        processes[i].waitingTime = processes[i].startTime - processes[i].arrivalTime;
        processes[i].turnaroundTime = processes[i].endTime - processes[i].arrivalTime;

        totalWaitingTime += processes[i].waitingTime;
        totalTurnaroundTime += processes[i].turnaroundTime;
    }

    let averageWaitingTime = totalWaitingTime / n;
    let averageTurnaroundTime = totalTurnaroundTime / n;

    console.log("Process\tStart Time\tEnd Time\tWaiting Time\tTurnaround Time");
    for (let i = 0; i < n; i++) {
        console.log(
            `${processes[i].id}\t${processes[i].startTime}\t\t${processes[i].endTime}\t\t${processes[i].waitingTime}\t\t${processes[i].turnaroundTime}`
        );
    }

    console.log("\nAverage Waiting Time: " + averageWaitingTime);
    console.log("Average Turnaround Time: " + averageTurnaroundTime);



    return {
        processes,
        averageWaitingTime,
        averageTurnaroundTime
    }
}









  
  function prioritySchedulingPreemptive(processes) {
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
    let currentTime = 0;
    let completed = 0;
    let queue = [];
  
    while (completed < processes.length) {
      let arrivedProcesses = processes.filter((p) => p.arrivalTime <= currentTime);
      
      if (arrivedProcesses.length > 0) {
        arrivedProcesses.sort((a, b) => a.priority - b.priority);
  
        let currentProcess = arrivedProcesses[0];
        currentProcess.burstTime--;
  
        console.log(`Time ${currentTime}: ${currentProcess.name}`);
  
        if (currentProcess.burstTime === 0) {
          completed++;
        }
      } else {
        console.log(`Time ${currentTime}: Idle`);
      }
  
      currentTime++;
    }
  }
//   let processesPreemptive = [
//     new Process("P1", 0, 5, 3),
//     new Process("P2", 2, 7, 1),
//     new Process("P3", 4, 3, 2),
//   ];
  
//   prioritySchedulingPreemptive(processesPreemptive);









function prioritySchedulingNonPreemptive(processes) {
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
    let currentTime = 0;
    let completed = 0;
  
    while (completed < processes.length) {
      let arrivedProcesses = processes.filter((p) => p.arrivalTime <= currentTime);
  
      if (arrivedProcesses.length > 0) {
        arrivedProcesses.sort((a, b) => a.priority - b.priority);
  
        let currentProcess = arrivedProcesses[0];
        currentTime += currentProcess.burstTime;
  
        console.log(`Time ${currentTime}: ${currentProcess.name}`);
  
        completed++;
      } else {
        console.log(`Time ${currentTime}: Idle`);
        currentTime++;
      }
    }
  }
//   let processesNonPreemptive = [
//     new Process("P1", 0, 5, 3),
//     new Process("P2", 2, 7, 1),
//     new Process("P3", 4, 3, 2),
//   ];


  
//   prioritySchedulingNonPreemptive(processesNonPreemptive);