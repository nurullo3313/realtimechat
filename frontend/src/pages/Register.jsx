import React, { useEffect, useState } from "react";
import { Form, Input, Button, Upload } from "antd";
import { MessageOutlined, UploadOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../redux/slices/authSlice";
import toast from "react-hot-toast";

export default function Register() {
  const [profilImage, setprofilImage] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate()
    const { token, status } = useSelector((state) => state.auth);
    console.log(status)



  const registerUser = async  () => {
    try {
      dispatch(register({ username, email, password, profilImage }));
      console.log({ username, email, password, profilImage });
        
    } catch (error) {
      console.log(error);
      toast.error("Ошибка регистрации")
    }
  };

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
          <h1 className="text-2xl font-semibold">Онлайн чат</h1>
        </div>

        <Form layout="vertical" onFinish={registerUser}>
          {/* AVATAR */}
          <div className="flex flex-col items-center mb-6">
            <div className="flex justify-self-center items-center w-24 h-24 rounded-full overflow-hidden border-2 border-white/30 mb-3">
              <img
                src={
                  profilImage
                    ? profilImage
                    : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>

            <Upload
              showUploadList={false}
              beforeUpload={() => false}
              onChange={(info) => {
                const file =
                  (info && info.file && info.file.originFileObj) || info.file;
                if (file) {
                  if (profilImage) {
                    try {
                      URL.revokeObjectURL(profilImage);
                    } catch (e) {}
                  }
                  const previewUrl = URL.createObjectURL(file);
                  setprofilImage(previewUrl);
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
            name="username"
            rules={[{ required: true, message: "Введите никнейм" }]}
          >
            <Input
              placeholder="Ваш никнейм"
              className="!bg-white/10 !text-white placeholder:!text-white/60 !border-white/30 rounded-xl py-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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