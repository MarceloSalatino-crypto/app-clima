// ============================================
// PEGANDO OS ELEMENTOS DO HTML
// ============================================

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherCard = document.getElementById('weatherCard');
const error = document.getElementById('error');
const loading = document.getElementById('loading');

// Elementos dentro do card que vamos preencher com dados da API
const cityName = document.getElementById('cityName');
const weatherIcon = document.getElementById('weatherIcon');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const feelsLike = document.getElementById('feelsLike');

// ============================================
// SUA CHAVE DA API
// ============================================

const API_KEY = '9a9f03ad2edd85183b9a6614f2b7c0c7';
// Essa chave é como uma senha que identifica você
// pra poder usar o serviço da OpenWeatherMap

// ============================================
// EVENTOS
// ============================================

searchBtn.addEventListener('click', buscarClima);
// Quando clicar no botão, chama a função buscarClima

cityInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') buscarClima();
  // Permite buscar apertando Enter também
});

// ============================================
// FUNÇÃO PRINCIPAL
// ============================================

async function buscarClima() {
// "async" significa que essa função vai fazer
// operações que levam tempo (buscar da internet)
// O "await" dentro dela faz o código ESPERAR
// a resposta antes de continuar

  const cidade = cityInput.value.trim();
  // Pega o texto digitado e remove espaços extras

  if (cidade === '') return;
  // Se estiver vazio, não faz nada

  mostrarLoading();
  // Mostra o "Buscando..." enquanto espera

  try {
  // "try" = tenta fazer isso. Se der erro, vai pro "catch"

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${API_KEY}&units=metric&lang=pt_br`;
    // Montamos a URL da API com:
    // q=${cidade} → nome da cidade que o usuário digitou
    // appid=${API_KEY} → nossa chave de acesso
    // units=metric → temperatura em Celsius (não Fahrenheit)
    // lang=pt_br → descrição em português

    const resposta = await fetch(url);
    // "fetch" faz uma requisição pra internet
    // "await" espera a resposta chegar antes de continuar
    // É como mandar uma carta e esperar a resposta

    if (!resposta.ok) {
      // Se a resposta não foi ok (ex: cidade não existe)
      throw new Error('Cidade não encontrada');
      // Joga um erro pro catch tratar
    }

    const dados = await resposta.json();
    // ".json()" transforma a resposta em objeto JavaScript
    // "await" espera essa conversão terminar
    // JSON é o formato que APIs usam pra enviar dados

    mostrarClima(dados);
    // Passa os dados pra função que exibe na tela

  } catch (erro) {
  // Se qualquer coisa deu errado, cai aqui
    mostrarErro();
  }
}

// ============================================
// FUNÇÕES DE INTERFACE
// (controlam o que aparece na tela)
// ============================================

function mostrarLoading() {
  // Esconde card e erro, mostra o loading
  weatherCard.style.display = 'none';
  error.style.display = 'none';
  loading.style.display = 'flex';
}

function mostrarErro() {
  // Esconde loading e card, mostra erro
  loading.style.display = 'none';
  weatherCard.style.display = 'none';
  error.style.display = 'block';
}

function mostrarClima(dados) {
  loading.style.display = 'none';
  error.style.display = 'none';
  weatherCard.style.display = 'flex';

  // === DATA DE HOJE ===
  const agora = new Date();
  // new Date() pega a data e hora atual do computador

  const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  // Array com os nomes dos dias — índice 0 = Domingo, 1 = Segunda...

  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  // Array com os nomes dos meses

  const diaSemana = diasSemana[agora.getDay()];
  // getDay() retorna um número de 0 a 6
  // usamos esse número como índice no array diasSemana

  const dia = agora.getDate();
  // getDate() retorna o dia do mês (ex: 19)

  const mes = meses[agora.getMonth()];
  // getMonth() retorna 0 a 11, usamos como índice no array meses

  const ano = agora.getFullYear();
  // getFullYear() retorna o ano completo (ex: 2026)

  // Preenchendo os dados
  cityName.textContent = `${dados.name}, ${dados.sys.country}`;
  temperature.textContent = `${Math.round(dados.main.temp)}°C`;
  description.textContent = dados.weather[0].description;
  humidity.textContent = `💧 ${dados.main.humidity}%`;
  wind.textContent = `💨 ${Math.round(dados.wind.speed * 3.6)} km/h`;
  feelsLike.textContent = `🌡️ ${Math.round(dados.main.feels_like)}°C`;
  weatherIcon.textContent = getEmoji(dados.weather[0].id);

  // Mostra a data no card
  document.getElementById('dataHoje').textContent = `${diaSemana}, ${dia} de ${mes} de ${ano}`;
}

// ============================================
// FUNÇÃO DE EMOJI
// ============================================

function getEmoji(codigo) {
  // A API retorna um código numérico pro tipo de clima
  // Usamos esse código pra escolher o emoji certo

  if (codigo >= 200 && codigo <= 232) return '⛈️';
  // 200-232 = tempestade com raios

  if (codigo >= 300 && codigo <= 321) return '🌦️';
  // 300-321 = garoa

  if (codigo >= 500 && codigo <= 531) return '🌧️';
  // 500-531 = chuva

  if (codigo >= 600 && codigo <= 622) return '❄️';
  // 600-622 = neve

  if (codigo >= 700 && codigo <= 781) return '🌫️';
  // 700-781 = névoa, neblina

  if (codigo === 800) return '☀️';
  // 800 = céu limpo

  if (codigo === 801) return '🌤️';
  // 801 = poucas nuvens

  if (codigo >= 802 && codigo <= 804) return '☁️';
  // 802-804 = nublado

  return '🌡️';
  // Padrão se não encontrar nenhum código
}