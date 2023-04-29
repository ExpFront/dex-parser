const { google } = require("googleapis");


const authSheets = async () => {
    //Function for authentication object
    const auth = new google.auth.GoogleAuth({
        keyFile: "config/googleKey.json",
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
  
    //Create client instance for auth
    const authClient = await auth.getClient();
  
    //Instance of the Sheets API
    const sheets = google.sheets({ version: "v4", auth: authClient });
  
    return {
        auth,
        authClient,
        sheets,
    };
}

  
const addDataToGoogleSheet = async ( data ) => {
    // const { winrate, profit } = data
    const winrate = 54;
    const profit = 20000;

    const { sheets } = await authSheets();

    await sheets.spreadsheets.values.append({
        spreadsheetId: '143WYpkNwfnN54V29hV626XyltoyOZP1K99l_848W4iE', // ID Google-таблицы
        range: "Для бота (не трогать)", // Название листа Google-таблицы
        valueInputOption: "USER_ENTERED",
        resource: {
          values: [[ winrate, profit ]],
        },
    })
    .then(response => console.log('Data was added to Google Sheet'))
    .catch(err => console.log('Error adding data to Google Sheet'));
}

module.exports = addDataToGoogleSheet;