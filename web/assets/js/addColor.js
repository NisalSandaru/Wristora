function addColor(){
    
    const color = "aaa";
    
    const data = {
        color: color
    };
    
    const jsonData = JSON.stringify(data);
    
    fetch("AddColor",{
        method: "POST",
        body: jsonData,
        hearders: {
            "Content-type": "applicayion/json"
        }
    });

}