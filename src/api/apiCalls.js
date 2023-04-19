import api from './api'
import { getExpiry, setCookie } from '../assets/CookieManager'

export function postRegister (userName, passWord, token, orgCode) {
    // NOTE: api.post takes in three args url, body, and config
    console.log(userName, passWord, token, orgCode)
  return api.post('users/',{username: userName, password: passWord, token_code: token, organization_code: orgCode }).then(res => res.data)
}

export function postLogin (userName, password){
    return api.post("auth/token/", {username: userName, password: password}).then(
    (res) => {
        const accessExpiry = getExpiry(300, "seconds");
        console.log(accessExpiry)
        setCookie("accessToken", res.data.access, accessExpiry);

        const refreshExpiry = getExpiry(14, "days");
        setCookie("refreshToken", res.data.refresh, refreshExpiry);

        return res.data
        }
    )
}

export function postRefreshToken (refreshToken){
    return api.post("auth/token/refresh/", {refresh: refreshToken}).then(
        (res) => {
            const accessExpiry = getExpiry(300, "seconds");
            setCookie("accessToken", res.data.access, accessExpiry);
    
            const refreshExpiry = getExpiry(14, "days");
            setCookie("refreshToken", res.data.refresh, refreshExpiry);
            return res.data
        }
    )
}

export function getShipments (startDate, endDate, accessToken) {
    return api.get(`shipping/shipments?start_date=${startDate}&end_date=${endDate}`, {headers: {"Authorization": `Bearer ${accessToken}`}}).then((res) => {
        console.log(res.data)
        return res.data
        }
    )
}