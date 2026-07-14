import axios from "axios";

const order = async()=>{
try {
  const response = await axios.get("http://localhost:8080/api/order");

}catch(error){
  console.log(error)
}

}