const { google } = require("googleapis");


const authSheets = async () => {
    const auth = new google.auth.GoogleAuth({
        keyFile: "config/googleKey.json",
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
  
    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: authClient });
  
    return {
        auth,
        authClient,
        sheets,
    };
}


  
const addDataToGoogleSheet = async ( walletID, { pnl, winrate, openedPositions, closedPositions, remainingPositions } ) => {
    const { sheets } = await authSheets();
    const valuesToAdd = [
        `https://app.zerion.io/${walletID}`, // link to wallet
        walletID,
        pnl,
        winrate.amount,
        winrate.percent,
        openedPositions.count,
        closedPositions.count,
        remainingPositions.count,
        remainingPositions.amountInUSD,
        remainingPositions.amountInUSDWithFee
    ];


    await sheets.spreadsheets.values.append({
        spreadsheetId: '143WYpkNwfnN54V29hV626XyltoyOZP1K99l_848W4iE', // ID Google-таблицы
        range: "Для бота (не трогать)", // Название листа Google-таблицы
        valueInputOption: "USER_ENTERED",
        resource: {
          values: [valuesToAdd],
        },
    })
    .then(response => console.log('Data was added to Google Sheet'))
    .catch(err => console.log('Error adding data to Google Sheet'));
}

module.exports = addDataToGoogleSheet;