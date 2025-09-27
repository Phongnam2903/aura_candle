import React from "react";
import Layout from "../../layout/Layout";
import ForgotPasswordForm from "../../components/Auth/ForgotPasswordForm";


export default function ForgotPasswordScreen() {

    return (
        <Layout>
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <ForgotPasswordForm />
            </div>
        </Layout>

    );
}
