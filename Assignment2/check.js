

window.onload =function(){
    var gform=document.getElementById("gform")
    gform.onsubmit=handleformsubmit;
};

function handleformsubmit(event){
    let query=document.getElementById(query);
    if(query.value){
        console.log("valid form");
    }else{
        console.log("invalid form");
        query.classList.add("error");
        let errorMessage=document.getElementById("error-message");
        
    }
}
