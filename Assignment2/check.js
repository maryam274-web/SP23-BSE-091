window.onload=function(){
    let gform=document.getElementById("gform");
    gform.onsubmit= handleFormSubmit
}

function handleFormSubmit(event){

    event.preventDefault();

    let userName=document.getElementById("name").value.trim();
    let email=document.getElementById("exampleInputEmail1").value.trim();
    let address=document.getElementById("address").value.trim();
    let city=document.getElementById("city").value.trim();

    var namePattern = /^[A-Za-z\s]+$/;
    var email_pattern=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    var cityPattern = /^[a-zA-Z\s'-]+$/;
    let isvalid=true;

    let name_error=document.getElementById("name_error");
    let email_error=document.getElementById("email_error");
    let address_error=document.getElementById("address_error");
    let city_error=document.getElementById("city_error");
    

    if(userName==="" || userName.length<2){
        name_error.innerHTML= "Name is empty or short";
        isvalid=false;
    }else if(!namePattern.test(userName)){
        name_error.innerHTML= "Name can only contain letters, hyphens, and apostrophes.";
        isvalid=false;
    }
    else{
        name_error.innerHTML="";
    }

   
    if(email==="" ){
        email_error.innerHTML= "Email address cannot be empty";
        isvalid=false;
    }
    else if(!email_pattern.test(email)){
        email_error.innerHTML="Please enter a valid email address.";

    }else{
        email_error.innerHTML="";
    }

    if(address==="" || address.length<5 ){
        address_error.innerHTML="Address is empty or short";
        isvalid=false;
    }else{
        address_error.innerHTML="";
    }

   
    if(city==="" || city.length<2){
        city_error.innerHTML = "city name is empty or short";
        isvalid=false;
    }else if(!cityPattern.test(city)){
        city_error.innerHTML = "City name can only contain letters, spaces, hyphens, and apostrophes.";
        isvalid=false;
    }else{
        city_error.innerHTML="";
    }


    if (isvalid) {
        document.getElementById("name").value = "";
        document.getElementById("exampleInputEmail1").value = "";
        document.getElementById("address").value = "";
        document.getElementById("city").value = "";

        alert("Form is submitted successfully!");
    }

   return isvalid;

    
}



