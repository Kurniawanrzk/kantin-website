import axios from "axios";

const token = JSON.parse(localStorage.getItem("access_token")).token
const link = `http://127.0.0.1:8000/api/v1/auth/me?token=${token}`
export const Me = async() => {
    axios.post(link)
    try {
        const res = await axios.post(link)
    }
}