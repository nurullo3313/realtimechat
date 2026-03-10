import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

export const register = createAsyncThunk(
  "authSlice/register",
  async ({ username, email, password, profilImage }, { rejectWithValue }) => {
    try {
      const res = await axios.post("/auth/register", {
        username,
        email,
        password,
        profilImage,
      });

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      }
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg);
    }
  },
);

export const login = createAsyncThunk(
  "authSlice/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post("/auth/login", { email, password });
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      }
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg);
    }
  },
);

export const getMe = createAsyncThunk(
  "authSlice/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/auth/check-auth");
      return data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg);
    }
  },
);

export const editProfile = createAsyncThunk(
  "authSlice/editProfile",
  async ({ username, email, bio, profilImage }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("bio", bio);
      if (profilImage) {
        formData.append("profilImage", profilImage);
      }

      const { data } = await axios.put("/auth/edit-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "Ошибка обновления профиля",
      );
    }
  },
);
const authSlice = createSlice({
  name: "authSlice",
  initialState: {
   user: null,
    token: localStorage.getItem("token") || null,
   loading: false,
    status: null,
   error: null,
   contacts: null,
    onlineUsers: [], // Array of online user IDs
  },
 reducers: {
   logout: (state) => {
      state.user = null;
      state.token = null;
     localStorage.removeItem("user");
     localStorage.removeItem("token");
      state.status = null;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      //register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.status = action.payload.msg;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.status = action.payload.msg;
        state.user= action.payload.userData;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //get me
      .addCase(getMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.status = action.payload.msg;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //edit profile

      .addCase(editProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user; // обновляем user
        state.status = action.payload.msg
      })
      .addCase(editProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, setOnlineUsers } = authSlice.actions;
export default authSlice.reducer;
