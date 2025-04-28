import { getUser } from '@/utils/getUser'
import React from 'react'


export default async function Dashboard(){
  const {user}= await getUser()


  return (
    <div>Dashboard
      <br />
      {user?.email}

    </div>
  )
}

