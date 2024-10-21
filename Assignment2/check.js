
let form=document.getElementById("gform");



let name_error=document.getElementById("name_error");
let email_error=document.getElementById("email_error");
let address_error=document.getElementById("address_error");
let city_error=document.getElementById("city_error");

form.addEventListener('submit',handleFormSubmit);


function handleFormSubmit(event){
    
    event.preventDefault();

    let userName=document.getElementById("name").value;
    let email=document.getElementById("exampleInputEmail1").value;
    let address=document.getElementById("address").value;
    let city=document.getElementById("city").value;


    let isvalid=true;

    let namePattern = /^[A-Za-z\s]+$/;
    if(userName.trim()===""){
        name_error.innerHTML= "Invalid name";
        isvalid=false;
    }else if(!namePattern.test(userName)){
        name_error.innerHTML= "Name can only contain letters, spaces, hyphens, and apostrophes.";
        isvalid=false;
    }else if(userName.length<2){
        name_error.innerHTML= "Name is too short";
        isvalid=false;
    }else{
        name_error.innerHTML="";
    }

    let email_pattern=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(email.trim()==="" || !email_pattern.test(email)){
        email_error.innerHTML= "Email is invalid";
        isvalid=false;
    }else{
        email_error.innerHTML="";
    }
    let addressPattern = /^[a-zA-Z0-9\s,'-]+$/;
    if(address.trim()==="" || address.length<5 ){
        address_error.innerHTML="Address is empty or short";
        isvalid=false;
    }else{
        address_error.innerHTML="";
    }

    let cityPattern = /^[a-zA-Z\s'-]+$/;
    if(city.trim()==="" || city.length<2){
        city_error.innerHTML = "city name is empty or short";
        isvalid=false;
    }else if(!cityPattern.test(city)){
        city_error.innerHTML = "City name can only contain letters, spaces, hyphens, and apostrophes.";
        isvalid=false;
    }else{
        city_error.innerHTML="";
    }

    if(isvalid){
        alert("form submitted successfully")
    }

    
}



