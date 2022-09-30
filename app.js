var map = L.map('map')

var osm=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
});
osm.addTo(map);
var marker;
// expand btn event
let expandBtn=document.querySelector(".expand-btn");
    expandBtn.addEventListener("click",(e)=>{
expandBtn.classList.toggle("expand-btn-pushed");
document.querySelector(".client-details").classList.toggle("client-details-collapsed");
    });
let modal=document.querySelector(".modal");
let modalBackground=document.querySelector(".modal-background");

// IP DETAILS CLASS 
    class IpDetails{
        constructor(ip){
            this.ip=ip;
            this.apiKey="7a977039b438473e8b4dd32d0f5ab89d";
        }

        async getIpInfo(){
            let responseData;

            if(this.ip==undefined){
      
  //        
                const ipInfo=await fetch(`http://ipwho.is`);
             responseData=ipInfo.json();

                return responseData;
            }
            const ipInfo=await fetch(` http://ipwho.is/${this.ip}`);
             responseData=ipInfo.json();
            return responseData;
      
        }
        getIpAddress(){
let ipAddress=this.getIpInfo().then(data=>data.ip);
return ipAddress;
        }
        getIpLocation(){
let ipLocation=this.getIpInfo().then(data=>data.city);
return ipLocation;
        }
        getIpTimezone(){
let ipTimezone=this.getIpInfo().then(data=>data.timezone.utc);
return ipTimezone;
}
        getIpIsp(){
let ipIsp=this.getIpInfo().then(data=>data.connection.isp);
return ipIsp;
        }
        
        }
    
    // variables
    let ipAddress;
    let form=document.getElementsByTagName("form")[0];
    let textField=document.getElementById("ip-address-input");
    const clientDetailArr=document.querySelectorAll(".client-detail p");



// UI CLASS inherits the IpDetails class
class Ui extends IpDetails{
    constructor(ip,modalBackground,modal,textField,clientDetailArr ){
        // inheritance of the Ipdetails class's attribute
        super(ip);
        this.modalBackground=modalBackground;
        this.modal=modal;
        this.textField=textField;
        this.clientDetailArr=clientDetailArr;
    }
    
        removeModal(){
            this.modalBackground.classList.toggle("active-modal-background");
            this.modal.classList.toggle("active-modal");
            }   
        
        setIpUi(){
            const ipDetailsArr=[this.getIpAddress(),this.getIpLocation(),this.getIpTimezone(),this.getIpIsp()];
                    let i=0;
                    clientDetailArr.forEach((detail)=>{
                        if (i==2){
                 ipDetailsArr[i].then(data=>detail.textContent=`UTC ${data}`);}
                 else{
                 ipDetailsArr[i].then(data=>detail.textContent=data);}
                i++;
            
                })
        }        
    }
    // page load event
window.addEventListener("load",()=>{
    textField.value="";
    const ui=new Ui(ipAddress,modalBackground,modal,textField.value,clientDetailArr);
        ui.setIpUi();
       ui.getIpInfo().then(data=>{
    
    map.setView([data.latitude,data.longitude], 16);
    marker = L.marker([data.latitude,data.longitude]);
    marker.addTo(map); 
})
});

//remove modal 
const ui= new Ui(ipAddress,modalBackground,modal,textField.value,clientDetailArr)

document.querySelector(".modal span").addEventListener("click",()=>ui.removeModal());
modalBackground.addEventListener("click",()=>ui.removeModal());
// form submit evebt
form.addEventListener("submit",(e)=>{
    ipAddress=textField.value;
    const ui=new Ui(ipAddress,modalBackground,modal,textField.value,clientDetailArr);
    if(ipAddress==""){
        document.querySelector(".error-message").innerText="Please input an IP address before submiting";
        ui.removeModal();
e.preventDefault();
        return;
    }
    
    else if(ipAddress.length > 15 || ipAddress.length< 7){
        document.querySelector(".error-message").innerText=" IP address should be between the range of 7-15";
        ui.removeModal();
        e.preventDefault();
        return;
    }
    console.log("worked");

   ui.setIpUi();

   ui.getIpInfo().then(data=>{

    map.setView([data.latitude,data.longitude], 16);

     marker = L.marker([data.latitude,data.longitude]);
    marker.addTo(map); 
}).catch(()=>{
    document.querySelector(".error-message").innerText="Something went wrong, please make sure to input a valid IP address";
    ui.removeModal();
})

e.preventDefault();

})