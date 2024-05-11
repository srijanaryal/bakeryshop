import React from "react";
import './login.css'
import { Formik, Form, Field, ErrorMessage } from "formik";
import { addUserDetails } from "../../redux/actions/userAction"
import { Link } from "react-router-dom";
import * as Yup from "yup";
import HandlePassword from "../../components/handlePasword";
import {message} from 'antd'
import { useDispatch } from "react-redux";


const Login = () => {

const dispatch=useDispatch()

    const loginSchema = Yup.object().shape({
        email: Yup.string().email().required("Email is required"),
        password: Yup.string()
            .min(5, 'Password must be at least 8 characters')
            .max(50, 'Password can only be 50 characters or less')
            .required('Password is required'),
    });


    return (
        <>
        <div className="login-container">
                <div className="login-box" >
                    <div className="left-side">
                        <h5>Welcome to login page</h5>
                        <Formik
                            initialValues={{ email: '', password: '' }}
                            validationSchema={loginSchema}
                            onSubmit={async (values, { resetForm }) => {
                                const requestOptions = {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify(values),
                                }
                                const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_FIREBASE_API_KEY}`, requestOptions);
                                const data = await res.json()
                                if (data.isLogedin) {
                                    dispatch(addUserDetails(data.userData))
                                    message.success(data.msg,[2])

                                } else {
                                  message.error(data.errorMsg,[2],)
                                }
                                
                                resetForm({values: '' })
                            }
                            }
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <Field type="tel" name="email" placeholder="Email Address" />
                                    <ErrorMessage name="email" component="div" />
                                    <HandlePassword />
                                    <button type="submit" className="login-btn">
                                        Log in
                                    </button>
                                </Form>
                            )}
                        </Formik>

                    </div>
                    <div>
                        <span><Link to='/signup'>Create an account </Link></span>
                    </div>
                </div>
            </div >
        </>
    );
};

export default Login;