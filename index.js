const axios = require('axios').default;
const http = require('http');

const getWalletTransactions = require('./utils/api/wallets/getWalletTransactions')
const getWalletsTransactions = require('./utils/api/wallets/getWalletTransactions')
const handleWalletTransactions = require('./utils/api/wallets/handleWalletTransactions')

const calculateWalletStatistics = require('./utils/calculations/walletStatistics/calculateWalletStatistics')

const addDataToGoogleSheet = require('./utils/api/google/addDataToGoogleSheet')


const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/json');
});


server.listen(3002, 'localhost', async () => {
  console.log(`Server running at http://localhost:3002/`);

  const searchingWallet = '0xf731bd55dba8679a9585fa5719f4219762a87347';

  try {
    const walletTransactions = await getWalletTransactions(searchingWallet);
    const mappedTransactionsData = handleWalletTransactions(walletTransactions);
    const walletStatistics = await calculateWalletStatistics(mappedTransactionsData);

    addDataToGoogleSheet(searchingWallet, walletStatistics);
  } catch (err) {
    console.error(`Error fetching data: ${err}`)
  }


  // const searchingWallets = ['0xf731bd55dba8679a9585fa5719f4219762a87347', '0x08b5d99e75c7d821da91ce8615c015c73fac312a']
  // getWalletsTransactions(searchingWallets)
});




// Основная задача обработать массив значений полученных через запрос к zerion.
// Ниже описан порядок действий.

// ✅ Взять данные по транзакциям по необходимым кошелькам -> создать приведенный массив из объектов.
// ✅ Определить какие значения и параметры должны быть в объекте (зависит от того, что мы будем делать далее с ними)
// ✅ Получить массив из приведенных значений. И привести значения к необходимым нам новым значением (посчитать винрейт, общее кол-во сделок, общий профит)
// ✅ Вывести в консоль эти данные. 
// ✅ Следующий шаг. Сделать массив из кошельков, которые мы смотрим. И сделать цикл, в который мы будем передавать уникальный кошелек.
// Привести значения всех кошельков к 1 общему массиву с данными.
// Вывести в эксель эти данные в виде таблицы. (использовать Google Sheets API (не делай в текущей таблице, чтобы не сломать случайно ее))
// В экселе уже сможем фильтровать их как хотим.







