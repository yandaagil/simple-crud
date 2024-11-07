import { Dropdown } from 'flowbite-react'
import { User } from '../types/user.type'
import { useFilter } from '../hooks/useFilter'

const FILTER_ITEM = ['Tampilkan Semua', 'Aktif', 'Tidak Aktif']

const Filter = ({ users }: { users: User[] }) => {
  const { filterState, handleFilter } = useFilter({ users })

  return (
    <Dropdown label={`Filter Status: ${filterState}`}>
      {FILTER_ITEM.map((item) =>
        <Dropdown.Item key={item} value={item} onClick={() => handleFilter(item)}>{item}</Dropdown.Item>
      )}
    </Dropdown>
  )
}

export default Filter