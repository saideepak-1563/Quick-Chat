import React, { useState } from 'react'
import Search from './Search'
import UserList from './UserList'

const SideBar = ({ socket, onlineUser }) => {

    const [searchKey, setSearchKey] = useState("")

    return (
        <div className="app-sidebar">
            {/*<!--SEARCH USER-->*/}
            <Search
                searchKey={searchKey}
                setSearchKey={setSearchKey} />


            {/*<!--USER LIST-->*/}
            <UserList searchKey={searchKey}
                socket={socket}
                onlineUser={onlineUser} />

        </div>
    )
}

export default SideBar
