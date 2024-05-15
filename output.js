const acctData = [
  { IDNo: "00001", AccTyp: "LN", Balance: 130212.55 },
  { IDNo: "00002", AccTyp: "SA", Balance: 212896.75 },
  { IDNo: "00003", AccTyp: "SA", Balance: 3561.56 },
  { IDNo: "00001", AccTyp: "LN", Balance: 98000.12 },
  { IDNo: "00002", AccTyp: "SA", Balance: 1450000.11 },
  { IDNo: "00001", AccTyp: "LN", Balance: 1500894.0 },
  { IDNo: "00001", AccTyp: "SA", Balance: 45222.12 },
  { IDNo: "00002", AccTyp: "LN", Balance: 32341.51 },
  { IDNo: "00003", AccTyp: "SA", Balance: 43551.15 },
  { IDNo: "00004", AccTyp: "SA", Balance: 562254.18 },
  { IDNo: "00005", AccTyp: "SA", Balance: 90431.12 },
  { IDNo: "00001", AccTyp: "SA", Balance: 11960.89 },
  { IDNo: "00010", AccTyp: "SA", Balance: 145.78 },
  { IDNo: "00002", AccTyp: "SA", Balance: 4345.67 },
  { IDNo: "00004", AccTyp: "LN", Balance: 653342.18 },
];

const clientData = [
  { IDNo: "00001", ClntName: "Pascual, Piolo" },
  { IDNo: "00002", ClntName: "Rosales, Jericho" },
  { IDNo: "00003", ClntName: "Dantes, Dingdong" },
  { IDNo: "00004", ClntName: "Padilla, Daniel" },
  { IDNo: "00005", ClntName: "Rodriguez, Tom" },
  { IDNo: "00010", ClntName: "Santos, Eric" },
];

function calculateHighestLoanBalance() {
  const loans = acctData.filter((account) => account.AccTyp === "LN"); // Filter loan accounts

  const highestBalanceClient = loans.reduce((maxClient, currentClient) => {
    if (currentClient.Balance > (maxClient?.Balance || 0)) {
      return currentClient;
    }
    return maxClient;
  }, {});

  return highestBalanceClient;
}

function calculateClientBalances(clientId) {
  const clientAccounts = acctData.filter(
    (account) => account.IDNo === clientId
  );
  const totalBalance = clientAccounts.reduce(
    (sum, account) => sum + account.Balance,
    0
  );

  let totalSavingsBalance = 0;
  for (const account of clientAccounts) {
    if (account.AccTyp === "SA") {
      totalSavingsBalance += account.Balance;
    }
  }

  const clientInfo = clientData.find((client) => client.IDNo === clientId);
  const clientName = clientInfo ? clientInfo.ClntName : "Client Not Found"; // Handle missing client names

  return { totalBalance, totalSavingsBalance, clientName };
}

function generateReport() {
  const reportContainer = document.getElementById("report-container");
  reportContainer.innerHTML = ""; // Clear existing content

  const highestLoanClient = calculateHighestLoanBalance();
  const reportData = [
    {
      label: "Client with Highest Loan Balance",
      value: `${highestLoanClient.IDNo} - ${highestLoanClient.Balance.toFixed(
        2
      )}`,
    },
  ];

  for (const client of [...new Set(acctData.map((d) => d.IDNo))]) {
    // Get unique client IDs
    const clientBalances = calculateClientBalances(client);
    reportData.push({
      label: `Client ${clientBalances.clientName} Total Balance`,
      value: clientBalances.totalBalance.toFixed(2),
    });
    reportData.push({
      label: `Client ${clientBalances.clientName} Total Savings`,
      value: clientBalances.totalSavingsBalance.toFixed(2),
    });
  }

  const table = document.createElement("table");
  table.border = 1;

  const headerRow = table.insertRow();
  const headerCell1 = headerRow.insertCell();
  headerCell1.textContent = "Report Item";
  const headerCell2 = headerRow.insertCell();
  headerCell2.textContent = "Value";

  for (const item of reportData) {
    const row = table.insertRow();
    const cell1 = row.insertCell();
    cell1.textContent = item.label;
    const cell2 = row.insertCell();
    cell2.textContent = item.value;
  }

  reportContainer.appendChild(table);
}

$(function () {
  $("button").click(function () {
    var url =
      "data:application/vnd.ms-excel," +
      encodeURIComponent($("#report-container").html());
    location.href = url;
    return false;
  });
});
