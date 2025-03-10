import React from 'react'
import { getUser } from '@/utils/getUser'
import BasicTable from '@/components/Table'
import fetchTheTable from '@/actions/tableAction'



export default async function Dashboard(){
  // const { user, error } = await getUser()
  const data = await fetchTheTable()
  console.log('table', data)
  return (
    <div>Dashboard
      <br />
      {/* {user.user?.email} */}
      {/* <BasicTable/> */}
    </div>
  )
}

