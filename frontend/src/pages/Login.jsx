import React from "react";
import { Form, Input, Button } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Login() {
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

        <Form layout="vertical">
          {/* EMAIL */}
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Введите email" }]}
          >
            <Input
              type="email"
              placeholder="Ваш email"
              className="!bg-white/10 !text-white placeholder:!text-white/60 !border-white/30 rounded-xl py-2"
            />
          </Form.Item>

          {/* PASSWORD */}
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Введите пароль" }]}
          >
            <Input.Password
              placeholder="Ваш пароль"
              className="!bg-white/10 !text-white placeholder:!text-white/60 !border-white/30 rounded-xl py-2"
            />
          </Form.Item>

          {/* BUTTON */}
          <Form.Item>
            <Button
              htmlType="submit"
              block
              className="!bg-white !text-violet-700 !border-none font-semibold py-5 rounded-xl hover:!bg-white/90"
            >
              Войти
            </Button>
          </Form.Item>

          <div className="text-center mt-4">
            <Link
              to="/register"
              className="text-sm text-white/70 hover:text-white underline transition-colors"
            >
              У меня нет аккаунт
            </Link>
          </div>
        </Form>
      </motion.div>
    </div>
  );
}
