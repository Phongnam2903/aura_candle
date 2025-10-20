import React from "react";
import Layout from "../../layout/Layout";
import RegisterForm from "../../components/Auth/RegisterForm";


export default function RegisterScreen() {

    return (
        <Layout>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
                <RegisterForm />
            </div>
        </Layout>
    );
}
