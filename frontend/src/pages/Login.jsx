import React from "react";
import { Form, Input, Button } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/slices/authSlice";
import { useEffect } from "react";

export default function Login() {

  const [email , setEmail] = useState("")
  const [password , setPassword] = useState("")
  const {status, token, user} = useSelector(state=> state.auth)
  console.log(user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const loginHendler = async ()=>{
    try {
    await dispatch(login({ email, password })).unwrap();
    } catch (error) {
      console.log(error)
      toast.error(error);
    }
  }

    useEffect(() => {
     if (token) {
        navigate("/", { replace: true });
      }
    if(status && typeof status === 'string'){
       toast.success(status)
       }
    }, [token, navigate,status]);

  return (
    <div className="w-full h-screen backdrop-blur-xl flex justify-center items-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8 w-full max-w-md text-white"
      >
        {/* HEADER */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2 flex justify-center">
            <MessageOutlined />
          </div>
          <h1 className="text-2xl font-semibold">Вход в чат</h1>
        </div>

        <Form layout="vertical" onFinish={loginHendler}>
  <Form.Item
    name="email"
    rules={[{ required: true, message: "Введите email" }]}
  >
    <Input
      type="email"
      placeholder="Ваш email"
      value={email}
      onChange={(e)=>setEmail(e.target.value)}
      className="!bg-white/10 !text-white placeholder:!text-white/60 !border-white/30 rounded-xl py-2"
    />
  </Form.Item>

  <Form.Item
    name="password"
    rules={[{ required: true, message: "Введите пароль" }]}
  >
    <Input.Password
      placeholder="Ваш пароль"
      value={password}
      onChange={(e)=>setPassword(e.target.value)}
      className="!bg-white/10 !text-white placeholder:!text-white/60 !border-white/30 rounded-xl py-2"
    />
  </Form.Item>

  <Form.Item>
    <Button htmlType="submit" block className="!bg-white !text-violet-700 !border-none font-semibold py-5 rounded-xl hover:!bg-white/90">
      Войти
    </Button>
  </Form.Item>
<div className="text-center mt-4"> <Link to="/register" className="text-sm text-white/70 hover:text-white underline transition-colors" > У меня нет аккаунт </Link> </div>

</Form>
      </motion.div>
    </div>
  );
}
