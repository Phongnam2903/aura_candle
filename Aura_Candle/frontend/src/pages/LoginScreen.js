import React from "react";
import LoginForm from "../components/Auth/LoginForm";
import Layout from "../layout/Layout";


export default function LoginScreen() {

    return (
        <Layout>  <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <LoginForm />
        </div></Layout>

    );
}
