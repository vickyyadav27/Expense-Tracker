//  Global Array 
let incomeTransactions = [];
let expenseTransactions = [];
let allTransactions = [];

// Registration 
document.getElementById("goRegister").addEventListener("click", () => {
  document.getElementById("landingPage").style.display = "none";
  document.getElementById("registerPage").style.display = "block";
});

document.getElementById("registerBtn").addEventListener("click", () => {
  const name = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const profession = document.getElementById("regProfession").value;

  if (!name || !email || !profession) {
    document.getElementById("regMessage").innerText = "Please fill all required fields!";
    return;
  }

  document.getElementById("registerPage").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
});

// Navbar Navigation
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const section = link.getAttribute("data-section");
    document.querySelectorAll("main section").forEach(sec => sec.style.display = "none");
    document.querySelector("." + section).style.display = "block";
  });
});

// Charts
const ctxLine = document.getElementById("overviewLine").getContext("2d");
let lineChart = new Chart(ctxLine, {
  type: "line",
  data: {
    labels: [],
    datasets: [{
      label: "Income",
      data: [],
      borderColor: "#00f0ff",
      fill: false
    }]
  },
  options: {
    plugins: { legend: { labels: { color: "#fff" } } },
    scales: { 
      x: { ticks: { color: "#fff" } }, 
      y: { ticks: { color: "#fff" } } 
    }
  }
});

// Pie chart (Overview)
const ctxPie = document.getElementById("overviewPie").getContext("2d");
let pieChart = new Chart(ctxPie, {
  type: "pie",
  data: {
    labels: ["Income","Expense"],
    datasets: [{
      data: [0,0],
      backgroundColor: ["#00f0ff","#ff5b6b"]
    }]
  },
  options: { plugins: { legend: { labels: { color: "#fff" } } } }
});

// Income chart
const ctxIncome = document.getElementById("incomeChart").getContext("2d");
let incomeChart = new Chart(ctxIncome, {
  type: "bar",
  data: { 
    labels: [], 
    datasets: [{ label: "Income", data: [], backgroundColor: "#00f0ff" }] 
  },
  options: {
    plugins: { legend: { labels: { color: "#fff" } } },
    scales: { 
      x: { ticks: { color: "#fff" } }, 
      y: { ticks: { color: "#fff" } } 
    }
  }
});

// Expense chart
const ctxExpense = document.getElementById("expenseChart").getContext("2d");
let expenseChart = new Chart(ctxExpense, {
  type: "bar",
  data: { 
    labels: [], 
    datasets: [{ label: "Expense", data: [], backgroundColor: "#ff5b6b" }] 
  },
  options: {
    plugins: { legend: { labels: { color: "#fff" } } },
    scales: { 
      x: { ticks: { color: "#fff" } }, 
      y: { ticks: { color: "#fff" } } 
    }
  }
});
//  Income & Expense  

// Add Income
document.getElementById("addIncome").addEventListener("click", () => {
  const name = document.getElementById("incomeName").value;
  const amount = parseFloat(document.getElementById("incomeAmount").value);
  const date = new Date().toISOString().split("T")[0];

  if (!name || !amount) return;

  const transaction = { name, amount, date, type: "Income" };
  incomeTransactions.push(transaction);
  allTransactions.push(transaction);

  updateUI();
});

// Add Expense
document.getElementById("addExpense").addEventListener("click", () => {
  const name = document.getElementById("expenseName").value;
  const amount = parseFloat(document.getElementById("expenseAmount").value);
  const date = new Date().toISOString().split("T")[0];

  if (!name || !amount) return;

  const transaction = { name, amount, date, type: "Expense" };
  expenseTransactions.push(transaction);
  allTransactions.push(transaction);

  updateUI();
});
//  Update UI 
function updateUI() {
  const totalIncome = incomeTransactions.reduce((sum,t)=>sum+t.amount,0);
  const totalExpense = expenseTransactions.reduce((sum,t)=>sum+t.amount,0);
  const balance = totalIncome - totalExpense;

  // Totals
  document.getElementById("totalIncome").innerText = "₹" + totalIncome;
  document.getElementById("totalExpense").innerText = "₹" + totalExpense;
  document.getElementById("balance").innerText = "₹" + balance;

  // History (last 5 transactions)
  const historyList = document.getElementById("historyList");
  historyList.innerHTML = "";
  allTransactions.slice(-5).forEach(t=>{
    const li = document.createElement("li");
    li.innerHTML = <span>${t.name} (${t.type})</span><span>₹${t.amount}</span>;
    historyList.appendChild(li);
  });

  // Pie chart update
  pieChart.data.datasets[0].data = [totalIncome,totalExpense];
  pieChart.update();

  // Income list update with delete
  const incomeList = document.getElementById("incomeList");
  incomeList.innerHTML = "";
  incomeTransactions.forEach((t,index)=>{
    const li = document.createElement("li");
    li.innerHTML = <span>${t.name} - ₹${t.amount}</span>;
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", ()=>{
      incomeTransactions.splice(index,1);
      allTransactions = allTransactions.filter(x=>!(x.type==="Income" && x.name===t.name && x.amount===t.amount && x.date===t.date));
      updateUI();
    });
    li.appendChild(delBtn);
    incomeList.appendChild(li);
  });

  // Expense list update with delete
  const expenseList = document.getElementById("expenseList");
  expenseList.innerHTML = "";
  expenseTransactions.forEach((t,index)=>{
    const li = document.createElement("li");
    li.innerHTML = <span>${t.name} - ₹${t.amount}</span>;
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", ()=>{
      expenseTransactions.splice(index,1);
      allTransactions = allTransactions.filter(x=>!(x.type==="Expense" && x.name===t.name && x.amount===t.amount && x.date===t.date));
      updateUI();
    });
    li.appendChild(delBtn);
    expenseList.appendChild(li);
  });

  // Charts update
  incomeChart.data.labels = incomeTransactions.map(t=>t.name);
  incomeChart.data.datasets[0].data = incomeTransactions.map(t=>t.amount);
  incomeChart.update();

  expenseChart.data.labels = expenseTransactions.map(t=>t.name);
  expenseChart.data.datasets[0].data = expenseTransactions.map(t=>t.amount);
  expenseChart.update();

  // Line chart update based on dropdown
  const type = document.getElementById("overviewLineType").value;
  lineChart.data.labels = allTransactions.map(t=>t.date);

  if (type === "income") {
    lineChart.data.datasets[0].label = "Income";
    lineChart.data.datasets[0].data = incomeTransactions.map(t=>t.amount);
    lineChart.data.datasets[0].borderColor = "#00f0ff";
  } else {
    lineChart.data.datasets[0].label = "Expense";
    lineChart.data.datasets[0].data = expenseTransactions.map(t=>t.amount);
    lineChart.data.datasets[0].borderColor = "#ff5b6b";
  }

  lineChart.update();
}
// Line Chart Dropdown  
document.getElementById("overviewLineType").addEventListener("change", (e) => {
  const type = e.target.value;
  lineChart.data.labels = allTransactions.map(t=>t.date);

  if (type === "income") {
    lineChart.data.datasets[0].label = "Income";
    lineChart.data.datasets[0].data = incomeTransactions.map(t=>t.amount);
    lineChart.data.datasets[0].borderColor = "#00f0ff";
  } else {
    lineChart.data.datasets[0].label = "Expense";
    lineChart.data.datasets[0].data = expenseTransactions.map(t=>t.amount);
    lineChart.data.datasets[0].borderColor = "#ff5b6b";
  }

  lineChart.update();
});

// Download Reports  
document.getElementById("downloadBtn").addEventListener("click", () => {
  const type = document.getElementById("downloadOption").value;

  let data = [];
  if (type === "income") {
    data = incomeTransactions;
  } else if (type === "expense") {
    data = expenseTransactions;
  } else {
    data = allTransactions;
  }

  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Name,Amount,Date,Type\n";
  data.forEach(t => {
    csvContent += ${t.name},${t.amount},${t.date},${t.type}\n;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", ${type}_report.csv);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

//  Logout  
document.getElementById("logoutBtn").addEventListener("click", () => {
  // Reset all arrays
  incomeTransactions = [];
  expenseTransactions = [];
  allTransactions = [];

  // Hide dashboard and show landing page again
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("landingPage").style.display = "block";

  // Clear registration form
  document.getElementById("regName").value = "";
  document.getElementById("regEmail").value = "";
  document.getElementById("regProfession").value = "";

  // Reset UI
  updateUI();
});