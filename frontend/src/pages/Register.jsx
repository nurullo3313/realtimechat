import React, { useEffect, useState } from "react";
import { Form, Input, Button, Upload } from "antd";
import { MessageOutlined, UploadOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import {Link} from "react-router-dom"


export default function Register() {
  const [imageUrl, setImageUrl] = useState(null);
  
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
          <h1 className="text-2xl font-semibold">Онлайн чат</h1>
        </div>

        <Form layout="vertical">
          {/* AVATAR */}
          <div className="flex flex-col items-center mb-6">
            <div className="flex justify-self-center items-center w-24 h-24 rounded-full overflow-hidden border-2 border-white/30 mb-3">
              <img
                src={
                  imageUrl
                    ? imageUrl
                    : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="avatar"
                className="w-full  h-full object-cover"
              />
            </div>

            <Upload
              showUploadList={false}
              beforeUpload={() => false}
              onChange={(info) => {
                const file = (info && info.file && info.file.originFileObj) || info.file;
                if (file) {
                  // revoke previous preview to avoid memory leaks
                  if (imageUrl) {
                    try {
                      URL.revokeObjectURL(imageUrl);
                    } catch (e) {}
                  }
                  const previewUrl = URL.createObjectURL(file);
                  setImageUrl(previewUrl);
                }
              }}
            >
              <Button
                icon={<UploadOutlined />}
                className="!bg-white !text-violet-700 !border-none hover:!bg-white/90"
              >
                Загрузить фото
              </Button>
            </Upload>
          </div>

          {/* NICKNAME */}
          <Form.Item
            name="nickname"
            rules={[{ required: true, message: "Введите никнейм" }]}
          >
            <Input
              placeholder="Ваш никнейм"
              className="!bg-white/10 !text-white placeholder:!text-white/60 !border-white/30 rounded-xl py-2"
            />
          </Form.Item>

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

          {/* PASSWORD с глазиком */}
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
              Зарегистрироваться
            </Button>
          </Form.Item>
          <div className="text-center mt-4">
            <Link
              to="/login"
              className="text-sm text-white/70 hover:text-white underline transition-colors"
            >
              У меня есть аккаунт
            </Link>
          </div>
        </Form>
      </motion.div>
    </div>
  );
}
