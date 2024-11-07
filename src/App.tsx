/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import axios from "axios";
import { Table } from "flowbite-react";
import { Badge } from "flowbite-react";
import { TABLE_HEAD } from "./constants/table.constant";
import { useUserStore } from "./stores/user.store";
import ActionModal from "./components/modal";
import { LuChevronsUpDown, LuChevronDown, LuChevronUp } from "react-icons/lu";
import { User } from "./types/user.type";
import { useSort } from "./hooks/useSort";
import Filter from "./components/filter";
import toast from "react-hot-toast";

function App() {
  const { users, setUsers, sortedData, filteredData } = useUserStore()
  const { sortConfig, sortTable } = useSort();
  const data = sortedData.length ? sortedData : filteredData.length ? filteredData : users

  useEffect(() => {
    // Mengambil data dari API jika data tidak ada di local storage
    // Kemudian menyimpan data ke local storage jika data berhasil diambil dari API
    const cachedUsers = localStorage.getItem('data')
    if (!cachedUsers || cachedUsers === '[]') {
      const fetchUsers = async () => {
        let users: User[] = []
        try {
          const { data } = await axios.get("https://api.github.com/users");
          users = data.map((user: any) => ({
            id: user.id,
            nama: user.login,
            email: user.url,
            umur: user.id,
            status: user.site_admin,
          }));
          setUsers(users)
          localStorage.setItem('data', JSON.stringify(users))
          toast.success("Data berhasil diambil dari API");
        } catch (error) {
          console.log(error);
          toast.error("Gagal mengambil data dari API");
        }
      };

      fetchUsers();
    } else {
      setUsers(JSON.parse(cachedUsers))
      toast.success("Data berhasil diambil dari local storage");
    }
  }, [setUsers]);

  return (
    <main className="p-10 space-y-5">
      <div className="flex justify-between">
        <ActionModal type="add" />
        <Filter users={users} />
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <Table striped>
          <Table.Head>
            {TABLE_HEAD.map((head) => (
              // Implementasi fitur sorting pada table head
              <Table.HeadCell key={head.id} className="cursor-pointer" onClick={() => sortTable(head.id as keyof User)}>
                <div className="flex justify-between">
                  {head.label}
                  <button>
                    {(sortConfig.key === head.id && sortConfig.direction === 'ascending') ? <LuChevronUp size={14} /> :
                      (sortConfig.key === head.id && sortConfig.direction === 'descending') ? <LuChevronDown size={14} /> :
                        <LuChevronsUpDown size={14} />}
                  </button>
                </div>
              </Table.HeadCell>
            ))}
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>

          <Table.Body className="divide-y">
            {data.map((data) => (
              <Table.Row key={data.id} className="bg-white">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900">
                  {data.nama}
                </Table.Cell>
                <Table.Cell>{data.email}</Table.Cell>
                <Table.Cell>{`${data.umur} tahun`}</Table.Cell>
                <Table.Cell>
                  <div className="flex">
                    <Badge
                      color={data.status ? "success" : "failure"}
                    >
                      {data.status ? "Aktif" : "Tidak Aktif"}
                    </Badge>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="space-x-5">
                    <ActionModal type='edit' user={data} />
                    <ActionModal type='delete' user={data} />
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </main>
  );
}

export default App;
