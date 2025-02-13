'use strict';


function bar() {
  var dataPoints = [];
  var dataPoints_pred = [];

  var stockChart = new CanvasJS.StockChart("chartContainer",{
    theme: "light1",
    animationEnabled: true,
    title: {
        text: "График котировки"
      },
    charts: [{  
      zoomEnabled: false,
      axisX: {
        crosshair: {
          enabled: true,
          snapToDataPoint: true
        }
      },
      axisY: {
        prefix: "$",
        title: "Цена",
        crosshair: {
          enabled: true
        }
      },    
      data: [{        
        type: "area", //Change it to "spline", "area", "column"
        color: "#de5050",
        yValueFormatString: "$#,###.##",
        dataPoints : dataPoints
      },
      {        
        type: "area", //Change it to "spline", "area", "column"
        color: "#022273",
        yValueFormatString: "$#,###.##",
        dataPoints : dataPoints_pred
      }]
    }],
    rangeSelector: {        
      buttons: [{            
        range: 5,
        rangeType: "day",
        label: "5D"
      },{            
        range: 1,
        rangeType: "week",
        label: "1W"
      },{            
        range: 2,
        rangeType: "week",
        label: "2W"
      },{            
        range: 1,
        rangeType: "month",
        label: "1M"
      },{            
        range: 1,
        rangeType: "year",
        label: "1Y"
      },{            
        rangeType: "all",
        label: "Show All" //Change it to "All"
      }],
      inputFields: {
        startValue: new Date(2025, 0, 1),
        endValue: new Date(2025, 12, 31)
      }
    },
    navigator: {
      slider: {
        minimum: new Date(2025, 0, 1),
        maximum: new Date(2025, 12, 31)
      }
    }
  }); 

  $.getJSON("db/stocks.json", function(data) {  
    for(var i = 0; i < (data.length-4); i++){
      dataPoints.push({x: new Date(data[i].datetime), y: Number(data[i].close)});
    }
  
    for(var i = (data.length-5); i < data.length; i++){
      dataPoints_pred.push({x: new Date(data[i].datetime), y: Number(data[i].close)});
    }
    stockChart.render();
  });
}


const cartButton = document.querySelector("#cart-button"); // получаю кнопу "Корзина"
const modal = document.querySelector(".modal"); // Получаю модальное окно
const close = document.querySelector(".close"); // Получаю кнопку закрытия модального окна
const buttonAuth = document.querySelector('.button-auth'); // Получаю кнопку входа
const modalAuth = document.querySelector('.modal-auth'); // Получаю модальное окно авторизации
const closeAuth = document.querySelector('.close-auth'); // Получаю кнопку закрытие модального окна авторизации
const logInForm = document.querySelector('#logInForm'); // Получаю форму авторизации в модальном окне авторизации
const logInInput = document.querySelector('#login'); // Получаю форму для ввода логина
const userName = document.querySelector('.user-name'); // Получаю форму, которая выводит логин авторизованного пользователя
const buttonOut = document.querySelector('.button-out'); // Получаю кнопку "Выйти"
const cardsRestaurants = document.querySelector('.cards-restaurants'); // Получаю блок с карточками ресторанов
const containerPromo = document.querySelector('.container-promo'); // Получаю блок с промо
const restaurants = document.querySelector('.restaurants'); // Получаю блок с ресторанами
const menu = document.querySelector('.menu'); // Получаю блок с меню
const logo = document.querySelector('.logo'); // Получаю лого в заголовке
const cardsMenu = document.querySelector('.cards-menu'); // Получаю блок с карточками меню
const restaurantTitle = document.querySelector('.restaurant-title'); // Получаю имя ресторана в шапке меню
const newsTitle = document.querySelector('.news-title'); // Получаю имя ресторана в шапке меню
const newsInfo = document.querySelector('.news-info'); // Получаю имя ресторана в шапке меню
const restautantRating = document.querySelector('.rating'); // Получаю рейтинг ресторана в шапке меню
const restaurantPrice = document.querySelector('.price'); // Получаю цену ресторана в шапке меню
const restaurantCategory = document.querySelector('.category'); // Получаю категорию ресторана в шапке меню
const inputSearh = document.querySelector('.input-search'); // Получаю поисковую строку блюд
const modalBody = document.querySelector('.modal-body'); // Получаю тело корзины, где находятся строки товаров
const modalPrice = document.querySelector('.modal-pricetag'); // Получаю поле с итоговой ценой товаров в корзине
const buttonClearCart = document.querySelector('.clear-cart'); // Получаю кнопку "Отмена" в корзине
let login = localStorage.getItem('userLogin'); // Переменная для размещения логина
const cartArray = JSON.parse(localStorage.getItem(`userCart_${login}`)) || []; // Создаю новый массив объектов-товаров корзины или получаю из локал-стора, если у данного пользователя уже есть корзина

function saveCart() { // Функция для сохранения корзины в локальном хранилище
  localStorage.setItem(`userCart_${login}`, JSON.stringify(cartArray)); // Выкладываю массив объектов-товаров корзины пользователя, приведённый в формат строки, в локальное хранилище браузера
}

function downloadCart() { // Функция подтягивания корзины из локального хранилища
  if (localStorage.getItem(`userCart_${login}`)) { // Проверяю, есть ли в локальном хранилище корзина данного пользователя
    const data = JSON.parse(localStorage.getItem(`userCart_${login}`));  // Достаю корзину и выполняю парсинг
    cartArray.push(...data); // При помощи spred оператора выполняю деструктуризацию массива data и поэлементный пуш в массив корзины
  }
}

const getData = async function(url) { // Асинхронная функция для запроса и получения данных от json
  const  response = await fetch(url); // Переменная для получения результата запроса
  if (!response.ok) { // Метод json для расшифровки данных
    throw new Error(`Ошибка по адресу ${url},
    статус ошибки ${response.status}!`); // Вызов ошибки (сброс выполнения функции)
  }
  return await response.json(); // Возвращаю данные (выполнение функции getData остановится в этой строке до тех пор, пока не выполнится метод json)
}

function createCardRestaurant(restaurant) { // Функция для генерации карточки ресторана

  const { image, name, price, type, move, forecast1, forecast2 } = restaurant; // Деструктуризация полученного объекта
  const cardRestaurant = document.createElement('a'); // Создаю ссылку с классами карточки и с свойством products
  cardRestaurant.className = 'card card-restaurant wow fadeInUp';
  cardRestaurant.setAttribute('data-wow-delay', '0.1s');
  //cardRestaurant.products = products;
  cardRestaurant.info = {name, type, forecast1, forecast2}; // Добавляю объект info для динамического заголовка ресторана в меню
  // переменная, содержащая вёрстку карточки
  // const card = `
  //   <img src="${image}" alt="image" class="card-image"/>
  //   <div class="card-text">
  //     <div class="card-heading">
  //       <h3 class="card-title">${name}</h3>
  //       <span class="card-tag tag">${timeOfDelivery} мин</span>
  //     </div>
  //     <div class="card-info">
  //       <div class="rating">
  //         ${stars}
  //       </div>
  //       <div class="price">От ${price} ₽</div>
  //       <div class="category">${kitchen}</div>
  //     </div>
  //   </div>
  // `;
  let move_pic = 0
  if (move == 1) {
    move_pic = "img/social/move_up.svg"
  } else {
    move_pic = "img/social/move_down.svg"
  }
  const card = `
    <img src="${image}" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">${name}</h3>
        <img src="${move_pic}" class="card-tag tag" />
      </div>
      <div class="card-info">
        <div class="price">${type}</div>
      </div>
      <div class="card-info">
        <div class="category">Актуальная цена:</div>
        <div class="rating">
          ${price} ₽
        </div>
      </div>
    </div>
  `;
  cardRestaurant.insertAdjacentHTML('beforeend',card); // добавление вёрстки карточки ресторана в оболочку-ссылку
  cardsRestaurants.insertAdjacentElement('beforeend',cardRestaurant); // добавление карточки ресторана на страницу
  
}

function createCardGood() { // Функция создания карточки в меню ресторана
  // const { description, id, image, name, price } = goods;
  const card = document.createElement('div');
  card.className = 'card wow fadeInUp';
  card.setAttribute('data-wow-delay', '0.1s');
  // card.id = id;
  card.insertAdjacentHTML('beforeend', `
			<div id="chartContainer" style="height: 450px; width: 100%;"></div>
  `);
  cardsMenu.insertAdjacentElement('beforeend',card);
  bar();
  // picture();
}


function addNews(data) { 
  const source = data.Source
  const title = data.Title
  const link = data.Links
  const date = data.Date_Names
  const photo = data.Photo

  let pic = 0

  if ((photo.substr(photo.length - 4) != ".jpg") && (photo.substr(photo.length - 4) != ".png") && (photo.substr(photo.length - 4) != ".svg")){
      pic = "img/icon/failed_news.png"
  } else {
      pic = photo
  }

  const itemCart = `
      <div class="food-row" onclick="window.open('${link}', '_blank');" style="cursor:pointer">
        <img src="${pic}" class="news-tag"/>
        <div class="news-row">
          <strong class="food-price news-text">От ${source} • ${date}</strong>
          <span class="food-name news-text">${title}</span>
        </div>
      </div>
    `;
  modalBody.insertAdjacentHTML('beforeend', itemCart);

}


function openGoods(event) { // Функция создания меню конкретного ресторана
  const target = event.target; // Переменная, содержащая элемент, по которому кликнули
  const restaurant = target.closest('.card-restaurant'); // Переменная, содержащая карточку, по элементу которой кликнули (closest осуществляет подъём по вышестоящим элементам, пока не найдёт элемент с нужным селектором)
  if (restaurant) { // Проверка, что кликнули именно по карточке (если мимо карточки, то будет NULL)
    cardsMenu.textContent = ''; // Очищаем меню
    containerPromo.classList.add('hide'); // Добавляю класс hide блоку с промо
    restaurants.classList.add('hide'); // Добавляю класс hide блоку с ресторанами
    menu.classList.remove('hide'); // Удаляю класс hide у блока с меню ресторана, на который кликнули
    const {name, type, forecast1, forecast2} = restaurant.info; // Деструктуризация полученного объекта (получаю от объекта карточки ресторана поля для того, чтобы в меню ресторана подставить в шапку)
    restaurantTitle.textContent = name; // Присваиваю элементам заголовка поля, принадлежащие объекту info объекта ресторана
    newsTitle.textContent = 'Новости и аналитика ›'; // Присваиваю элементам заголовка поля, принадлежащие объекту info объекта ресторана
    restaurantPrice.textContent = type;
    if (forecast1>0) {
      restaurantCategory.textContent = `+${forecast1} (+${forecast2}%)`;
      restaurantCategory.classList.add('green');
    } else {
      restaurantCategory.textContent = `–${forecast1*-1} (–${forecast2*-1}%)`;
      restaurantCategory.classList.add('red');
    }
    createCardGood();
    getData('./db/temp.json').then(function(data) { // Обработка полученного промиса
      // newsInfo.textContent = `${data.length}`
      for (const [key, value] of Object.entries(data)) {
        addNews(value);
      }
      // for (key elem in data) {
      //   addNews(elem);
      // }
      // data.forEach(addNews(data));
      // addNews(data[0]);
      // addNews(data[1]);
    });
  }
}


function init() { // Функция инициализации
  getData('./db/partners.json').then(function(data) { // Обработка полученного промиса
    data.forEach(createCardRestaurant);
  });
  inputSearh.addEventListener("keypress", function(event) { // Событие нажатия клавиши Enter при вводе блюда в поиск
    if (event.charCode === 13) {
      const value = event.target.value.trim(); // Получаю значение таргета переданного события (то есть то, что ввели в поисковую строку)
      if (!value){ // Если пустой ввод
        event.target.style = 'outline-color: red';
        event.target.value = '';
        setTimeout(function() {
          event.target.style = '';
        }, 1500);
        return;
      }
      getData('./db/partners.json').then(function(data) { // Получаю все рестораны в формате json и обрабатываю данные
        const linksProduct = data.map(function(partner) { // Создаю массив из линков на json'ы всех ресторанов
          return partner.products;
        });
        return linksProduct;
      }).then(function(linksProduct) { // Перебираю массив из линков
        cardsMenu.textContent = ''; // Очищаем меню
        linksProduct.forEach(function(link) {
          getData(`./db/${link}`).then(function(goods) { // Получаю товары ресторана link
            const resultSearch = goods.filter(function(item) { // Переменная с фильтрованными товарами
              const name = item.name.toLowerCase();
              return name.includes(value.toLowerCase()); // Возвращаю только те товары, которые соответствуют поиску
            });
            containerPromo.classList.add('hide'); // Добавляю класс hide блоку с промо
            restaurants.classList.add('hide'); // Добавляю класс hide блоку с ресторанами
            menu.classList.remove('hide'); // Удаляю класс hide у блока с меню ресторана, на который кликнули
            restaurantTitle.textContent = 'Результаты поиска'; // Задаю новую шапку меню
            restautantRating.textContent = '';
            restaurantPrice.textContent = '';
            restaurantPrice.classList.add('hide');
            restaurantCategory.textContent = '';
            resultSearch.forEach(createCardGood); // Для каждого товара ресторана link генерю карточку
            event.target.value = ''; // Очищаю строку ввода
          });
        })
      });
    }
  });
  cardsRestaurants.addEventListener('click', openGoods); // Событие, когда кликнули в блоке с карточками
  logo.addEventListener('click', function(){
    containerPromo.classList.remove('hide'); // Удаляю класс hide у блока с промо
    restaurants.classList.remove('hide'); // Удаляю класс hide у блока с ресторанами
    menu.classList.add('hide'); // Добавляю класс hide блоку с меню ресторана, на который кликнули
    restaurantPrice.classList.remove('hide');
  })

  // checkAuth(); // Первичный вызов функции проверки авторизации (при заходе на сайт)
}

init();
if (window.innerWidth<=480) {
  new Swiper('.swiper-container', { // Объект слайдера 
    slidesPerView: 1, // Показывать один слайд за раз
    loop: true, // Зациклить слайды
    autoplay: { // Автовоспроизведение слайдера
      delay: 5000,
      disableOnInteraction: false, // Автовоспроизведение не будет отключено после взаимодействия с пользователем
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  })
} else{
  new Swiper('.swiper-container', { // Объект слайдера 
    slidesPerView: 1, // Показывать один слайд за раз
    loop: true, // Зациклить слайды
    autoplay: { // Автовоспроизведение слайдера
      delay: 5000,
      disableOnInteraction: false, // Автовоспроизведение не будет отключено после взаимодействия с пользователем
    },
    effect: 'cube',
    cubeEffect: {
      shadow: false,
      slideShadows: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  })
}