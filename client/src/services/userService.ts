import apiClient from "./apiClient";
import { UserType } from "../types/user";
import { CredentialResponse } from "@react-oauth/google";

export const registerUser = (user: UserType) => {
    return new Promise<UserType>((resolve, reject) => {
        console.log('registering user');
        console.log(user);

        apiClient.post("/auth/register", user).then((response) => {
            console.log(response);
            resolve(response.data);
        }).catch((error) => {
            console.log(error);
            reject(error);
        })
    })
}


// TODO: check if the path is valid!
export const googleSignIn = (credintialResponse: CredentialResponse) => {
    return new Promise<UserType>((resolve, reject) => {
        console.log('Google Sign in');
        console.log(credintialResponse);

        apiClient.post("/auth/google", credintialResponse).then((response) => {
            console.log(response);
            resolve(response.data);
        }).catch((error) => {
            console.log(error);
            reject(error);
        })
    })
}

export const loginUser = (user: UserType) => {
    return new Promise<UserType>((resolve, reject) => {
        console.log(`user login`);
        console.log(user);

        apiClient.post('/auth/login', user).then((response) => {
            console.log(response);
            resolve(response.data);
        }).catch((error) => {
            console.log(error);
            reject(error);
        })
    })
}

export const logoutUser = (token: string) => {
    return new Promise<string>((resolve, reject) => {
        console.log(`logging out`);

        apiClient.post('/auth/logout', token).then((response) => {
            console.log(response);
            resolve(response.data);
        }).catch((error) => {
            console.log(error);
            reject(error);
        })
    })
}