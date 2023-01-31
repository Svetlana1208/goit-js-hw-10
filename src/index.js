import './css/styles.css';
import API from "./fetchCountries";
import debounce from 'lodash.debounce';
import { Notify } from '../node_modules/notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
}

refs.input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch (e) {
    refs.countryList.innerHTML = "";
    refs.countryInfo.innerHTML = "";  

    const name = e.target.value.trim();

    if (name !== "") {
    
    API.fetchCountries(name)
        .then(result => {

            if(result.length > 10) {
                Notify.info("Too many matches found. Please enter a more specific name.");
            } 
            else if (result.length >= 2 && result.length <= 10) {
                const makeList = result.map(country =>
                    `<li class="list"><img src=${country.flags.svg} alt = ${country.name.official} width = "40px" height = "20px"><p class="text">${country.name.official}</p></li>`).join("");
                
                    refs.countryList.insertAdjacentHTML('beforeend', makeList);
            }
            else if (result.length === 1) {
                refs.countryList.innerHTML = "";
                const markupCountry = result.map(country => 
                    `<div class="main">
                        <img src=${country.flags.svg} alt = ${country.name.official} width = "80px" height = "40px">
                        <h1>${country.name.official}</h1>
                    </div>
                    <p><b>Capital: </b>${country.capital}</p>
                    <p><b>Population: </b>${country.population}</p>
                    <p><b>Languages: </b>${Object.values(country.languages)}</p>
                    `).join("");
                
                refs.countryInfo.insertAdjacentHTML('beforeend', markupCountry);
            }
        })
            .catch(onFetchError);
    }
}


function onFetchError(error) {
    Notify.failure("Oops, there is no country with that name");
}

