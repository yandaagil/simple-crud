import React, { FC, useState } from 'react';
import { Button, Modal, Label, TextInput, Select } from 'flowbite-react';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../types/user.type';
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useUserStore } from '../stores/user.store';
import toast from 'react-hot-toast';

type ModalState = {
  isOpen: boolean;
  type: 'add' | 'edit' | 'delete' | null;
  userData: User | null;
}

type ActionModal = {
  user?: User;
  type: 'add' | 'edit' | 'delete';
}

const initialFormData: User = {
  id: '',
  nama: '',
  email: '',
  umur: 0,
  status: false,
};

const initialModalState: ModalState = {
  isOpen: false,
  type: null,
  userData: null,
}

const ActionModal: FC<ActionModal> = ({ user, type }) => {
  const { users, setUsers } = useUserStore();
  const [modalState, setModalState] = useState<ModalState>(initialModalState);
  const [formData, setFormData] = useState<User>(initialFormData);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Handle perubahan input user pada form kemudian dimasukkan ke dalam state formData
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) :
        name === 'status' ? value === 'true' :
          value
    }));
  };

  // Handle membuka modal, set modalState dan formData
  const openModal = (type: ModalState['type'], user?: User) => {
    setModalState({
      isOpen: true,
      type,
      userData: user || null,
    });
    if (type === 'edit' && user) {
      setFormData(user);
    } else {
      setFormData(initialFormData);
    }
  };

  // Handle menutup modal, mengembalikan modalState dan formData ke value initial
  const closeModal = () => {
    setModalState(initialModalState);
    setFormData(initialFormData);
  };

  // Handle operasi tambah dan update data berdasakan tipe modalState yang ditrigger oleh user
  // Data user yang sudah diupdate atau ditambahkan akan disimpan di localStorage
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let newUsers: User[];

      if (modalState.type === 'add') {
        const newUser = { ...formData, id: uuidv4() };
        newUsers = [...users, newUser];
      } else if (modalState.type === 'edit') {
        newUsers = users.map((user) =>
          user.id === formData.id ? formData : user
        );
      } else {
        return;
      }

      localStorage.setItem('data', JSON.stringify(newUsers));
      setUsers(newUsers);
      toast.success(`Data user berhasil ${modalState.type === 'add' ? 'ditambahkan' : 'diupdate'}`);
      setIsLoading(false);
      closeModal();
    } catch (err) {
      setIsLoading(false);
      toast.error(`Gagal ${modalState.type === 'add' ? 'menambah' : 'mengupdate'} data user`);
      console.log(err);
    }
  };

  // Handle operasi hapus data user dari local storage berdasarkan id user yang dipilih
  const handleDelete = (id: string) => {
    setIsLoading(true);
    try {
      const newUsers = users.filter((user) => user.id !== id);
      localStorage.setItem('data', JSON.stringify(newUsers));
      setUsers(newUsers);
      toast.success('Data user berhasil dihapus');
      setIsLoading(false);
      closeModal();
    } catch (err) {
      setIsLoading(false);
      toast.error('Gagal menghapus data user');
      console.log(err);
    }
  };

  return (
    <>
      {type === 'add' ? (
        <Button color="blue" onClick={() => openModal('add')}>
          Tambah
        </Button>
      ) : type === 'edit' ? (
        <a className="font-medium text-cyan-600 hover:underline cursor-pointer" onClick={() => openModal('edit', user)}>
          Ubah
        </a>
      ) : (
        <a className="font-medium text-red-600 hover:underline cursor-pointer" onClick={() => openModal('delete', user)}>
          Hapus
        </a>
      )}

      <Modal
        position="top-center"
        onClose={closeModal}
        show={modalState.isOpen}
        size={modalState.type === 'delete' ? 'md' : '2xl'}
        popup={modalState.type === 'delete' && true}
      >
        <Modal.Header>
          {modalState.type === 'add' ? 'Tambah User' :
            modalState.type === 'edit' ? 'Edit User' :
              null}
        </Modal.Header>
        <Modal.Body>
          {modalState.type === 'delete' ? (
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Anda yakin ingin menghapus data user ini?
              </h3>
              <div className="flex justify-center gap-2">
                <Button color="failure" onClick={() => modalState.userData && handleDelete(modalState.userData.id)}>
                  {isLoading ? 'Menghapus...' : 'Hapus'}
                </Button>
                <Button color="light" onClick={closeModal}>
                  Batal
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nama">Nama</Label>
                  <TextInput
                    id="nama"
                    name="nama"
                    placeholder='Tulis nama lengkap'
                    defaultValue={formData.nama}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <TextInput
                    id="email"
                    name="email"
                    type="email"
                    placeholder='Tulis Email'
                    pattern='[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'
                    defaultValue={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="umur">Umur</Label>
                  <TextInput
                    id="umur"
                    name="umur"
                    type="number"
                    min={1}
                    placeholder='Masukkan umur'
                    defaultValue={formData.umur}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status Keanggotaan</Label>
                  <Select
                    id="status"
                    name="status"
                    defaultValue={formData.status.toString()}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="false">Tidak Aktif</option>
                    <option value="true">Aktif</option>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button type="submit">
                  {(modalState.type === 'add' && isLoading) ? 'Menambahkan' :
                    (modalState.type === 'add' && !isLoading) ? 'Tambah' :
                      (modalState.type === 'edit' && isLoading) ? 'Mengupdate' :
                        'Update'}
                </Button>
                <Button type='submit' color='light' onClick={closeModal}>
                  Batal
                </Button>
              </div>
            </form>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ActionModal;