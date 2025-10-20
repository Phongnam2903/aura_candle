import React from "react";
import LoginForm from "../../components/Auth/LoginForm";
import Layout from "../../layout/Layout";


export default function LoginScreen() {

    return (
        <Layout>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
                <LoginForm />
            </div>
        </Layout>

    );
}
