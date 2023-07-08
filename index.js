const userTab=document.querySelector("[user-weather]");
const searchTab=document.querySelector("[search-weather]");
const grantAccessContainer=document.querySelector(".location-access");
const accessBtn=document.querySelector(".access-btn");
const searchForm=document.querySelector(".search-form");
const overlayContainer=document.querySelector(".overlay");
const loadingScr=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".userInfo-container");
const errorContainer=document.querySelector(".error-container");
const retryBtn=document.querySelector(".retryBtn")
const wrapper=document.querySelector(".wrapper");
const API="888e1994000ee782d2843819e243b7cf";


let currentTab=userTab;
currentTab.classList.add("current-tab");
getfromSessionStorage();
function switchTab(clickedTab){
    if(currentTab!=clickedTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            wrapperHeight();
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            userInfoContainer.classList.remove("active");
            wrapperHeight();
            searchForm.classList.remove("active");
            getfromSessionStorage();
        }
    }


}

userTab.addEventListener("click",()=>{
    switchTab(userTab);
})
searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
})

function getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");

    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        getWeatherInfo(coordinates);
    }
}

async function getWeatherInfo(coordinates){
    const {lat,lon}=coordinates;
    grantAccessContainer.classList.remove("active");
    loadingScr.classList.add("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API}&units=metric`);
    const data= await response.json();
    loadingScr.classList.remove("active");
    userInfoContainer.classList.add("active");
    wrapperHeight();
    renderWeatherInfo(data);
    }
    catch{

    }
    
    }


    function renderWeatherInfo(weatherinfo){

   
    const cityName=document.querySelector("[user-city]");
    const countryIcon=document.querySelector("[country-icon]");
    const weatherdesc=document.querySelector("[weatherdesc]");
    const weatherIcon=document.querySelector("[weather-icon]");
    const temp=document.querySelector("[user-temp]");
    const windSpeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const clouds=document.querySelector("[data-cloud]");

   
    
            cityName.innerText=weatherinfo?.name;
            countryIcon.src=`https://flagcdn.com/144x108/${weatherinfo?.sys?.country.toLowerCase()}.png`;
            weatherdesc.innerText=weatherinfo?.weather?.[0]?.description;
            weatherIcon.src=`http://openweathermap.org/img/w/${weatherinfo?.weather?.[0]?.icon}.png`;
            temp.innerText=weatherinfo?.main?.temp;
            windSpeed.innerText=weatherinfo?.wind?.speed;
            humidity.innerText=weatherinfo?.main?.humidity;
            clouds.innerText=weatherinfo?.clouds?.all;
  }

    function getLocation(){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(showPosition);

        }
        else{
            //hw
            userInfoContainer.classList.remove("active");
            wrapperHeight();
        }
    }
    function showPosition(position){
        const userCoordinates={
            lat: position.coords.latitude,
            lon: position.coords.longitude,
        }
!
        sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
        getWeatherInfo(userCoordinates);
    }
    const searchInput=document.querySelector("[data-searchInput]");
    accessBtn.addEventListener("click",getLocation);

    searchForm.addEventListener("submit",(e)=>{
        e.preventDefault();
        let cityName=searchInput.value;

        if(cityName==="") return;
        else{
            fetchSearchWeatherInfo(cityName);
        }
    })
    async function fetchSearchWeatherInfo(city){
        loadingScr.classList.add("active");
    userInfoContainer.classList.remove("active");
    wrapperHeight();
    grantAccessContainer.classList.remove("active");

    try{
    const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API}&units=metric`);

    const data=await response.json();
    if (!data.sys) {
        throw data;
      }
      
    loadingScr.classList.remove("active");
    userInfoContainer.classList.add("active");
    wrapperHeight();
    renderWeatherInfo(data);
    }
    catch(err){
        loadingScr.classList.remove("active");
        overlayContainer.classList.add("active")
        errorContainer.classList.add("active");
        retryBtn.addEventListener("click",()=>{
            overlayContainer.classList.remove("active");
            errorContainer.classList.remove("active");
            searchForm.classList.add("active");
            searchInput.value="";
        })
    }
    }
    function wrapperHeight(){
        if(userInfoContainer.classList.contains("active")){
            wrapper.style.height="100%";
        }
        else{
            wrapper.style.height="100vh";
        }
    }

   


    

