import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import { editUserService } from "../services/tasteit.services.js";

//Antd
import { Modal, Form, Input } from "antd";
const { Item } = Form;

function EditProfileModal() {
  // Context/navigate
  const navigate = useNavigate();
  const { user, authenticateUser } = useContext(AuthContext);

  // Error message from backend
  const [errorMessage, setErrorMessage] = useState("");

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Cloudinary State
  const [image, setImage] = useState("");

  // Form states
  const [editProfileForm, setEditProfileForm] = useState({
    name: "",
    email: "",
    age: "",
    password: "",
  });

  //Form submit function
  const handleEditProfile = async () => {
    // Data transmission element
    const formValue = new FormData();
    formValue.append("name", editProfileForm.name);
    formValue.append("email", editProfileForm.email);
    formValue.append("age", editProfileForm.age);
    formValue.append("password", editProfileForm.password);
    formValue.append("image", image);

    try {
      await editUserService(user._id, formValue);
      setConfirmLoading(true);

      setTimeout(() => {
        setOpen(false);
        setConfirmLoading(false);
        authenticateUser();
      }, 2000);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.errorMessage);
      } else {
        navigate("/error");
      }
    }
  };

  // Modal functions
  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    handleEditProfile();
  };

  const handleCancel = () => {
    setOpen(false);
    setErrorMessage("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditProfileForm({ ...editProfileForm, [name]: value });
  };

  return (
    <>
      <button
        className="main-buttons edit-button profile-btn"
        onClick={showModal}
      >
        Editar Perfil
      </button>
      <Modal
        title="Editar perfil"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        destroyOnClose
      >
        <div>
          <Form>
            <Item label="Nombre">
              <Input name="name" onChange={handleChange} />
            </Item>
            <Item label="Email">
              <Input name="email" onChange={handleChange} />
            </Item>
            <Item label="Edad">
              <Input name="age" onChange={handleChange} />
            </Item>
            <Item label="Contraseña">
              <Input.Password name="password" onChange={handleChange} />
            </Item>
            <Item label="Foto de perfil">
              <Input
                type="file"
                onChange={(event) => setImage(event.target.files[0])}
              />
            </Item>
            {errorMessage !== "" && (
              <p className="error-message">{errorMessage}</p>
            )}
          </Form>
        </div>
      </Modal>
    </>
  );
}

export default EditProfileModal;
