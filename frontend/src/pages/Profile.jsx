import React, { useState, useEffect } from "react";
import { Form, Input, Button, Upload } from "antd";
import { MessageOutlined, UploadOutlined, LogoutOutlined, LeftOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Profile() {
  // Данные профиля (можно подключить сервер)
  const [user, setUser] = useState({
    nickname: "Нурулло",
    email: "nurullo@example.com",
    avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    bio: "",
  });

  const [imageUrl, setImageUrl] = useState(user.avatar);


  const handleSave = (values) => {
    setUser({
      ...user,
      nickname: values.nickname,
      email: values.email,
      avatar: imageUrl,
      bio: values.bio,
    });
    console.log("Updated profile:", {
      ...user,
      nickname: values.nickname,
      email: values.email,
      avatar: imageUrl,
      bio: values.bio,
    });
  };

  return (
    <div className="w-full h-screen backdrop-blur-xl flex justify-center items-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8 w-full max-w-md text-white"
      >
        <Link to="/" className="absolute top-4 left-4">
          <Button
            icon={<LeftOutlined />}
            shape="circle"
            className="!bg-white/10 !text-white/80 hover:!bg-white/20"
            aria-label="Назад"
          />
        </Link>
        {/* HEADER */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2 flex justify-center">
            <MessageOutlined />
          </div>
          <h1 className="text-2xl font-semibold">Профиль</h1>
        </div>

        <Form
          layout="vertical"
          initialValues={{
            nickname: user.nickname,
            email: user.email,
            bio: user.bio,
          }}
          onFinish={handleSave}
        >
          {/* AVATAR */}
          <div className="flex flex-col items-center mb-6">
            <div className="flex justify-center items-center w-24 h-24 rounded-full overflow-hidden border-2 border-white/30 mb-3">
              <img
                src={imageUrl}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <Upload
              showUploadList={false}
              beforeUpload={() => false}
              onChange={(info) => {
                const file = (info && info.file && info.file.originFileObj) || info.file;
                if (file) {
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
                Изменить фото
              </Button>
            </Upload>
          </div>

          {/* NICKNAME */}
          <Form.Item
            label="Никнейм"
            name="nickname"
            rules={[{ required: true, message: "Введите никнейм" }]}
          >
            <Input
              className="!bg-white/10 !text-white placeholder:!text-white/60 !border-white/30 rounded-xl py-2"
            />
          </Form.Item>

          {/* EMAIL */}
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Введите email" },
              { type: "email", message: "Введите корректный email" },
            ]}
          >
            <Input
              className="!bg-white/10 !text-white placeholder:!text-white/60 !border-white/30 rounded-xl py-2"
            />
          </Form.Item>

          {/* BIO */}
          <Form.Item label="Био" name="bio">
            <Input.TextArea
              rows={4}
              placeholder="Расскажите немного о себе"
              className="!bg-white/10 !text-white placeholder:!text-white/60 !border-white/30 rounded-xl py-2"
            />
          </Form.Item>

          {/* BUTTONS */}
          <div className="mt-4 flex flex-col gap-4">
            <Button
              htmlType="submit"
              block
              className="!bg-white !text-violet-700 !border-none font-semibold py-3 rounded-xl hover:!bg-white/90"
            >
              Сохранить
            </Button>
            <Button
              icon={<LogoutOutlined />}
              block
              className="!bg-white/20 !text-red-500 !border-none font-semibold py-3 rounded-xl hover:!bg-white/30"
            >
              Выйти
            </Button>
          </div>
        </Form>
      </motion.div>
    </div>
  );
}
