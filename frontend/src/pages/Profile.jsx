import React, {useState, useEffect, useRef } from"react";
import { Form, Input, Button, Upload, Image } from "antd";
import {
  MessageOutlined,
  UploadOutlined,
  LogoutOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { editProfile, getMe } from "../redux/slices/authSlice";
import SkeletonProfile from "../components/SkeletonProfile";
import assets from "../assets/assets";
import { toast } from "react-hot-toast";

export default function Profile() {
  const { user, loading, status } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  console.log(user)

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
  if (user) {
      form.setFieldsValue({
       nickname: user.username,
      email: user.email,
       bio: user.bio,
      });
     }
  }, [user]);

 // Handle status separately with ref to prevent infinite loop
 const prevStatusRef = useRef(null);
 
 useEffect(() => {
 if (status && status !== prevStatusRef.current && typeof status === 'string') {
     toast.success(status);
     prevStatusRef.current = status;
    }
  }, [status]);

  const saveEdit = async (values) => {
    try {
      await dispatch(
        editProfile({
          username: values.nickname,
          email: values.email,
          bio: values.bio,
          profilImage: imageFile,
        }),
      ).unwrap();

      // Optionally show success message or redirect
    } catch (error) {
      console.error("Error updating profile:", error);
    }
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
          />
        </Link>

        <div className="text-center mb-6">
          <div className="text-4xl mb-2 flex justify-center">
            <MessageOutlined />
          </div>
          <h1 className="text-2xl font-semibold">Профиль</h1>
        </div>

        {loading ? (
          <SkeletonProfile />
        ) : (
          <Form form={form} layout="vertical" onFinish={saveEdit}>
            {/* AVATAR */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/30 mb-3">
                <img
                  src={
                    preview ||
                    user?.profilImage
                      ? 
                      `http://localhost:3313${user?.profilImage}` 
                      : 
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      
                  }
                  
                  alt="avatar"
                  className="w-auto h-full object-cover"
                />
              </div>

              {console.log(preview)}

              <Upload
                showUploadList={false}
                beforeUpload={(file) => {
                  setImageFile(file);
                  setPreview(URL.createObjectURL(file));
                  return false;
                }}
              >
                <Button
                  icon={<UploadOutlined />}
                  className="!bg-white !text-violet-700 !border-none"
                >
                  Изменить фото
                </Button>
              </Upload>
            </div>

            <Form.Item
              label="Никнейм"
              name="nickname"
              rules={[{ required: true }]}
            >
              <Input className="!bg-white/10 !text-white" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, type: "email" }]}
            >
              <Input className="!bg-white/10 !text-white" />
            </Form.Item>

            <Form.Item label="Био" name="bio">
              <Input.TextArea rows={4} className="!bg-white/10 !text-white" />
            </Form.Item>

            <Button
              htmlType="submit"
              block
              className="!bg-white !text-violet-700 font-semibold"
            >
              Сохранить
            </Button>
          </Form>
        )}
      </motion.div>
    </div>
  );
}
