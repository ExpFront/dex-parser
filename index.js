const axios = require('axios').default;
const http = require('http');
const getWalletTransactions = require('./utils/getWalletTransactions')
const getWalletsTransactions = require('./utils/getWalletTransactions')
const handleWalletTransactions = require('./utils/handleWalletTransactions')


const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/json');
});


const mapData = (response) => {
  const mappedArr = [];
  const { data } = response;

  console.log(data, 'data')
}



const getWalletTransactionsTotalInfo = (searchingWallet) => {
  axios.get(`https://api.zerion.io/v1/wallets/${searchingWallet}/transactions/?currency=usd&filter[operation_types]=trade`, axiosConfig)
    // .then(response => response.json())
    // .then(response => console.log(response.data[0].attributes.transfers, 'tut'))
    .catch(err => console.error(err));
}




server.listen(3002, 'localhost', async () => {
  console.log(`Server running at http://localhost:3002/`);

  const searchingWallet = '0x5aceb63d52d0d7081a72f254401893ffcf81381a';
  const walletTransactions = await getWalletTransactions(searchingWallet);
  handleWalletTransactions(walletTransactions)

  // const searchingWallets = ['0xf731bd55dba8679a9585fa5719f4219762a87347', '0x08b5d99e75c7d821da91ce8615c015c73fac312a']
  // getWalletsTransactions(searchingWallets)
});













// Основная задача обработать массив значений полученных через запрос к zerion.
// Ниже описан порядок действий.

// Взять данные по транзакциям по необходимым кошелькам -> создать приведенный массив из объектов.
// Определить какие значения и параметры должны быть в объекте (зависит от того, что мы будем делать далее с ними)
// Получить массив из приведенных значений. И привести значения к необходимым нам новым значением (посчитать винрейт, общее кол-во сделок, общий профит чувака)
// Вывести в консоль эти данные. 
// ✅ Следующий шаг. Сделать массив из кошельков, которые мы смотрим. И сделать цикл, в который мы будем передавать уникальный кошелек.
// Привести значения всех кошельков к 1 общему массиву с данными.
// Вывести в эксель эти данные в виде таблицы. (использовать Google Sheets API (не делай в текущей таблице, чтобы не сломать случайно ее))
// В экселе уже сможем фильтровать их как хотим.







